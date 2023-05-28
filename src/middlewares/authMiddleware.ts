import {NextFunction, Request, Response} from 'express'
import JwtService from "../services/JwtService";
import User from "../models/User";
import CustomError from "../types/CustomError";
import {HttpCode} from "../types/HTTPCode";
import {wrap} from "async-middleware";

async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.header("authorization")?.split(' ')[1];

        if (!token) throw new CustomError(HttpCode.UNAUTHORIZED, "No access to this data")

        const decoded = JwtService.verify(token)
        req.user = await User.findById(decoded.id);
        if (!req.user) {
            throw new CustomError(HttpCode.BAD_REQUEST, "No access to this data")
        }
        next();
    } catch (error) {
        next(new CustomError(HttpCode.UNAUTHORIZED, "Not valid token"))
    }
}

export default authMiddleware