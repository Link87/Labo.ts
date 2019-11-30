import Telegraf, { session, Stage, Scene, SceneContextMessageUpdate, BaseScene } from 'telegraf';
import { LaundryService } from '../laundry/LaundryService';
import { ProgramService } from '../laundry/ProgramService';
import { UserService } from './UserService';

const { enter, leave } = Stage;

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
        startScene.enter(ctx => ctx.reply('Which program do you want to start?'));
        startScene.leave(ctx => ctx.reply('Bye'));

        programs.getPrograms().forEach(prog => {
            startScene.hears(prog.shortName, ctx => {
                if (!laundry.isRunning && ctx.from) {
                    console.log(ctx.from);
                    console.log(ctx.state.user);
                    laundry.start(ctx.state.user, prog).then(() => {
                        ctx.reply('Your laundry is done!');
                    }).catch(() => {
                        ctx.reply('Laundry stopped.');
                    });
                }
                leave();
            });
        });

        const stage = new Stage<StateContext>([startScene]);
        this.bot.use(session());
        this.bot.use(stage.middleware());

        this.bot.start(enter('start'));
        this.bot.command('status', ctx => {
            if (laundry.isRunning && laundry.remainingTime) {
                ctx.reply(`The laundry is done in ${(laundry.remainingTime / 60 / 1000) | 0} minutes`);
            } else {
                ctx.reply('The washer is free atm.');
            }
        });

        this.bot.command('stop', ctx => {
            if (laundry.isRunning) {
                laundry.stop();
            } else {
                ctx.reply('Nothing to stop.');
            }
        });
    }

    public launch(): void {
        this.bot.launch();
    }
    
}