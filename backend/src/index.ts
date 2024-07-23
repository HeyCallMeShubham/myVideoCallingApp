
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

let peers: any = {};

let transports: any = [];

let producers: any = [];

let consumers: any = [];






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

    console.log("user id", socket.id);

    sockets.set(socket.id, socket);

    socket.emit("connection-successful", { socketId: socket.id });


    socket.on("joinRoom", async ({ roomName }, callback) => {

        console.log("roomname", roomName);

        try {

            const router1 = await createRoom(roomName, socket.id);

            const userSocket = sockets.get(socket.id);

            peers[socket.id] = {

                socket: userSocket,
                roomName,
                transports: [],
                producers: [],
                consumers: [],
                peersDetails: {

                    name: "",
                    isAdmin: false,

                }

            }


            callback({ rtpCapabilities: router1?.rtpCapabilities })



        } catch (err) {

            console.log(err);

        }

    });



    socket.on("createWebRtcTransport", async ({ consumer }, callback) => {

        const roomName = peers[socket.id].roomName;

        const router = rooms[roomName].router;

        const transport = await createWebRtcTransport(router, socket.id, callback)


        addTransport(transport, roomName, consumer, socket.id);

    });



    socket.on("transport-connect", async ({ dtlsParameters }: { dtlsParameters: mediasoupTypes.DtlsParameters }) => {

        const [producerTransport] = transports.filter((transport: any) => transport.socketId === socket.id && !transport.consumer)

        await producerTransport.transport.connect({ dtlsParameters });

    });



    socket.on("transport-produce", async ({ kind, rtpParameters }, callback) => {


        const [producerTransport] = transports.filter((transport: any) => transport.socketId === socket.id && !transport.consumer)

        const producer = await producerTransport.transport.produce({ kind, rtpParameters });

        const { roomName } = peers[socket.id];

        addProducer(producer, roomName, socket.id);

        informConsumers(roomName, socket.id, producer.id);


        producer.on('transportclose', () => {
            console.log('transport for this producer closed ')
            producer.close()
        });


        callback({

            id: producer.id,
            producersExist: producers.length > 1 ? true : false

        });



    });




    socket.on("transport-recv-connect", async ({ dtlsParameters, serverConsumerTransportId }) => {

        console.log('transport-recv-connect', serverConsumerTransportId)

        const consumerTransport: any = transports.find((transportData: any) => transportData.consumer && transportData.transport.id == serverConsumerTransportId).transport


        console.log(consumerTransport, 'consumerTransport');

        await consumerTransport.connect({ dtlsParameters });

    });



    socket.on("getProducers", callback => {

        const { roomName } = peers[socket.id];

        let producerList: any = [];

        producers.forEach((producerData: any) => {

            if (producerData.socketId !== socket.id && producerData.roomName === roomName) {

                producerList = [...producerList, producerData.producer.id]

            }

        });

        callback(producerList)


    })





    socket.on("consume", async ({ rtpCapabilities, remoteProducerId, serverConsumerTransportId }: { rtpCapabilities: mediasoupTypes.RtpCapabilities, remoteProducerId: string, serverConsumerTransportId: string }, callback: Function) => {

        try {


            const { roomName } = peers[socket.id];


            const router = rooms[roomName].router


            let consumerTransport: any = transports.find((transportData: any) => transportData?.consumer && transportData.transport.id == serverConsumerTransportId).transport



            if (router.canConsume({

                producerId: remoteProducerId,
                rtpCapabilities

            })) {


                const consumer = await consumerTransport.consume({

                    producerId: remoteProducerId,
                    rtpCapabilities,
                    paused: true

                });



                consumer.on('transportclose', () => {
                    console.log('transport close from consumer')
                })

                consumer.on('producerclose', () => {
                    console.log('producer of consumer closed')
                    socket.emit('producer-closed', { remoteProducerId })

                    consumerTransport.close([])
                    transports = transports.filter((transportData: any) => transportData.transport.id !== consumerTransport.id)
                    consumer.close()
                    consumers = consumers.filter((consumerData: any) => consumerData.consumer.id !== consumer.id)
                });



                addConsumer(consumer, roomName, socket.id);



                const params: any = {

                    id: consumer.id,
                    producerId: remoteProducerId,
                    kind: consumer.kind,
                    rtpParameters: consumer.rtpParameters,
                    serverConsumerId: consumer.id

                }

                callback({ params })
            }

        } catch (err) {

            console.log(err);

        }

    })





    socket.on("consumer-resume", async ({ serverConsumerId }) => {

        const { consumer } = consumers.find((consumerData: any) => consumerData.consumer.id === serverConsumerId);

        await consumer.resume();

    });


});




const createRoom = async (roomName: string, socketId: string) => {

    try {

        let router1: mediasoupTypes.Router | undefined;

        let peers = [];

        if (rooms[roomName]) {

            router1 = rooms[roomName].router;
            peers = rooms[roomName].peers;

        } else {

            router1 = await worker?.createRouter({ mediaCodecs });

        };



        rooms[roomName] = {

            router: router1,
            peers: [...peers, socketId]

        }


        return router1

    } catch (err) {

        console.log(err);

    }

}






const addConsumer = async (consumer: mediasoupTypes.Consumer, roomName: string, socketId: string) => {

    try {

        consumers = [

            ...consumers,
            { socketId, consumer, roomName }

        ]

        peers[socketId] = {

            ...peers[socketId],
            consumers: [

                ...peers[socketId].consumers,
                consumer.id

            ]

        }


    } catch (err) {

        console.log(err);

    }

}



const createWebRtcTransport = async (router: mediasoupTypes.Router, socketId: string, callback: Function) => {
    try {

        interface IlistenInfos {

            protocol?: string,
            ip: string,
            announcedAddress: string

        }


        interface ItransportOptions {

            listenInfos: IlistenInfos[],
            enableUdp: boolean,
            enableTcp: boolean,
            enableSctp: boolean,

        }


        const webRtcTransportOptions: any = {

            listenInfos: [
                {

                    protocal: 'udp',
                    ip: "0.0.0.0",
                    announcedAddress: "192.168.1.3"

                }

            ],

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




const addTransport = (transport: mediasoupTypes.Transport, roomName: string, consumer: boolean, socketId: string) => {

    try {


        transports = [

            ...transports,
            { socketId, transport, roomName, consumer },

        ]


        peers[socketId] = {

            ...peers[socketId],
            transports: [

                ...peers[socketId].transports,
                transport.id

            ]

        }



    } catch (err) {

        console.log(err);

    }

}





const addProducer = async (producer: mediasoupTypes.Producer, roomName: string, socketId: string) => {

    try {

        producers = [

            ...producers,
            { socketId, producer, roomName }

        ]

        peers[socketId] = {

            ...peers[socketId],
            producers: [

                ...peers[socketId].producers,
                producer.id

            ]

        }


    } catch (err) {

        console.log(err);

    }

};




const informConsumers = async (roomName: string, socketId: string, id: string) => {

    try {

        producers.forEach((producerData: any) => {

            if (producerData.roomName === roomName) {
                
                const producerSocket = peers[producerData.socketId].socket
            
                producerSocket.emit("new-producer", { producerId: id })

            }

        });

    } catch (err) {

        console.log(err);

    }

}







httpsServer.listen(4000, () => {

    console.log(4000, `listening on this port ${4000}`);

});




