export class Timer {

    private cancelHandle: ((err: any) => void) | undefined;
    private finishTime: number | undefined;
    private started: boolean = false;

    constructor(public readonly duration: number) {}

    public start(): Promise<void> {
        if (this.started) throw Error('Cannot start timer twice!');

        let promise = new Promise<void>((resolve, reject) => {
            let timeout: NodeJS.Timeout = setTimeout(() => resolve(), this.duration);
            this.finishTime = new Date().getTime() + this.duration;
            this.cancelHandle = (err: any) => {
                reject(err);
                clearTimeout(timeout);
            }
        });
        this.started = true;
        return promise;
    }

    public cancel(): void {
        if(this.cancelHandle) {
            this.cancelHandle(undefined);
        } else throw Error('Could not cancel timer!');
    }

    public get remainingTime(): number | undefined {
        if (this.finishTime !== undefined) {
            return this.finishTime - new Date().getTime();
        }
        return undefined;
    }
}