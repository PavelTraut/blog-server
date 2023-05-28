import {model, Schema, Types} from 'mongoose';
import {IUser} from "./User";

export interface IPost {
    template: string;
    owner: IUser;
    createdAt: Date
}

const noteSchema = new Schema<IPost>({
    template: {type: String, required: true},
    owner: {type: Types.ObjectId, ref: "User"}
}, {timestamps: true, versionKey: false});
export default model<IPost>('Post', noteSchema);