
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
import { RtpCapabilities, rtpHeaderExtensionUriFromFbs } from "mediasoup/node/lib/RtpParameters";
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

const activeRooms = new Map();

const activeUsers = new Map();

const roomProducers = new Map([]);

const transports = new Map(); // transport identifier key will be transport id itself

const producers = new Map(); // producer identifier key will be producer id itself

const consumers = new Map(); // consumer identifier key will be consumer id itself







const onlineUsersEmails: any = new Map();


const sockets = new Map();











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




io.on("connection", async (socket: Socket) => {


    console.log(socket.id, "socketId");

    sockets.set(socket.id, socket);


    activeUsers.set(socket.id, {

        socket,
        joinedRoomName: "",
        producerTransportId: "",
        consumerTransportId: "",
        producerId: "",
        consumerId: "",

    });


    socket.emit("connection-success", socket.id);


    socket.on("createRoom", async ({ roomName }: { roomName: string }, callback: Function) => {

        const router: mediasoupTypes.Router | undefined = await worker?.createRouter({ mediaCodecs });



        activeRooms.set(roomName, {

            router,
            roomMembers: [socket.id]

        });


        const userData = activeUsers.get(socket.id);

        userData.router = router,

            userData.joinedRoomName = roomName

        callback({ routerRtpCapabilities: router?.rtpCapabilities });

    });





    socket.on("join-room", ({ roomName }: { roomName: string }, callback: Function) => {

        const roomData = activeRooms.get(roomName);

        const router: mediasoupTypes.Router = roomData?.router

        const roomMembers: string[] = roomData?.roomMembers || []




        roomData.router = router,
            roomData.roomMembers = [roomMembers, socket.id]




        activeRooms.set(roomName, roomData);


        const userData = activeUsers.get(socket.id);


        userData.router = router,


            userData.joinedRoomName = roomName


        activeUsers.set(socket.id, userData);


        callback({ routerRtpCapabilities: roomData.router?.rtpCapabilities });


    });


    socket.on("createWebRtcTransport", async ({ consumer }: { consumer: boolean }, callback: Function) => {



        const roomName: string = activeUsers.get(socket.id)?.joinedRoomName;


        const router: mediasoupTypes.Router = activeRooms.get(roomName)?.router;

        if (consumer) {

            const transport: mediasoupTypes.Transport = await createWebrtcTransport(router, socket.id, callback);



            addConsumerTransport(transport, roomName, socket.id);

        } else {

            const transport: mediasoupTypes.Transport = await createWebrtcTransport(router, socket.id, callback);


            addProducerTransport(transport, roomName, socket.id);

        }



    });




    socket.on("getProducers", (callback: Function) => {

        const roomName = activeUsers.get(socket.id)?.joinedRoomName

        const roomsMembers: any = roomProducers.get(roomName);

        let producersList: any = []

        roomsMembers.forEach((producerData: any) => {

            if (producerData.socketId !== socket.id) {

                producersList = [...producersList, producerData.producerId];

            }

        });

        callback({ producersList });

    });





    socket.on("transport-connect", async ({ dtlsParameters, serverProducerTransportId }: any) => {

        const producerTransport = transports.get(serverProducerTransportId).transport;

        await producerTransport.connect({ dtlsParameters });

    });





    socket.on("transport-produce", async ({ kind, rtpParameters, serverProducerTransportId }: any, callback: Function) => {

        const roomName = activeUsers.get(socket.id)?.joinedRoomName

        const producerTransport = transports.get(serverProducerTransportId)?.transport;

        const producer = await producerTransport.produce({ kind, rtpParameters });

        const memberOfRooms: any[] | any = roomProducers.get(roomName);

        const userData = activeUsers.get(socket.id);

        userData.producerId = producer.id,

            activeUsers.set(socket.id, userData);


        addProducer(producer, roomName, socket.id);

        informConsumers(producer, socket.id, roomName);

        callback({ id: producer.id, producersExist: memberOfRooms?.length > 1 ? true : false });

    });





    socket.on("transport-recv-connect", async ({ dtlsParameters, serverConsumerTransportId }: any) => {

        const roomName = activeUsers.get(socket.id)?.joinedRoomName

        const consumerTransport = transports.get(serverConsumerTransportId)?.transport;

        await consumerTransport.connect({ dtlsParameters });

    });




    socket.on("consume", async ({ rtpCapabilities, remoteProducerId, serverConsumerTransportId }: any, callback: Function) => {

        const roomName = activeUsers.get(socket.id)?.joinedRoomName;

        const router = activeRooms.get(roomName).router;

        if (router.canConsume({

            rtpCapabilities,
            producerId: remoteProducerId,
            paused: true

        })) {

            const consumerTransport = transports.get(serverConsumerTransportId).transport

            const consumer = await consumerTransport.consume({

                rtpCapabilities,
                producerId: remoteProducerId,
                paused: true

            });

            const userData = activeUsers.get(socket.id);

            userData.consumerId = consumer.id,

                activeUsers.set(socket.id, userData);



            addConsumer(consumer);


            callback({
                params: {

                    id: consumer.id,
                    rtpParameters: consumer.rtpParameters,
                    producerId: remoteProducerId,
                    kind: consumer.kind,

                }
            })


        }

    });



    socket.on("consumer-resume", ({ consumerId }: any) => {

        const consumer = consumers.get(consumerId);

        consumer.resume()

    });



    socket.on("producer-pause", () => {

        const producerId: string = activeUsers.get(socket.id).producerId



        const producer = producers.get(producerId).producer;

        producer.pause()

    });


    socket.on("producer-resume", () => {

        const producerId: string = activeUsers.get(socket.id).producerId



        const producer = producers.get(producerId).producer;

        producer.resume()

    });





    socket.on("disconnect", () => {

        activeUsers.delete(socket.id);

    });


});





const createWebrtcTransport = async (router: mediasoupTypes.Router, socketId: string, callback: Function) => {

    try {


        const webRtcTransportOptions: any = {

            listenInfos: [{

                protocal: 'udp',
                ip: "0.0.0.0",
                announcedAddress: "192.168.1.6"

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



const addConsumerTransport = async (transport: mediasoupTypes.Transport, roomName: string, socketId: string) => {

    try {

        transports.set(transport.id, {

            transport,
            socketId,
            roomName

        });


        const userData = activeUsers.get(socketId);

        userData.consumerTransportId = transport.id

        activeUsers.set(socketId, userData);


    } catch (err) {

        console.log(err);

    }

}




const addProducerTransport = async (transport: mediasoupTypes.Transport, roomName: string, socketId: string) => {

    try {

        transports.set(transport.id, {

            transport,
            socketId,
            roomName

        });


        const userData = activeUsers.get(socketId);

        userData.producerTransportId = transport.id

        activeUsers.set(socketId, userData);


    } catch (err) {

        console.log(err);

    }

}



const addProducer = (producer: mediasoupTypes.Producer, roomName: string, socketId: string) => {

    try {


        producers.set(producer.id, {

            roomName,
            socketId,
            producer

        });



        if (roomProducers.has(roomName)) {

            const producersOfRoom: any = roomProducers.get(roomName);

            roomProducers.set(roomName, [...producersOfRoom, { producerId: producer.id, socketId }])

        } else {

            roomProducers.set(roomName, [{ producerId: producer.id, socketId, }]);

        }

    } catch (err) {

        console.log(err);

    }

}




const informConsumers = async (producer: mediasoupTypes.Producer, socketId: string, roomName: string) => {

    try {

        const roomMembers: any = roomProducers.get(roomName);

        roomMembers.forEach((roomMember: any) => {

            if (roomMember.socketId !== socketId) {

                const producerSocket = activeUsers.get(roomMember.socketId).socket;

                producerSocket.emit('new-producer', { producerId: producer.id })

            }

        });


    } catch (err) {

        console.log(err);

    }

}




const addConsumer = async (consumer: mediasoupTypes.Consumer) => {

    try {

        consumers.set(consumer.id, consumer)

    } catch (err) {

        console.log(err);

    }

}







httpsServer.listen(4000, () => {

    console.log(4000, `listening on this port ${4000}`);

});




