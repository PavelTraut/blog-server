"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = require("bcrypt");
class CryptoService {
    static hash(pass) {
        return (0, bcrypt_1.hash)(pass, +process.env.SALT_ROUNDS);
    }
    static compare(hash, pass) {
        return (0, bcrypt_1.compare)(pass, hash);
    }
}
exports.default = CryptoService;
