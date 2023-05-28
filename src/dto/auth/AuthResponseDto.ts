import {IUser} from "../../models/User";

export class AuthResponseDto {
    token: string;
    user: IUser
}