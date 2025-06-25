"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { MONGODB_URI, JWT_PASSWORD } = process.env;
if (!MONGODB_URI || !JWT_PASSWORD) {
    throw new Error("Missing environment variables");
}
exports.Config = {
    MONGODB_URI,
    JWT_PASSWORD,
};
