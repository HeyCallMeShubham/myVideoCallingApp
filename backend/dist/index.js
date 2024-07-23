"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mediasoup = __importStar(require("mediasoup"));
const express_1 = __importDefault(require("express"));
const https_1 = __importDefault(require("https"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const fs_1 = __importDefault(require("fs"));
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000", 'http://192.168.1.3:3000'],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"] // Allow the Cookie header
}));
app.use(body_parser_1.default.json({ limit: "50mb" }));
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.urlencoded({ limit: "50mb", extended: true }));
const mediaCodecs = [
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
];
let worker;
let rooms = {};
let peers = {};
let transports = [];
let producers = [];
let consumers = [];
const createWorker = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        worker = yield mediasoup.createWorker({
            rtcMinPort: 4000,
            rtcMaxPort: 5250
        });
        worker.on("died", (error) => {
            setTimeout(() => {
                process.exit(1);
            }, 2000);
        });
        return worker;
    }
    catch (err) {
        console.log(err);
    }
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    worker = yield createWorker();
}))();
const getCertOptions = () => {
    try {
        const key = fs_1.default.readFileSync(path_1.default.resolve(__dirname, "../certs/cert.key"));
        const cert = fs_1.default.readFileSync(path_1.default.resolve(__dirname, "../certs/cert.crt"));
        return { key, cert };
    }
    catch (err) {
        console.error("Error reading SSL certificate files:", err);
        return null;
    }
};
const httpOptions = getCertOptions();
if (!httpOptions) {
    throw new Error("Failed to load SSL certificate files. Server cannot start.");
}
const httpsServer = https_1.default.createServer(httpOptions, app);
const io = new socket_io_1.Server(httpsServer, {
    cors: {
        origin: ["http://localhost:3000", "http://192.168.1.3:3000"]
    }
});
const sockets = new Map();
io.on("connection", (socket) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("user id", socket.id);
    sockets.set(socket.id, socket);
    socket.emit("connection-successful", { socketId: socket.id });
    socket.on("joinRoom", (_a, callback_1) => __awaiter(void 0, [_a, callback_1], void 0, function* ({ roomName }, callback) {
        console.log("roomname", roomName);
        try {
            const router1 = yield createRoom(roomName, socket.id);
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
            };
            callback({ rtpCapabilities: router1 === null || router1 === void 0 ? void 0 : router1.rtpCapabilities });
        }
        catch (err) {
            console.log(err);
        }
    }));
    socket.on("createWebRtcTransport", (_b, callback_2) => __awaiter(void 0, [_b, callback_2], void 0, function* ({ consumer }, callback) {
        const roomName = peers[socket.id].roomName;
        const router = rooms[roomName].router;
        const transport = yield createWebRtcTransport(router, socket.id, callback);
        addTransport(transport, roomName, consumer, socket.id);
    }));
    socket.on("transport-connect", (_c) => __awaiter(void 0, [_c], void 0, function* ({ dtlsParameters }) {
        const [producerTransport] = transports.filter((transport) => transport.socketId === socket.id && !transport.consumer);
        yield producerTransport.transport.connect({ dtlsParameters });
    }));
    socket.on("transport-produce", (_d, callback_3) => __awaiter(void 0, [_d, callback_3], void 0, function* ({ kind, rtpParameters }, callback) {
        const [producerTransport] = transports.filter((transport) => transport.socketId === socket.id && !transport.consumer);
        const producer = yield producerTransport.transport.produce({ kind, rtpParameters });
        const { roomName } = peers[socket.id];
        addProducer(producer, roomName, socket.id);
        informConsumers(roomName, socket.id, producer.id);
        producer.on('transportclose', () => {
            console.log('transport for this producer closed ');
            producer.close();
        });
        callback({
            id: producer.id,
            producersExist: producers.length > 1 ? true : false
        });
    }));
    socket.on("transport-recv-connect", (_e) => __awaiter(void 0, [_e], void 0, function* ({ dtlsParameters, serverConsumerTransportId }) {
        console.log('transport-recv-connect', serverConsumerTransportId);
        const consumerTransport = transports.find((transportData) => transportData.consumer && transportData.transport.id == serverConsumerTransportId).transport;
        console.log(consumerTransport, 'consumerTransport');
        yield consumerTransport.connect({ dtlsParameters });
    }));
    socket.on("getProducers", callback => {
        const { roomName } = peers[socket.id];
        let producerList = [];
        producers.forEach((producerData) => {
            if (producerData.socketId !== socket.id && producerData.roomName === roomName) {
                producerList = [...producerList, producerData.producer.id];
            }
        });
        callback(producerList);
    });
    socket.on("consume", (_f, callback_4) => __awaiter(void 0, [_f, callback_4], void 0, function* ({ rtpCapabilities, remoteProducerId, serverConsumerTransportId }, callback) {
        try {
            const { roomName } = peers[socket.id];
            const router = rooms[roomName].router;
            let consumerTransport = transports.find((transportData) => (transportData === null || transportData === void 0 ? void 0 : transportData.consumer) && transportData.transport.id == serverConsumerTransportId).transport;
            if (router.canConsume({
                producerId: remoteProducerId,
                rtpCapabilities
            })) {
                const consumer = yield consumerTransport.consume({
                    producerId: remoteProducerId,
                    rtpCapabilities,
                    paused: true
                });
                consumer.on('transportclose', () => {
                    console.log('transport close from consumer');
                });
                consumer.on('producerclose', () => {
                    console.log('producer of consumer closed');
                    socket.emit('producer-closed', { remoteProducerId });
                    consumerTransport.close([]);
                    transports = transports.filter((transportData) => transportData.transport.id !== consumerTransport.id);
                    consumer.close();
                    consumers = consumers.filter((consumerData) => consumerData.consumer.id !== consumer.id);
                });
                addConsumer(consumer, roomName, socket.id);
                const params = {
                    id: consumer.id,
                    producerId: remoteProducerId,
                    kind: consumer.kind,
                    rtpParameters: consumer.rtpParameters,
                    serverConsumerId: consumer.id
                };
                callback({ params });
            }
        }
        catch (err) {
            console.log(err);
        }
    }));
    socket.on("consumer-resume", (_g) => __awaiter(void 0, [_g], void 0, function* ({ serverConsumerId }) {
        const { consumer } = consumers.find((consumerData) => consumerData.consumer.id === serverConsumerId);
        yield consumer.resume();
    }));
}));
const createRoom = (roomName, socketId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let router1;
        let peers = [];
        if (rooms[roomName]) {
            router1 = rooms[roomName].router;
            peers = rooms[roomName].peers;
        }
        else {
            router1 = yield (worker === null || worker === void 0 ? void 0 : worker.createRouter({ mediaCodecs }));
        }
        ;
        rooms[roomName] = {
            router: router1,
            peers: [...peers, socketId]
        };
        return router1;
    }
    catch (err) {
        console.log(err);
    }
});
const addConsumer = (consumer, roomName, socketId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        consumers = [
            ...consumers,
            { socketId, consumer, roomName }
        ];
        peers[socketId] = Object.assign(Object.assign({}, peers[socketId]), { consumers: [
                ...peers[socketId].consumers,
                consumer.id
            ] });
    }
    catch (err) {
        console.log(err);
    }
});
const createWebRtcTransport = (router, socketId, callback) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const webRtcTransportOptions = {
            listenInfos: [
                {
                    protocal: 'udp',
                    ip: "0.0.0.0",
                    announcedAddress: "192.168.1.9"
                }
            ],
            enableUdp: true,
            enableTcp: true,
            preferUdp: true,
            preferTcp: true,
        };
        const transport = yield (router === null || router === void 0 ? void 0 : router.createWebRtcTransport(webRtcTransportOptions));
        callback({
            params: {
                id: transport === null || transport === void 0 ? void 0 : transport.id,
                iceParameters: transport === null || transport === void 0 ? void 0 : transport.iceParameters,
                iceCandidates: transport === null || transport === void 0 ? void 0 : transport.iceCandidates,
                dtlsParameters: transport === null || transport === void 0 ? void 0 : transport.dtlsParameters,
            }
        });
        return transport;
    }
    catch (err) {
        console.log(err);
    }
});
const addTransport = (transport, roomName, consumer, socketId) => {
    try {
        transports = [
            ...transports,
            { socketId, transport, roomName, consumer },
        ];
        peers[socketId] = Object.assign(Object.assign({}, peers[socketId]), { transports: [
                ...peers[socketId].transports,
                transport.id
            ] });
    }
    catch (err) {
        console.log(err);
    }
};
const addProducer = (producer, roomName, socketId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        producers = [
            ...producers,
            { socketId, producer, roomName }
        ];
        peers[socketId] = Object.assign(Object.assign({}, peers[socketId]), { producers: [
                ...peers[socketId].producers,
                producer.id
            ] });
    }
    catch (err) {
        console.log(err);
    }
});
const informConsumers = (roomName, socketId, id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        producers.forEach((producerData) => {
            if (producerData.roomName === roomName) {
                const producerSocket = peers[producerData.socketId].socket;
                producerSocket.emit("new-producer", { producerId: id });
            }
        });
    }
    catch (err) {
        console.log(err);
    }
});
httpsServer.listen(4000, () => {
    console.log(4000, `listening on this port ${4000}`);
});
