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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.linkModel = exports.contentModel = exports.userModel = void 0;
const config_1 = require("./config");
const mongoose_1 = __importStar(require("mongoose"));
const mongoUri = config_1.Config.MONGODB_URI;
mongoose_1.default.connect(mongoUri);
const userSchema = new mongoose_1.Schema({
    userName: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
        unique: true,
    },
});
exports.userModel = (0, mongoose_1.model)("User", userSchema);
const contentSchema = new mongoose_1.Schema({
    link: { type: String, required: true },
    type: { type: String },
    title: { type: String, required: true },
    tags: { type: String },
    userId: { type: mongoose_1.default.Types.ObjectId, ref: "User", required: true },
});
exports.contentModel = (0, mongoose_1.model)("Content", contentSchema);
const linkSchema = new mongoose_1.Schema({
    hash: String,
    userId: { type: mongoose_1.default.Types.ObjectId, ref: "User", required: true },
});
exports.linkModel = (0, mongoose_1.model)("Links", linkSchema);
