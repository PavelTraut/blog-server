"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CustomError {
    constructor(status, message) {
        this.message = message;
        this.status = status;
    }
}
exports.default = CustomError;
