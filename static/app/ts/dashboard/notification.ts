import {User} from "../user";

export class Notification {
    id: number;
    owner: User;
    title: string;
    content: string;
    status: boolean;
    created: Date;
}