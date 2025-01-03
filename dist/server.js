"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const database_1 = require("./db.ts/database");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const Auth_1 = __importDefault(require("./routes/Auth"));
const main = async () => {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use((0, cookie_parser_1.default)());
    (0, database_1.connectDb)();
    app.use("/api/v1/auth", Auth_1.default);
    const port = process.env.port;
    const server = app.listen(port, () => {
        console.log(`server running on localhost:${port}`);
    });
};
main().catch(error => {
    console.log(error);
});
//# sourceMappingURL=server.js.map