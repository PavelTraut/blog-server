import {compare, hash} from "bcrypt";

export default class CryptoService {


    static hash(pass: string) {
        return hash(pass, +process.env.SALT_ROUNDS)
    }

    static compare(hash: string, pass: string) {
        return compare(pass, hash)
    }
}