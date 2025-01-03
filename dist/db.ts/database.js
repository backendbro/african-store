"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDb = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDb = async () => {
    const conn = await mongoose_1.default.connect(process.env.mongodb_url || "");
    console.log(`mongodb connected: ${conn.connection.host}`);
};
exports.connectDb = connectDb;
//# sourceMappingURL=database.js.map