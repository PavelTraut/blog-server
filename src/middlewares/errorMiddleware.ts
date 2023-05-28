import CustomError from "../types/CustomError";
import {NextFunction, Request, Response} from "express";
import {HttpCode} from "../types/HTTPCode";

function errorMiddleware(error: CustomError | Error, request: Request, response: Response, next: NextFunction) {
    let status = HttpCode.INTERNAL_SERVER_ERROR;
    if (error instanceof CustomError) {
        status = error.status || HttpCode.INTERNAL_SERVER_ERROR
    }
    console.log(status, error.message)
    response.status(status).send(error.message)
}

export default errorMiddleware