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
const JwtService_1 = __importDefault(require("../services/JwtService"));
const User_1 = __importDefault(require("../models/User"));
const CustomError_1 = __importDefault(require("../types/CustomError"));
const HTTPCode_1 = require("../types/HTTPCode");
function authMiddleware(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = (_a = req.header("authorization")) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
            if (!token)
                throw new CustomError_1.default(HTTPCode_1.HttpCode.UNAUTHORIZED, "No access to this data");
            const decoded = JwtService_1.default.verify(token);
            req.user = yield User_1.default.findById(decoded.id);
            if (!req.user) {
                throw new CustomError_1.default(HTTPCode_1.HttpCode.BAD_REQUEST, "No access to this data");
            }
            next();
        }
        catch (error) {
            next(new CustomError_1.default(HTTPCode_1.HttpCode.UNAUTHORIZED, "Not valid token"));
        }
    });
}
exports.default = authMiddleware;
