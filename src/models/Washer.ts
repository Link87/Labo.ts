import { Program } from './Program';
import { User } from './User';

export class Washer {
    public state: Idle | RunningState = {};
}

export class RunningState {

    private endTime: number;

    constructor(public user: User, public program: Program) {
        this.endTime = new Date().getTime() + program.duration;
    }

    get durationMs(): number {
        return this.endTime - new Date().getTime();
    }
}

export type Idle = {};