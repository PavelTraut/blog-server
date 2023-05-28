declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DB_USER: string;
            DB_PASSWORD: string
            DB_HOST: string
            DB_PORT: string
            NODE_DOCKER_PORT: string
            DB_NAME: string
            JWT_KEY: string
            SALT_ROUNDS: string
        }
    }
}

export {}

declare global {
    namespace Express {
        interface Request {
            user?: IUser
        }
    }
}