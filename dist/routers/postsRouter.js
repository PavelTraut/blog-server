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
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const CustomError_1 = __importDefault(require("../types/CustomError"));
const Post_1 = __importDefault(require("../models/Post"));
const AddPostDto_1 = require("../dto/posts/AddPostDto");
const UpdatePostDto_1 = require("../dto/posts/UpdatePostDto");
const DeletePostDto_1 = require("../dto/posts/DeletePostDto");
const HTTPCode_1 = require("../types/HTTPCode");
const async_middleware_1 = require("async-middleware");
class PostsService {
    static isUserOwnerOfPost(user, post) {
        if (post.owner._id.toString() !== user._id.toString()) {
            return false;
        }
        return true;
    }
    static findById(id) {
        return Post_1.default.findById(id).populate('owner');
    }
    static throwNoPostError() {
        throw new CustomError_1.default(HTTPCode_1.HttpCode.BAD_REQUEST, 'Post with this id doesnt exist');
    }
    static throwNoAccessError() {
        throw new CustomError_1.default(HTTPCode_1.HttpCode.BAD_REQUEST, 'No access to this data');
    }
    static get(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const limit = +request.query.limit || 20;
            const count = request.query.count;
            const page = +request.query.page || 0;
            if (count) {
                const count = yield Post_1.default.count();
                return response.status(HTTPCode_1.HttpCode.OK).send({ count });
            }
            const posts = yield Post_1.default.find().limit(limit).skip(page * limit).sort({ createdAt: 'desc' }).populate('owner');
            response.status(HTTPCode_1.HttpCode.OK).send(posts);
        });
    }
    static add(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = request;
            const dto = new AddPostDto_1.AddPostDto(body);
            const errors = yield (0, class_validator_1.validate)(dto);
            if (errors.length > 0) {
                throw new CustomError_1.default(HTTPCode_1.HttpCode.BAD_REQUEST, 'Not valid request body');
            }
            const post = new Post_1.default(Object.assign(Object.assign({}, dto), { owner: request.user._id }));
            yield post.save();
            post.owner = request.user;
            response.status(HTTPCode_1.HttpCode.CREATED).send(post.toJSON());
        });
    }
    static update(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = request;
            const dto = new UpdatePostDto_1.UpdatePostDto(body);
            const errors = yield (0, class_validator_1.validate)(dto);
            if (errors.length > 0) {
                throw new CustomError_1.default(HTTPCode_1.HttpCode.BAD_REQUEST, 'Not valid request body');
            }
            const post = yield this.findById(dto.postId);
            if (!post) {
                return this.throwNoPostError();
            }
            if (!this.isUserOwnerOfPost(request.user, post)) {
                return this.throwNoAccessError();
            }
            post.template = dto.template;
            const updatedPost = yield post.save();
            response.status(HTTPCode_1.HttpCode.CREATED).send(updatedPost.toJSON());
        });
    }
    static getById(request, response) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const id = (_a = request.params) === null || _a === void 0 ? void 0 : _a.id;
            const post = yield this.findById(id);
            return response.status(HTTPCode_1.HttpCode.OK).send(!post ? null : post.toJSON());
        });
    }
    static delete(request, response) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const id = (_a = request.params) === null || _a === void 0 ? void 0 : _a.id;
            const dto = new DeletePostDto_1.DeletePostDto({ postId: id });
            const errors = yield (0, class_validator_1.validate)(dto);
            if (errors.length > 0) {
                throw new CustomError_1.default(HTTPCode_1.HttpCode.BAD_REQUEST, 'Not valid request body');
            }
            const post = yield this.findById(dto.postId);
            if (!post) {
                return this.throwNoPostError();
            }
            if (!this.isUserOwnerOfPost(request.user, post)) {
                return this.throwNoAccessError();
            }
            yield Post_1.default.findByIdAndRemove(id);
            return response.status(HTTPCode_1.HttpCode.OK).send();
        });
    }
}
const authRouter = (0, express_1.Router)();
authRouter.get('/', (0, async_middleware_1.wrap)((req, res) => PostsService.get(req, res)));
authRouter.get('/:id', (0, async_middleware_1.wrap)((req, res) => PostsService.getById(req, res)));
authRouter.post('/', authMiddleware_1.default, (0, async_middleware_1.wrap)((req, res) => PostsService.add(req, res)));
authRouter.put('/', authMiddleware_1.default, (0, async_middleware_1.wrap)((req, res) => PostsService.update(req, res)));
authRouter.delete('/:id', authMiddleware_1.default, (0, async_middleware_1.wrap)((req, res) => PostsService.delete(req, res)));
exports.default = authRouter;
