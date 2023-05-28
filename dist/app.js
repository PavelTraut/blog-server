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
const express_1 = __importDefault(require("express"));
const authRouter_1 = __importDefault(require("./routers/authRouter"));
const postsRouter_1 = __importDefault(require("./routers/postsRouter"));
const cors_1 = __importDefault(require("cors"));
const errorMiddleware_1 = __importDefault(require("./middlewares/errorMiddleware"));
const mongoose_1 = __importDefault(require("mongoose"));
const swagger_ui_express_1 = require("swagger-ui-express");
const fs = __importStar(require("fs"));
const yaml_1 = require("yaml");
const path_1 = __importDefault(require("path"));
class App {
    constructor() {
        this.app = (0, express_1.default)();
    }
    configureRoutes() {
        this.app.use('/auth', authRouter_1.default);
        this.app.use('/posts', postsRouter_1.default);
    }
    configureBaseParsers() {
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json());
    }
    configureErrorHandler() {
        this.app.use(errorMiddleware_1.default);
    }
    configureSwagger() {
        const file = fs.readFileSync(path_1.default.join(__dirname, 'swagger.yaml'), 'utf8');
        const swaggerDocument = (0, yaml_1.parse)(file);
        this.app.use('/api-docs', swagger_ui_express_1.serve, (0, swagger_ui_express_1.setup)(swaggerDocument));
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            this.configureBaseParsers();
            this.configureRoutes();
            this.configureErrorHandler();
            this.configureSwagger();
            const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME, NODE_DOCKER_PORT } = process.env;
            yield mongoose_1.default.connect(`mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`);
            this.app.listen(NODE_DOCKER_PORT, () => {
                console.log(`⚡️[server]: Server is running at port ${NODE_DOCKER_PORT}`);
            });
        });
    }
}
exports.default = App;
