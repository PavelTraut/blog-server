import {Request, Response, Router} from "express";
import {validate} from "class-validator";
import {LoginDto} from "../dto/auth/LoginDto";
import User, {IUser} from "../models/User";
import CryptoService from "../services/CryptoService";
import {AuthResponseDto} from "../dto/auth/AuthResponseDto";
import JwtService from "../services/JwtService";
import {RegisterDto} from "../dto/auth/RegisterDto";
import authMiddleware from "../middlewares/authMiddleware";
import CustomError from "../types/CustomError";
import {HttpCode} from "../types/HTTPCode";
import {wrap} from 'async-middleware';

class AuthService {

    private static getAuthResponse(user: IUser): AuthResponseDto {
        return {token: JwtService.sign(user), user: {...user, password: undefined}}
    }

    private static async checkIsLoginFree(login: string) {
        const userWithSameLogin = await User.findOne({login})

        if (userWithSameLogin) {
            return false
        }

        return true
    }


    static async register(request: Request<{}, {}, RegisterDto>, response: Response<AuthResponseDto>) {
        const {body} = request
        const dto = new RegisterDto(body)
        const errors = await validate(dto);
        if (errors.length > 0) {
            throw new CustomError(HttpCode.BAD_REQUEST, 'Not valid request body')
        }

        if (!await this.checkIsLoginFree(dto.login)) {
            throw new CustomError(HttpCode.BAD_REQUEST, 'User with same login exist')
        }

        const password = await CryptoService.hash(dto.password)
        const user = new User({...dto, password})
        await user.save()

        const auth = this.getAuthResponse(user.toJSON())

        response.status(HttpCode.CREATED).send(auth)
    }

    static async login(request: Request<{}, {}, LoginDto>, response: Response<AuthResponseDto>) {
        const {body} = request
        const dto = new LoginDto(body)
        const errors = await validate(dto);
        if (errors.length > 0) {
            throw new CustomError(HttpCode.BAD_REQUEST, 'Not valid request body')
        }

        const user = await User.findOne({login: dto.login},).select('+password')

        if (!user) {
            throw new CustomError(HttpCode.BAD_REQUEST, 'User with this login doesnt exist')
        }
        const isPasswordCorrect = await CryptoService.compare(user.password as string, dto.password)

        if (!isPasswordCorrect) {
            throw new CustomError(HttpCode.BAD_REQUEST, 'Bad password')
        }

        const auth = this.getAuthResponse(user.toJSON())

        response.status(HttpCode.CREATED).send(auth)
    }

    static async me(request: Request, response: Response) {
        const auth = this.getAuthResponse(request.user.toJSON())
        response.status(HttpCode.CREATED).send(auth)
    }
}

const authRouter = Router();

authRouter.post('/login/', wrap<any, any>((req, res) => AuthService.login(req, res)))
authRouter.post('/register/', wrap<any, any>((req, res) => AuthService.register(req, res)))
authRouter.post('/me/', authMiddleware, wrap<any, any>((req, res) => AuthService.me(req, res)))

export default authRouter