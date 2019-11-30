import fs = require('fs');
import { ChatService } from './handlers/ChatService';
import { LaundryService } from './laundry/LaundryService';
import { ProgramService } from './laundry/ProgramService';
import { UserService } from './handlers/UserService';

const token: string = fs.readFileSync("./token.key", 'utf8');

const programs = new ProgramService();
programs.load();

const laundry = new LaundryService();
const users = new UserService();
const chat = new ChatService(token, users, laundry, programs);
chat.launch();
