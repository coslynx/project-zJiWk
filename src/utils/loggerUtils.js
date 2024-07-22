const { logInfo, logError, logWarning } = require('../config/loggerConfig');

const logDebug = (message) => {
  logInfo(`DEBUG: ${message}`);
};

module.exports = {
  logInfo,
  logError,
  logWarning,
  logDebug,
};