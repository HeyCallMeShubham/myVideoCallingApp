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
const activeRooms = new Map();
const activeUsers = new Map();
const roomProducers = new Map([]);
const transports = new Map(); // transport identifier key will be transport id itself
const producers = new Map(); // producer identifier key will be producer id itself
const consumers = new Map(); // consumer identifier key will be consumer id itself
const onlineUsersEmails = new Map();
const sockets = new Map();
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
io.on("connection", (socket) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(socket.id, "socketId");
    sockets.set(socket.id, socket);
    activeUsers.set(socket.id, {
        socket,
        joinedRoomName: "",
        producerTransportId: "",
        consumerTransportId: ""
    });
    socket.emit("connection-success", socket.id);
    socket.on("createRoom", (_a, callback_1) => __awaiter(void 0, [_a, callback_1], void 0, function* ({ roomName }, callback) {
        const router = yield (worker === null || worker === void 0 ? void 0 : worker.createRouter({ mediaCodecs }));
        activeRooms.set(roomName, {
            router,
            roomMembers: []
        });
        const userData = activeUsers.get(socket.id);
        userData.router = router,
            userData.joinedRoomName = roomName;
        callback({ routerRtpCapabilities: router === null || router === void 0 ? void 0 : router.rtpCapabilities });
    }));
    socket.on("join-room", ({ roomName }, callback) => {
        const roomData = activeRooms.get(roomName);
        const router = roomData === null || roomData === void 0 ? void 0 : roomData.router;
        const roomMembers = (roomData === null || roomData === void 0 ? void 0 : roomData.roomMembers) || [];
        const updatedRoomData = {
            router: router,
            roomMembers: [...roomMembers, socket.id]
        };
        activeRooms.set(roomName, updatedRoomData);
        const userData = activeUsers.get(socket.id);
        userData.router = router,
            userData.joinedRoomName = roomName;
        activeUsers.set(socket.id, userData);
        callback({ routerRtpCapabilities: router === null || router === void 0 ? void 0 : router.rtpCapabilities });
    });
    socket.on("createWebRtcTransport", (_b, callback_2) => __awaiter(void 0, [_b, callback_2], void 0, function* ({ consumer }, callback) {
        var _c, _d;
        const roomName = (_c = activeUsers.get(socket.id)) === null || _c === void 0 ? void 0 : _c.joinedRoomName;
        const router = (_d = activeRooms.get(roomName)) === null || _d === void 0 ? void 0 : _d.router;
        if (consumer) {
            const transport = yield createWebrtcTransport(router, socket.id, callback);
            addConsumerTransport(transport, roomName, socket.id);
        }
        else {
            const transport = yield createWebrtcTransport(router, socket.id, callback);
            addProducerTransport(transport, roomName, socket.id);
        }
    }));
    socket.on("getProducers", (callback) => {
        var _a;
        const roomName = (_a = activeUsers.get(socket.id)) === null || _a === void 0 ? void 0 : _a.joinedRoomName;
        const roomsMembers = roomProducers.get(roomName);
        console.log(roomsMembers, 'rooMmebers');
        let producersList = [];
        roomsMembers.forEach((producerData) => {
            if (producerData.socketId !== socket.id) {
                producersList = [...producersList, producerData.producerId];
            }
        });
        callback({ producersList });
    });
    socket.on("transport-connect", (_e) => __awaiter(void 0, [_e], void 0, function* ({ dtlsParameters, serverProducerTransportId }) {
        const producerTransport = transports.get(serverProducerTransportId).transport;
        yield producerTransport.connect({ dtlsParameters });
    }));
    socket.on("transport-produce", (_f, callback_3) => __awaiter(void 0, [_f, callback_3], void 0, function* ({ kind, rtpParameters, serverProducerTransportId }, callback) {
        var _g, _h;
        const roomName = (_g = activeUsers.get(socket.id)) === null || _g === void 0 ? void 0 : _g.joinedRoomName;
        const producerTransport = (_h = transports.get(serverProducerTransportId)) === null || _h === void 0 ? void 0 : _h.transport;
        const producer = yield producerTransport.produce({ kind, rtpParameters });
        const memberOfRooms = roomProducers.get(roomName);
        addProducer(producer, roomName, socket.id);
        informConsumers(producer, socket.id, roomName);
        callback({ id: producer.id, producersExist: (memberOfRooms === null || memberOfRooms === void 0 ? void 0 : memberOfRooms.length) > 1 ? true : false });
    }));
    socket.on("transport-recv-connect", (_j) => __awaiter(void 0, [_j], void 0, function* ({ dtlsParameters, serverConsumerTransportId }) {
        var _k, _l;
        const roomName = (_k = activeUsers.get(socket.id)) === null || _k === void 0 ? void 0 : _k.joinedRoomName;
        const consumerTransport = (_l = transports.get(serverConsumerTransportId)) === null || _l === void 0 ? void 0 : _l.transport;
        yield consumerTransport.connect({ dtlsParameters });
    }));
    socket.on("consume", (_m, callback_4) => __awaiter(void 0, [_m, callback_4], void 0, function* ({ rtpCapabilities, remoteProducerId, serverConsumerTransportId }, callback) {
        var _o;
        const roomName = (_o = activeUsers.get(socket.id)) === null || _o === void 0 ? void 0 : _o.joinedRoomName;
        const router = activeRooms.get(roomName).router;
        if (router.canConsume({
            rtpCapabilities,
            producerId: remoteProducerId,
            paused: true
        })) {
            const consumerTransport = transports.get(serverConsumerTransportId).transport;
            const consumer = yield consumerTransport.consume({
                rtpCapabilities,
                producerId: remoteProducerId,
                paused: true
            });
            addConsumer(consumer);
            callback({
                params: {
                    id: consumer.id,
                    rtpParameters: consumer.rtpParameters,
                    producerId: remoteProducerId,
                    kind: consumer.kind,
                }
            });
        }
    }));
    socket.on("consumer-resume", ({ consumerId }) => {
        const consumer = consumers.get(consumerId);
        consumer.resume();
    });
    socket.on("disconnect", () => {
        activeUsers.delete(socket.id);
    });
}));
const createWebrtcTransport = (router, socketId, callback) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const webRtcTransportOptions = {
            listenInfos: [{
                    protocal: 'udp',
                    ip: "0.0.0.0",
                    announcedAddress: "192.168.1.10"
                }],
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
const addConsumerTransport = (transport, roomName, socketId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        transports.set(transport.id, {
            transport,
            socketId,
            roomName
        });
        const userData = activeUsers.get(socketId);
        userData.consumerTransportId = transport.id;
        activeUsers.set(socketId, userData);
    }
    catch (err) {
        console.log(err);
    }
});
const addProducerTransport = (transport, roomName, socketId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        transports.set(transport.id, {
            transport,
            socketId,
            roomName
        });
        const userData = activeUsers.get(socketId);
        userData.producerTransportId = transport.id;
        activeUsers.set(socketId, userData);
    }
    catch (err) {
        console.log(err);
    }
});
const addProducer = (producer, roomName, socketId) => {
    try {
        producers.set(producer.id, {
            roomName,
            socketId
        });
        if (roomProducers.has(roomName)) {
            const producersOfRoom = roomProducers.get(roomName);
            roomProducers.set(roomName, [...producersOfRoom, { producerId: producer.id, socketId }]);
        }
        else {
            roomProducers.set(roomName, [{ producerId: producer.id, socketId, }]);
        }
    }
    catch (err) {
        console.log(err);
    }
};
const informConsumers = (producer, socketId, roomName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const roomMembers = roomProducers.get(roomName);
        roomMembers.forEach((roomMember) => {
            if (roomMember.socketId !== socketId) {
                const producerSocket = activeUsers.get(socketId).socket;
                producerSocket.emit('new-producer', { producerId: producer.id });
            }
        });
    }
    catch (err) {
        console.log(err);
    }
});
const addConsumer = (consumer) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        consumers.set(consumer.id, consumer);
    }
    catch (err) {
        console.log(err);
    }
});
httpsServer.listen(4000, () => {
    console.log(4000, `listening on this port ${4000}`);
});
