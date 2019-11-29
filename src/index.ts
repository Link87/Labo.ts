import fs = require("fs");
import Telegraf from 'telegraf';

const token: string = fs.readFileSync("./token.key", 'utf8');

console.log(token);

const bot = new Telegraf(token);

bot.use((ctx, next) => {
    console.log(ctx.message)
    if (next) {
        next();
    }
});

bot.on('text', (ctx) => setTimeout(() => ctx.reply('Hello World'), 5000));
bot.launch();