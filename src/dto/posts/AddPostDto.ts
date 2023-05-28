import {IsNotEmpty, IsString} from "class-validator";

export class AddPostDto {
    constructor({template}: { template: string }) {
        this.template = template
    }

    @IsString()
    @IsNotEmpty()
    template: string;
}
