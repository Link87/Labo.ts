import { User } from '../models/User';
import { StateContext } from './ChatService';

export class UserService {
    private users: UserDb = {
        '': new User('', 'Missingno')
    };

    public getUser(id: string): User | undefined {
        if(this.users[id]) {
            return this.users[id];
        }
        return undefined;
    }

    public addUser(id: string, name: string) {
        this.users[id] = new User(id, name);
    }

    public userMiddleware = async (ctx: StateContext, next: (() => any) | undefined) => {
        if (ctx.from === undefined) {
            ctx.state.user = this.users[''];
        } else if (this.getUser(ctx.from.id.toString()) === undefined) {
            this.addUser(ctx.from.id.toString(), ctx.from.first_name)
        } else {
            ctx.state.user = this.getUser(ctx.from.id.toString());
        }

        if (next) {
            return next();
        }
    }
}

interface UserDb {
    [id: string]: User,
}