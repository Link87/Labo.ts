import fs = require('fs');
import { Program } from '../models/Program';

export class ProgramService {

    private programs: ReadonlyArray<Program> = [];

    public load(): void {
        const json: string = fs.readFileSync('programs.json', 'utf8');
        this.programs = JSON.parse(json);
    }

    public getPrograms(): ReadonlyArray<Program> {
        return this.programs;
    }

    findProgram(name: string): Program | undefined {
        return this.programs.find(prog => prog.name === name || prog.shortName === name);
    }
}