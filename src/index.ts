import fs = require('fs');
import { ChatService } from './services/ChatService';
import { LaundryService } from './services/LaundryService';

const token: string = fs.readFileSync("./token.key", 'utf8');

const laundry = new LaundryService();
const chat = new ChatService(token, laundry);
chat.launch();
