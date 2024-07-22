const { logError } = require('../config/loggerConfig');

const handleError = (error, ctx) => {
  logError(`Error occurred: ${error}`);
  if (ctx) {
    ctx.reply(`An error occurred: ${error.message}`);
  }
};

module.exports = {
  handleError,
};