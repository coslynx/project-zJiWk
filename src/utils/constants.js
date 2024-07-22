const path = require('path');

const DOWNLOAD_DIRECTORY = path.join(__dirname, '..', '..', 'downloads');
const MAX_DOWNLOAD_SIZE = 100 * 1024 * 1024; // 100 MB
const SUPPORTED_FILE_TYPES = ['flac'];

module.exports = {
  DOWNLOAD_DIRECTORY,
  MAX_DOWNLOAD_SIZE,
  SUPPORTED_FILE_TYPES,
};