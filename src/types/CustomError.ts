import {HttpCode} from "./HTTPCode";

export default class CustomError {
    public message: string
    public status: HttpCode

    constructor(status: HttpCode, message: string) {
        this.message = message
        this.status = status
    }
}