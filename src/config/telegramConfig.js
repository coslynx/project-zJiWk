const { Telegraf } = require('telegraf');
const dotenv = require('dotenv');

dotenv.config();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

const getTelegramBot = () => {
  if (!TELEGRAM_BOT_TOKEN) {
    throw new Error('TELEGRAM_BOT_TOKEN is not set in the environment variables.');
  }
  return new Telegraf(TELEGRAM_BOT_TOKEN);
};

module.exports = {
  getTelegramBot,
};