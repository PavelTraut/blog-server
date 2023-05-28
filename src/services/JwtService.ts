import {IUser} from "../models/User";
import {sign, verify} from 'jsonwebtoken'

export default class JwtService {

    static sign(user: IUser) {
        return sign({id: user._id}, process.env.JWT_KEY, {expiresIn: '3d'})
    }

    static verify(token: string) {
        return verify(token, process.env.JWT_KEY) as { id: string }
    }
}