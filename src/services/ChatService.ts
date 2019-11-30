import Telegraf, { ContextMessageUpdate, session } from 'telegraf';
import { LaundryService } from './LaundryService';
import { User } from '../models/User';
import { Program } from '../models/Program';

export class ChatService {
    private readonly bot: Telegraf<ContextMessageUpdate>;

    constructor(token: string, laundry: LaundryService) {
        this.bot = new Telegraf(token);

        this.bot.use(session());

        this.bot.use((ctx, next) => {
            if (ctx.message && ctx.message.from) {
                console.log(`<${ctx.message.from.first_name}>: ${ctx.message.text}`)
            }
            if (next) {
                next();
            }
        });

        this.bot.start(ctx => {
            if (!laundry.isRunning) {
                laundry.start(new User('Hallo'), new Program("Baumwolle 30 °C", "Baumwolle 30", 5000)).then(() => {
                    ctx.reply('Your laundry is done!');
                }).catch(() => {
                    ctx.reply('Laundry stopped.');
                });
            }
        });

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