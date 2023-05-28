import {IsObjectId} from "class-validator-mongo-object-id";

export class DeletePostDto {
    constructor({postId}: { postId?: string }) {
        this.postId = postId || ""
    }

    @IsObjectId()
    postId: string;
}
