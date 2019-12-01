import Telegraf, { session, Stage, Scene, SceneContextMessageUpdate, BaseScene } from 'telegraf';
import { LaundryService } from '../laundry/LaundryService';
import { ProgramService } from '../laundry/ProgramService';
import { UserService } from './UserService';
import { strict as assert } from 'assert';

export type StateContext = SceneContextMessageUpdate & {state: any};

export class ChatService {
    private readonly bot: Telegraf<StateContext>;

    constructor(token: string, users: UserService, laundry: LaundryService, programs: ProgramService) {
        this.bot = new Telegraf(token);

        this.bot.use((ctx, next) => {
            if (ctx.message && ctx.message.from) {
                console.log(`<${ctx.message.from.first_name}>: ${ctx.message.text}`)
            }
            if (next) {
                next();
            }
        });

        this.bot.use(users.userMiddleware);

        const startScene: Scene<StateContext> = new BaseScene('start');
        startScene.enter(ctx => ctx.reply('Which program did you just start?'));
        programs.getPrograms().forEach(prog => {
            startScene.hears(prog.shortName, ctx => {
                if (!laundry.isRunning && ctx.from) {
                    ctx.state.prog = prog;
                    ctx.scene.enter('running');
                } else throw Error('Laundry is either already running (and it shouldn\'t) or sender could not be determined.')
            });
        });

        const runningScene: Scene<StateContext> = new BaseScene('running');
        runningScene.enter(ctx => {
            ctx.reply('Successfully started timer. You will be messaged when your laundry is done.');
            assert(!laundry.isRunning);
            laundry.start(ctx.state.user, ctx.state.prog).then(() => {
                ctx.reply('Your laundry is done!');
                ctx.scene.leave();
            }).catch(err => {
                if (err !== undefined) {
                    console.log(err);
                }
                ctx.reply('Laundry stopped.');
                ctx.scene.leave();
            });
        });
        runningScene.command('start', ctx => ctx.reply('Your laundry is aldeady being done. Please use /stop to cancel it first.'))
        runningScene.command('status', ctx => {
            if (laundry.isRunning && laundry.remainingTime) {
                ctx.reply(`The laundry is done in ${(laundry.remainingTime / 60 / 1000) | 0} minutes`);
            } else throw Error('Laundry should be running but is not!');
        });
        runningScene.command('stop', () => laundry.stop());

        const stage = new Stage<StateContext>([startScene, runningScene]);
        this.bot.use(session());
        this.bot.use(stage.middleware());

        this.bot.command('start', ctx => ctx.scene.enter('start'));
        this.bot.command('status', ctx => ctx.reply('The washer is free atm.'));
        this.bot.command('stop', ctx => ctx.reply('Nothing to stop.'));
    }

    public launch(): void {
        this.bot.launch();
    }
    
}