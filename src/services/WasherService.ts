import { Washer, RunningState } from "../models/Washer";
import { Program } from "../models/Program";
import { User } from "../models/User";

export class WasherService {
    private readonly washer: Washer;

    constructor() {
        this.washer = new Washer();
    }

    public start(user: User, program: Program): void {
        if (!(this.washer.state instanceof RunningState)) {
            this.washer.state = new RunningState(user, program);
        }
    }

    public stop(): void {
        this.washer.state = {};
    }

    public get durationMs(): number | undefined {
        if (this.washer.state instanceof RunningState) {
            return this.washer.state.durationMs;
        }
        return undefined;
    }
}