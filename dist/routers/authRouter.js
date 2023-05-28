"use strict";
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
const express_1 = require("express");
const class_validator_1 = require("class-validator");
const LoginDto_1 = require("../dto/auth/LoginDto");
const User_1 = __importDefault(require("../models/User"));
const CryptoService_1 = __importDefault(require("../services/CryptoService"));
const JwtService_1 = __importDefault(require("../services/JwtService"));
const RegisterDto_1 = require("../dto/auth/RegisterDto");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const CustomError_1 = __importDefault(require("../types/CustomError"));
const HTTPCode_1 = require("../types/HTTPCode");
const async_middleware_1 = require("async-middleware");
class AuthService {
    static getAuthResponse(user) {
        return { token: JwtService_1.default.sign(user), user: Object.assign(Object.assign({}, user), { password: undefined }) };
    }
    static checkIsLoginFree(login) {
        return __awaiter(this, void 0, void 0, function* () {
            const userWithSameLogin = yield User_1.default.findOne({ login });
            if (userWithSameLogin) {
                return false;
            }
            return true;
        });
    }
    static register(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = request;
            const dto = new RegisterDto_1.RegisterDto(body);
            const errors = yield (0, class_validator_1.validate)(dto);
            if (errors.length > 0) {
                throw new CustomError_1.default(HTTPCode_1.HttpCode.BAD_REQUEST, 'Not valid request body');
            }
            if (!(yield this.checkIsLoginFree(dto.login))) {
                throw new CustomError_1.default(HTTPCode_1.HttpCode.BAD_REQUEST, 'User with same login exist');
            }
            const password = yield CryptoService_1.default.hash(dto.password);
            const user = new User_1.default(Object.assign(Object.assign({}, dto), { password }));
            yield user.save();
            const auth = this.getAuthResponse(user.toJSON());
            response.status(HTTPCode_1.HttpCode.CREATED).send(auth);
        });
    }
    static login(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = request;
            const dto = new LoginDto_1.LoginDto(body);
            const errors = yield (0, class_validator_1.validate)(dto);
            if (errors.length > 0) {
                throw new CustomError_1.default(HTTPCode_1.HttpCode.BAD_REQUEST, 'Not valid request body');
            }
            const user = yield User_1.default.findOne({ login: dto.login }).select('+password');
            if (!user) {
                throw new CustomError_1.default(HTTPCode_1.HttpCode.BAD_REQUEST, 'User with this login doesnt exist');
            }
            const isPasswordCorrect = yield CryptoService_1.default.compare(user.password, dto.password);
            if (!isPasswordCorrect) {
                throw new CustomError_1.default(HTTPCode_1.HttpCode.BAD_REQUEST, 'Bad password');
            }
            const auth = this.getAuthResponse(user.toJSON());
            response.status(HTTPCode_1.HttpCode.CREATED).send(auth);
        });
    }
    static me(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const auth = this.getAuthResponse(request.user.toJSON());
            response.status(HTTPCode_1.HttpCode.CREATED).send(auth);
        });
    }
}
const authRouter = (0, express_1.Router)();
authRouter.post('/login/', (0, async_middleware_1.wrap)((req, res) => AuthService.login(req, res)));
authRouter.post('/register/', (0, async_middleware_1.wrap)((req, res) => AuthService.register(req, res)));
authRouter.post('/me/', authMiddleware_1.default, (0, async_middleware_1.wrap)((req, res) => AuthService.me(req, res)));
exports.default = authRouter;
