"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
class JwtService {
    static sign(user) {
        return (0, jsonwebtoken_1.sign)({ id: user._id }, process.env.JWT_KEY, { expiresIn: '3d' });
    }
    static verify(token) {
        return (0, jsonwebtoken_1.verify)(token, process.env.JWT_KEY);
    }
}
exports.default = JwtService;
