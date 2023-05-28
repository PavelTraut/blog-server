"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePostDto = void 0;
const class_validator_1 = require("class-validator");
const class_validator_mongo_object_id_1 = require("class-validator-mongo-object-id");
class UpdatePostDto {
    constructor({ template, postId }) {
        this.template = template;
        this.postId = postId;
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)()
], UpdatePostDto.prototype, "template", void 0);
__decorate([
    (0, class_validator_mongo_object_id_1.IsObjectId)()
], UpdatePostDto.prototype, "postId", void 0);
exports.UpdatePostDto = UpdatePostDto;