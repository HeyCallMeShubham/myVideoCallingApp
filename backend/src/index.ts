
import * as mediasoup from "mediasoup";

import express, { Request, Response, NextFunction } from "express";

import { types as mediasoupTypes } from "mediasoup";

import https from "https"

import path from "path"

import bodyParser from "body-parser";

import cookieParser from "cookie-parser";

import cors from "cors";

import fs from "fs"

import { Server, Socket } from "socket.io"
import { rtpHeaderExtensionUriFromFbs } from "mediasoup/node/lib/RtpParameters";
import { DtlsParameters } from "mediasoup/node/lib/fbs/web-rtc-transport";
import { RtpParameters } from "mediasoup/node/lib/fbs/rtp-parameters";





const app = express();




app.use(cors({

    origin: ["http://localhost:3000", 'http://192.168.1.3:3000'],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"] // Allow the Cookie header

}));

app.use(bodyParser.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));








const mediaCodecs: mediasoupTypes.RtpCodecCapability[] = [
    {
        kind: "audio",
        mimeType: "audio/opus",
        clockRate: 48000,
        channels: 2


    },
    {
        kind: "video",
        mimeType: "video/VP8",
        clockRate: 90000,
        parameters: {

            "x-google-start-bitrate": 1000

        }


    },


]




let worker: mediasoupTypes.Worker | undefined;

let rooms: any = {};

let rooms2: any = new Map();




let joinedUsers: any = {};

let joinedUsers2: any = new Map();;




let transports: any = [];

let transports2: any = new Map();





let consumers: any = [];

let consumers2: any = new Map();




let producers: any = [];

let producers2: any = new Map();








const createWorker = async () => {

    try {

        worker = await mediasoup.createWorker({

            rtcMinPort: 4000,
            rtcMaxPort: 5250

        });

        worker.on("died", (error) => {

            setTimeout(() => {

                process.exit(1);

            }, 2000);

        })

        return worker;

    } catch (err) {

        console.log(err);

    }

}





(async () => {

    worker = await createWorker();

})()



interface IHttpsOptions {
    key: Buffer,
    cert: Buffer
}



const getCertOptions = (): IHttpsOptions | null => {
    try {
        const key = fs.readFileSync(path.resolve(__dirname, "../certs/cert.key"));
        const cert = fs.readFileSync(path.resolve(__dirname, "../certs/cert.crt"));
        return { key, cert };
    } catch (err) {
        console.error("Error reading SSL certificate files:", err);
        return null;
    }
}



const httpOptions = getCertOptions();
if (!httpOptions) {
    throw new Error("Failed to load SSL certificate files. Server cannot start.");
}






const httpsServer = https.createServer(httpOptions, app);





const io = new Server(httpsServer, {

    cors: {

        origin: ["http://localhost:3000", "http://192.168.1.3:3000"]

    }

});



const sockets = new Map();



io.on("connection", async (socket: Socket) => {


    console.log(socket.id, "socketId");

    sockets.set(socket.id, socket);



    socket.emit("connection-success", socket.id);



    socket.on("joinRoom", async ({ roomName }: { roomName: string }, callback: Function) => {

        const router = await createRoom(roomName, socket.id);

        joinedUsers[socket.id] = {

            socket,
            router,
            roomName,
            transports: [],
            producers: [],
            consumers: [],
            userDetails: {

                name: "",
                isAdmin: false

            }

        }


        const rtpCapabilities: mediasoupTypes.RtpCapabilities | undefined = router?.rtpCapabilities

        callback({ rtpCapabilities });


    });



    socket.on("createWebRtcTransport", async ({ consumer }: { consumer: boolean }, callback: Function) => {

        try {

            const roomName = joinedUsers[socket.id].roomName;

            const router = rooms[roomName].router;

            const transport = await createWebrtcTransport(router, socket.id, callback);

            addTransport(transport, socket.id, roomName, consumer);

        } catch (err) {

            console.log(err);

        }

    });


    socket.on("transport-connect", async ({ dtlsParameters }: { dtlsParameters: mediasoupTypes.DtlsParameters }, callback: Function) => {

        const roomName = joinedUsers[socket.id].roomName

        const producerTransport = transports.find((transportData: any) => transportData.socketId === socket.id && !transportData.consumer && transportData.roomName === roomName);


        await producerTransport.transport.connect({ dtlsParameters });

    });





    socket.on("transport-produce", async ({ kind, rtpParameters }: { kind: mediasoupTypes.MediaKind, rtpParameters: mediasoupTypes.RtpParameters }, callback: Function) => {

        const roomName = joinedUsers[socket.id].roomName;

        const producerTransport = transports.find((transportData: any) => transportData.socketId === socket.id && !transportData.consumer && transportData.roomName === roomName);

        const producer = await producerTransport.transport.produce({ kind, rtpParameters });

        addProducer(producer, socket.id, roomName);

        informConsumers(producer.id, roomName, socket.id);

        callback({ id: producer.id, producersExist: producers.length > 1 ? true : false })

    });





    socket.on("transport-recv-connect", async ({ dtlsParameters, serverConsumerTransportId }, callback: Function) => {

        const roomName = joinedUsers[socket.id].roomName


        const consumerTransport = transports.find((transportData: any) => transportData.consumer == true && transportData.transport.id == serverConsumerTransportId).transport;

        await consumerTransport.connect({ dtlsParameters });

    });




    socket.on("getProducers", (callback: Function) => {

        const roomName = joinedUsers[socket.id]?.roomName;

        let producerList: any = []
        producers.forEach((producerData: any) => {
            if (producerData.socketId !== socket.id && producerData.roomName === roomName) {
                producerList = [...producerList, producerData.producer.id]
            }
        })

        // return the producer list back to the client

        callback(producerList)

    });




    socket.on("consume", async ({ rtpCapabilities, remoteProducerId, serverConsumerTransportId }, callback: Function) => {

        try {

            const roomName = joinedUsers[socket.id]?.roomName

            const router = rooms[roomName]?.router

            if (router.canConsume({

                producerId: remoteProducerId,
                rtpCapabilities,
                paused: true


            })) {

                const consumerTransport = transports.find((transportData: any) => transportData.consumer && transportData.transport.id === serverConsumerTransportId).transport;

                const consumer: any = await consumerTransport.consume({

                    producerId: remoteProducerId,
                    rtpCapabilities,
                    paused: true
                });


                addConsumer(consumer, roomName, socket.id);


                callback({

                    params: {

                        id: consumer.id,
                        producerId: remoteProducerId,
                        kind: consumer.kind,
                        rtpParameters: consumer.rtpParameters,
                        serverConsumerId: consumer.id,
                    }

                });
            }


        } catch (err) {

            console.log(err);

        }

    })




    socket.on('consumer-resume', async ({ serverConsumerId }) => {

        const consumer = consumers.find((consumerData: any) => consumerData.consumer?.id == serverConsumerId).consumer;

        await consumer.resume();


    });

});





const createRoom = async (roomName: string, socketId: string) => {

    try {

        let router: mediasoupTypes.Router | undefined

        let joinedUsers: any[] | undefined;

        if (rooms[roomName]) {

            router = rooms[roomName]?.router
            joinedUsers = rooms[roomName]?.joinedUsers

        } else {

            router = await worker?.createRouter({ mediaCodecs });

        }


        rooms[roomName] = {

            router: router,
            joinedUsers: joinedUsers

        }

        return router

    } catch (err) {

        console.log(err);

    }

}




const createWebrtcTransport = async (router: mediasoupTypes.Router, socketId: string, callback: Function) => {

    try {

        const webRtcTransportOptions: any = {

            listenInfos: [{

                protocal: 'udp',
                ip: "0.0.0.0",
                announcedAddress: "192.168.1.2"

            }],

            enableUdp: true,
            enableTcp: true,
            preferUdp: true,
            preferTcp: true,

        }


        const transport: mediasoupTypes.Transport | any = await router?.createWebRtcTransport(webRtcTransportOptions);




        callback({

            params: {

                id: transport?.id,
                iceParameters: transport?.iceParameters,
                iceCandidates: transport?.iceCandidates,
                dtlsParameters: transport?.dtlsParameters,

            }

        });


        return transport

    } catch (err) {

        console.log(err);

    }

}








const addTransport = async (transport: mediasoupTypes.Transport, socketId: string, roomName: string, consumer: boolean) => {

    try {

        transports = [

            ...transports,
            { socketId, transport, roomName, consumer }


        ]

        joinedUsers[socketId] = {

            ...joinedUsers[socketId],
            transports: [

                ...joinedUsers[socketId].transports,
                transport.id

            ]


        }


    } catch (err) {

        console.log(err);

    }

}




const addProducer = async (producer: mediasoupTypes.Producer, socketId: string, roomName: string,) => {

    try {

        producers = [

            ...producers,
            { socketId, producer, roomName }

        ];




        joinedUsers[socketId] = {

            ...joinedUsers[socketId],
            producers: [...joinedUsers[socketId].producers, producer.id]

        }


    } catch (err) {

        console.log(err);

    }

}




const addConsumer = async (consumer: mediasoupTypes.Consumer, roomName: string, socketId: string,) => {

    try {

        consumers = [

            ...consumers,
            { socketId, consumer, roomName }

        ]


        joinedUsers[socketId] = {

            ...joinedUsers[socketId],
            consumers: [...joinedUsers[socketId].consumers, consumer.id]

        }



    } catch (err) {

        console.log(err);

    }

}





const informConsumers = async (id: string, roomName: string, socketId: string) => {

    try {

        const roomMembers = producers.filter((producerData: any) => producerData.socketId !== socketId && producerData.roomName === roomName)

        roomMembers.forEach((roomMemberData: any) => {

            const producerSocket = joinedUsers[roomMemberData.socketId].socket

            producerSocket.emit("new-producer", { producerId: id });

        })

    } catch (err) {

        console.log(err);

    }

}





httpsServer.listen(4000, () => {

    console.log(4000, `listening on this port ${4000}`);

});












