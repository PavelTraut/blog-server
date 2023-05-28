"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const noteSchema = new mongoose_1.Schema({
    template: { type: String, required: true },
    owner: { type: mongoose_1.Types.ObjectId, ref: "User" }
}, { timestamps: true, versionKey: false });
exports.default = (0, mongoose_1.model)('Post', noteSchema);
