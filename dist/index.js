"use strict";
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
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("./db");
const config_1 = require("./config");
const middleware_1 = require("./middleware");
const utils_1 = require("./utils");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const JWT_PASSWORD = config_1.Config.JWT_PASSWORD;
app.post("/api/v1/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userName = req.body.userName;
    const password = req.body.password;
    try {
        yield db_1.userModel.create({
            userName: userName,
            password: password,
        });
        res.json({
            message: "User signed up",
        });
    }
    catch (err) {
        res.status(411).json({
            message: "User already exists",
        });
    }
}));
app.post("/api/v1/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userName = req.body.userName;
    const password = req.body.password;
    const existingUser = yield db_1.userModel.findOne({
        userName,
        password,
    });
    if (existingUser) {
        const token = jsonwebtoken_1.default.sign({
            id: existingUser._id,
        }, JWT_PASSWORD);
        res.json({
            token,
        });
    }
    else {
        res.status(403).json({
            message: "Incorrect credentials",
        });
    }
}));
app.post("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const title = req.body.title;
    const link = req.body.link;
    const type = req.body.type;
    yield db_1.contentModel.create({
        title,
        link,
        type,
        //@ts-ignore
        userId: req.userId,
    });
    res.json({
        message: "Content added",
    });
}));
app.get("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const userId = req.userId;
    const content = yield db_1.contentModel
        .find({ userId: userId })
        .populate("userId", "userName");
    res.json({
        content,
    });
}));
app.delete("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contentId = req.body.contentId;
    try {
        const deleted = yield db_1.contentModel.deleteOne({
            contentId,
            //@ts-ignore
            userId: req.userId,
        });
    }
    catch (err) {
        res.status(404).json({
            message: "Content doesn't exist",
        });
    }
}));
app.post("/api/v1/brain/share", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const share = req.body.share;
    if (share) {
        const existingLink = yield db_1.linkModel.findOne({
            //@ts-ignore
            userId: req.userId,
        });
        if (existingLink) {
            res.json({
                //@ts-ignore
                hash: existingLink.hash,
            });
            return;
        }
        const hash = (0, utils_1.random)(10);
        yield db_1.linkModel.create({
            //@ts-ignore
            userId: req.userId,
            hash: hash,
        });
        res.json({
            hash: hash,
        });
    }
    else {
        yield db_1.linkModel.deleteOne({
            //@ts-ignore
            userId: req.userId,
        });
        res.json({
            message: "Removed link",
        });
    }
}));
app.get("/api/v1/brain/:shareLink", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hash = req.params.shareLink;
    const link = yield db_1.linkModel.findOne({
        hash,
    });
    if (!link) {
        res.status(411).json({
            message: "Sorry incorrect input",
        });
    }
    const content = yield db_1.contentModel.find({
        //@ts-ignore
        userId: link.userId,
    });
    const user = yield db_1.userModel.findOne({
        //@ts-ignore
        _id: link.userId,
    });
    res.json({
        //@ts-ignore
        userName: user === null || user === void 0 ? void 0 : user.userName,
        content: content,
    });
}));
app.listen(3000);
