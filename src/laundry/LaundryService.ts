import { Washer, Running, Idle } from '../models/Washer';
import { Program } from '../models/Program';
import { User } from '../models/User';
import { Timer } from './Timer';

export class LaundryService {
    private readonly washer: Washer;
    private timer: Timer | undefined;

    constructor() {
        this.washer = new Washer();
    }

    public async start(user: User, program: Program): Promise<void> {
        if (!(this.washer.state instanceof Running)) {
            this.washer.state = new Running(user, program);
            this.timer = new Timer(program.duration);
            return this.timer.start().then(() => {
                this.timer = undefined;
                this.washer.state = new Idle;
            });
        }
    }

    public stop(): void {
        this.washer.state = new Idle;
        if (this.timer) {
            this.timer.cancel();
            this.timer = undefined;
        }
    }

    public get isRunning(): boolean {
        return this.washer.state instanceof Running;
    }

    public get remainingTime(): number | undefined {
        if (this.washer.state instanceof Running && this.timer !== undefined) {
            return this.timer.remainingTime;
        }
        return undefined;
    }
}