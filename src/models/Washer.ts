import { Program } from './Program';
import { User } from './User';

export class Washer {
    public state: WasherState = new Idle;
}

export class Running {
    constructor(public user: User, public program: Program) {}
}

export class Idle {};

export type WasherState = Idle | Running;