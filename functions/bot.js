import {config} from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';

config()
const token = process.env.TOKEN

export const bot = new TelegramBot(token, {polling: true});



