

import express, { Request, Response, NextFunction } from "express";

import * as mediasoup from "mediasoup";

import { types as mediasoupTypes } from "mediasoup";

import https from "https"

import path from "path"

import bodyParser from "body-parser";

import cookieParser from "cookie-parser";

import cors from "cors";

import fs from "fs"

import { Server, Socket } from "socket.io"
import { Channel } from "mediasoup/node/lib/Channel";
import { Protocol } from "mediasoup/node/lib/fbs/transport";
import { SctpParametersT } from "mediasoup/node/lib/fbs/sctp-parameters";
import { Consumer } from "mediasoup/node/lib/Consumer";





const app = express();




app.use(cors({

    origin: ["http://localhost:3000", 'http://192.168.1.4:3000'],
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

let router: mediasoupTypes.Router | undefined;

let rtpParameters: mediasoupTypes.RtpParameters | undefined;

let producerTransport: mediasoupTypes.Transport | undefined;

let consumerTransport: mediasoupTypes.Transport | undefined;

let producer: mediasoupTypes.Producer | undefined

let consumer: mediasoupTypes.Consumer | undefined









const createWorker = async () => {

    try {

        worker = await mediasoup.createWorker({

            rtcMinPort: 2000,
            rtcMaxPort: 2020

        });



        return worker;

    } catch (err) {

        console.log(err);

    }

}





(async () => {

    worker = await createWorker();

})();






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

        origin: "http://localhost:3000"

    }

});









io.on("connection", async (socket: Socket) => {

    console.log(socket.id, 'socketid');

    if (worker) {

        router = await worker?.createRouter({ mediaCodecs });

    }

    

    socket.on("getRtpCapabilities", (callback) => {

        const rtpCapabilities: mediasoupTypes.RtpCapabilities | undefined = router?.rtpCapabilities

        callback({ rtpCapabilities });

    });



    socket.on("createWebRtcTransport", async ({ sender }: boolean | any, callback: Function) => {

        if (sender) {

            producerTransport = await createWebRtcTransport(callback);

        } else {

            consumerTransport = await createWebRtcTransport(callback);

        }

    });


    interface ItransportConnectArgs {

        dtlsParameters: mediasoupTypes.DtlsParameters

    }


    socket.on("transport-connect", async ({ dtlsParameters }: ItransportConnectArgs) => {

        await producerTransport?.connect({ dtlsParameters })


    });


    interface ItransportProduceArgs {

        kind: mediasoupTypes.MediaKind,
        rtpParameters: mediasoupTypes.RtpParameters

    }


    socket.on("transport-produce", async ({ kind, rtpParameters }: ItransportProduceArgs, callback: Function) => {

        producer = await producerTransport?.produce<mediasoupTypes.ProducerOptions>({ kind, rtpParameters });

        callback({ id: producer?.id });

    });







    socket.on("transport-recv-connect", async ({ dtlsParameters }) => {

        await consumerTransport?.connect({ dtlsParameters });

    });



    socket.on("consume", async ({ rtpCapabilities }, callback: Function) => {


        interface IdataToConsume {

            producerId: string | undefined,
            rtpCapabilities: mediasoupTypes.RtpCapabilities | undefined,
            paused?: Boolean

        }


        const dataToConsume: IdataToConsume | any = { rtpCapabilities, producerId: producer?.id, paused: true }


        if (router?.canConsume(dataToConsume)) {

            try {

                consumer = await consumerTransport?.consume(dataToConsume)

                callback({ id: consumer?.id, producerId: producer?.id, kind: consumer?.kind, rtpParameters: consumer?.rtpParameters });

            } catch (err) {

                console.log(err);

            }

        }


    })






    socket.on("consumer-resume", () => {

        consumer?.resume()

    })


});







const createWebRtcTransport = async (callback: Function) => {

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


        const webRtcTransportOptions: ItransportOptions | any = {

            listenInfos: [
                {

                    protocol: "udp",
                    ip: "0.0.0.0",
                    announcedAddress: "192.168.1.4"

                }
            ],


            enableUdp: true,
            enableTcp: true,


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
























httpsServer.listen(4000, () => {

    console.log(4000, `listening on this port ${4000}`);

});




