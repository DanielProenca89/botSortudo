import {config} from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';
const token = "5340085173:AAHp_pX-UzeJH9trEPpsbBPqfOAvj2qwyE8"//process.env.TOKEN

export const bot = new TelegramBot(token, {polling: true});



