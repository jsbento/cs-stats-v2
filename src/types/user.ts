import { ObjectId } from "mongodb";

export type User = {
    _id?: ObjectId;
    username: string;
    profile: UserProfile;
    createdAt: Date;
}

export type UserProfile = {
    steamUsername: string;
}