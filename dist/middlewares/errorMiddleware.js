"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CustomError_1 = __importDefault(require("../types/CustomError"));
const HTTPCode_1 = require("../types/HTTPCode");
function errorMiddleware(error, request, response, next) {
    let status = HTTPCode_1.HttpCode.INTERNAL_SERVER_ERROR;
    if (error instanceof CustomError_1.default) {
        status = error.status || HTTPCode_1.HttpCode.INTERNAL_SERVER_ERROR;
    }
    console.log(status, error.message);
    response.status(status).send(error.message);
}
exports.default = errorMiddleware;
