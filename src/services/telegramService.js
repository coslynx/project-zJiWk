const { Telegraf } = require('telegraf');
const { logInfo, logError } = require('../config/loggerConfig');

const sendMessage = async (chatId, message) => {
  try {
    const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
    await bot.telegram.sendMessage(chatId, message);
    logInfo(`Sent message to chat ${chatId}: ${message}`);
  } catch (error) {
    logError(`Error sending message to chat ${chatId}: ${error}`);
    throw error;
  }
};

const sendFile = async (chatId, filePath, options = {}) => {
  try {
    const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
    await bot.telegram.sendDocument(chatId, { source: filePath }, options);
    logInfo(`Sent file ${filePath} to chat ${chatId}`);
  } catch (error) {
    logError(`Error sending file ${filePath} to chat ${chatId}: ${error}`);
    throw error;
  }
};

const sendPhoto = async (chatId, photoPath, options = {}) => {
  try {
    const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
    await bot.telegram.sendPhoto(chatId, { source: photoPath }, options);
    logInfo(`Sent photo ${photoPath} to chat ${chatId}`);
  } catch (error) {
    logError(`Error sending photo ${photoPath} to chat ${chatId}: ${error}`);
    throw error;
  }
};

const editMessage = async (chatId, messageId, message, options = {}) => {
  try {
    const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
    await bot.telegram.editMessageText(chatId, messageId, null, message, options);
    logInfo(`Edited message ${messageId} in chat ${chatId}`);
  } catch (error) {
    logError(`Error editing message ${messageId} in chat ${chatId}: ${error}`);
    throw error;
  }
};

const deleteMessage = async (chatId, messageId) => {
  try {
    const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
    await bot.telegram.deleteMessage(chatId, messageId);
    logInfo(`Deleted message ${messageId} in chat ${chatId}`);
  } catch (error) {
    logError(`Error deleting message ${messageId} in chat ${chatId}: ${error}`);
    throw error;
  }
};

const getChatId = (message) => {
  if (message.chat.id) {
    return message.chat.id;
  } else if (message.from.id) {
    return message.from.id;
  } else {
    throw new Error('Unable to retrieve chat ID from message.');
  }
};

module.exports = {
  sendMessage,
  sendFile,
  sendPhoto,
  editMessage,
  deleteMessage,
  getChatId,
};