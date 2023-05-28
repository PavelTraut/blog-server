import {Request, Response, Router} from "express";
import {validate} from "class-validator";
import authMiddleware from "../middlewares/authMiddleware";
import CustomError from "../types/CustomError";
import Post, {IPost} from "../models/Post";
import {AddPostDto} from "../dto/posts/AddPostDto";
import {UpdatePostDto} from "../dto/posts/UpdatePostDto";
import {IUser} from "../models/User";
import {DeletePostDto} from "../dto/posts/DeletePostDto";
import {HttpCode} from "../types/HTTPCode";
import {wrap} from "async-middleware";

class PostsService {

    private static isUserOwnerOfPost(user: IUser, post: IPost) {
        if (post.owner._id.toString() !== user._id.toString()) {
            return false
        }
        return true
    }

    private static findById(id: string) {
        return Post.findById(id).populate('owner')
    }

    private static throwNoPostError() {
        throw new CustomError(HttpCode.BAD_REQUEST, 'Post with this id doesnt exist')
    }

    private static throwNoAccessError() {
        throw new CustomError(HttpCode.BAD_REQUEST, 'No access to this data')
    }


    static async get(request: Request<{},{},{},{ limit: string, page: string ,count:boolean}>, response: Response<IPost[] | {count:number}>) {
        const limit = +request.query.limit || 20
        const count = request.query.count
        const page = +request.query.page || 0
        if(count){
            const count=await Post.count()
            return response.status(HttpCode.OK).send({count})
        }

        const posts = await Post.find().limit(limit).skip(page * limit).sort({createdAt: 'desc'}).populate('owner')
        response.status(HttpCode.OK).send(posts)
    }

    static async add(request: Request<{}, {}, AddPostDto>, response: Response<IPost>) {
        const {body} = request
        const dto = new AddPostDto(body)
        const errors = await validate(dto);
        if (errors.length > 0) {
            throw new CustomError(HttpCode.BAD_REQUEST, 'Not valid request body')
        }

        const post = new Post({...dto, owner: request.user._id})

        await post.save()

        post.owner=request.user

        response.status(HttpCode.CREATED).send(post.toJSON())
    }

    static async update(request: Request<{}, {}, UpdatePostDto>, response: Response<IPost>) {
        const {body} = request
        const dto = new UpdatePostDto(body)
        const errors = await validate(dto);
        if (errors.length > 0) {
            throw new CustomError(HttpCode.BAD_REQUEST, 'Not valid request body')
        }

        const post = await this.findById(dto.postId)

        if (!post) {
            return this.throwNoPostError()
        }

        if (!this.isUserOwnerOfPost(request.user, post)) {
            return this.throwNoAccessError()
        }


        post.template = dto.template

        const updatedPost = await post.save()

        response.status(HttpCode.CREATED).send(updatedPost.toJSON())
    }

    static async getById(request: Request<{ id: string } | any>, response: Response) {
        const id = request.params?.id
        const post = await this.findById(id)
        return response.status(HttpCode.OK).send(!post ? null : post.toJSON())
    }

    static async delete(request: Request<{ id: string } | any>, response: Response) {
        const id = request.params?.id

        const dto = new DeletePostDto({postId: id})
        const errors = await validate(dto);
        if (errors.length > 0) {
            throw new CustomError(HttpCode.BAD_REQUEST, 'Not valid request body')
        }

        const post = await this.findById(dto.postId)

        if (!post) {
            return this.throwNoPostError()
        }

        if (!this.isUserOwnerOfPost(request.user, post)) {
            return this.throwNoAccessError()
        }

        await Post.findByIdAndRemove(id)
        return response.status(HttpCode.OK).send()
    }

}

const authRouter = Router();

authRouter.get('/', wrap<any, any>((req, res) => PostsService.get(req, res)))
authRouter.get('/:id', wrap<any, any>((req, res) => PostsService.getById(req, res)))
authRouter.post('/', authMiddleware, wrap<any, any>((req, res) => PostsService.add(req, res)))
authRouter.put('/', authMiddleware, wrap<any, any>((req, res) => PostsService.update(req, res)))
authRouter.delete('/:id', authMiddleware, wrap<any, any>((req, res) => PostsService.delete(req, res)))

export default authRouter