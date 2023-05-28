import express, {Express} from 'express';
import authRouter from "./routers/authRouter";
import postsRouter from "./routers/postsRouter";
import cors from "cors";
import errorMiddleware from "./middlewares/errorMiddleware";
import mongoose from "mongoose";
import {serve as serveSwagger, setup as setupSwagger} from "swagger-ui-express";
import * as fs from "fs";
import {parse} from 'yaml'
import path from "path";

export default class App {
    private app: Express


    constructor() {
        this.app = express();
    }

    private configureRoutes() {
        this.app.use('/auth', authRouter)
        this.app.use('/posts', postsRouter)
    }

    private configureBaseParsers() {
        this.app.use(cors());
        this.app.use(express.json());
    }

    private configureErrorHandler() {
        this.app.use(errorMiddleware);
    }

    private configureSwagger() {
        const file = fs.readFileSync(path.join(__dirname, 'swagger.yaml'), 'utf8')
        const swaggerDocument = parse(file)

        this.app.use('/api-docs', serveSwagger, setupSwagger(swaggerDocument));
    }

    async start() {
        this.configureBaseParsers()
        this.configureRoutes()
        this.configureErrorHandler()
        this.configureSwagger()

        const {
            DB_USER,
            DB_PASSWORD,
            DB_HOST,
            DB_PORT,
            DB_NAME,
            NODE_DOCKER_PORT
        } = process.env;

        await mongoose.connect(`mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`);

        this.app.listen(NODE_DOCKER_PORT, () => {
            console.log(`⚡️[server]: Server is running at port ${NODE_DOCKER_PORT}`);
        });
    }
}