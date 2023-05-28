import {IsNotEmpty, IsString} from "class-validator";
import {IsObjectId} from "class-validator-mongo-object-id";

export class UpdatePostDto {
    constructor({template, postId}: { template: string, postId: string }) {
        this.template = template
        this.postId = postId
    }

    @IsString()
    @IsNotEmpty()
    template: string;

    @IsObjectId()
    postId: string;
}
