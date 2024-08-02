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
let rooms2 = new Map();
let joinedUsers = {};
let joinedUsers2 = new Map();
;
let transports = [];
let transports2 = new Map();
let consumers = [];
let consumers2 = new Map();
let producers = [];
let producers2 = new Map();
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
    console.log(socket.id, "socketId");
    sockets.set(socket.id, socket);
    socket.emit("connection-success", socket.id);
    socket.on("joinRoom", (_a, callback_1) => __awaiter(void 0, [_a, callback_1], void 0, function* ({ roomName }, callback) {
        const router = yield createRoom(roomName, socket.id);
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
        };
        const rtpCapabilities = router === null || router === void 0 ? void 0 : router.rtpCapabilities;
        callback({ rtpCapabilities });
    }));
    socket.on("createWebRtcTransport", (_b, callback_2) => __awaiter(void 0, [_b, callback_2], void 0, function* ({ consumer }, callback) {
        try {
            const roomName = joinedUsers[socket.id].roomName;
            const router = rooms[roomName].router;
            const transport = yield createWebrtcTransport(router, socket.id, callback);
            addTransport(transport, socket.id, roomName, consumer);
        }
        catch (err) {
            console.log(err);
        }
    }));
    socket.on("transport-connect", (_c, callback_3) => __awaiter(void 0, [_c, callback_3], void 0, function* ({ dtlsParameters }, callback) {
        const roomName = joinedUsers[socket.id].roomName;
        const producerTransport = producers.find((producerData) => producerData.socketId === socket.id && !producerData.consumer && producerData.roomName === roomName);
        yield producerTransport.transport.connect({ dtlsParameters });
    }));
    socket.on("transport-produce", (_d, callback_4) => __awaiter(void 0, [_d, callback_4], void 0, function* ({ kind, rtpParameters }, callback) {
        const roomName = joinedUsers[socket.id].roomName;
        const producerTransport = producers.find((producerData) => producerData.socketId === socket.id && !producerData.consumer && producerData.roomName === roomName);
        const producer = yield producerTransport.transport.produce({ kind, rtpParameters });
        addProducer(producer, socket.id, roomName);
        informConsumers(producer.id, roomName, socket.id);
    }));
}));
const createRoom = (roomName, socketId) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f;
    try {
        let router;
        let joinedUsers;
        if (rooms[roomName]) {
            router = (_e = rooms[roomName]) === null || _e === void 0 ? void 0 : _e.router;
            joinedUsers = (_f = rooms[roomName]) === null || _f === void 0 ? void 0 : _f.joinedUsers;
        }
        else {
            router = yield (worker === null || worker === void 0 ? void 0 : worker.createRouter({ mediaCodecs }));
        }
        rooms[roomName] = {
            router: router,
            joinedUsers: joinedUsers
        };
        return router;
    }
    catch (err) {
        console.log(err);
    }
});
const createWebrtcTransport = (router, socketId, callback) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const webRtcTransportOptions = {
            listenInfos: [{
                    protocal: 'udp',
                    ip: "0.0.0.0",
                    announcedAddress: "192.168.207.177"
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
const addTransport = (transport, socketId, roomName, consumer) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        transports = [
            ...transports,
            { socketId, transport, roomName, consumer }
        ];
        joinedUsers[socketId] = Object.assign(Object.assign({}, joinedUsers[socketId]), { transports: [
                ...joinedUsers[socketId].transports,
                transport.id
            ] });
    }
    catch (err) {
        console.log(err);
    }
});
const addProducer = (producer, socketId, roomName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        producers = [
            ...producers,
            { socketId, producer, roomName }
        ];
        joinedUsers[socketId] = Object.assign(Object.assign({}, joinedUsers[socketId]), { producers: [...joinedUsers[socketId].producers, producer.id] });
    }
    catch (err) {
        console.log(err);
    }
});
const addConsumer = (consumer, roomName, socketId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (err) {
        console.log(err);
    }
});
const informConsumers = (id, roomName, socketId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const roomMembers = producers.filter((producerData) => producerData.socketId !== socketId && producerData.roomName === roomName);
        roomMembers.forEach((roomMemberData) => {
            const producerSocket = joinedUsers[roomMemberData.socketId].socket;
            producerSocket.emit("new-producer", { producerId: id });
        });
    }
    catch (err) {
        console.log(err);
    }
});
httpsServer.listen(4000, () => {
    console.log(4000, `listening on this port ${4000}`);
});
