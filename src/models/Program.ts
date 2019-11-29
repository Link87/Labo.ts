export class Program {
    
    constructor(public readonly name: string, public readonly shortName: string, public readonly duration: number) {}

    public get durationMs() {
        return this.duration * 60 * 1000;
    }
}