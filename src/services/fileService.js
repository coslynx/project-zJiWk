const fs = require('fs');
const axios = require('axios');
const { logInfo, logError } = require('../config/loggerConfig');
const { DOWNLOAD_DIRECTORY, MAX_DOWNLOAD_SIZE } = require('../utils/constants');

const downloadFile = async (url, filePath) => {
  try {
    const response = await axios({
      method: 'GET',
      url,
      responseType: 'stream',
    });

    const writer = fs.createWriteStream(filePath);

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        logInfo(`Downloaded file to ${filePath}`);
        resolve();
      });
      writer.on('error', (error) => {
        logError(`Error downloading file: ${error}`);
        reject(error);
      });
    });
  } catch (error) {
    logError(`Error downloading file: ${error}`);
    throw error;
  }
};

const getFilePath = (title, artist) => {
  const safeTitle = title.replace(/[^a-zA-Z0-9]/g, '_');
  const safeArtist = artist.replace(/[^a-zA-Z0-9]/g, '_');
  const fileName = `${safeArtist} - ${safeTitle}.flac`;
  const filePath = `${DOWNLOAD_DIRECTORY}/${fileName}`;
  return filePath;
};

const deleteFile = async (filePath) => {
  try {
    fs.unlinkSync(filePath);
    logInfo(`Deleted file from ${filePath}`);
  } catch (error) {
    logError(`Error deleting file: ${error}`);
    throw error;
  }
};

const getFileSize = (filePath) => {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (error) {
    logError(`Error getting file size: ${error}`);
    throw error;
  }
};

const moveFile = async (sourcePath, destinationPath) => {
  try {
    fs.renameSync(sourcePath, destinationPath);
    logInfo(`Moved file from ${sourcePath} to ${destinationPath}`);
  } catch (error) {
    logError(`Error moving file: ${error}`);
    throw error;
  }
};

module.exports = {
  downloadFile,
  getFilePath,
  deleteFile,
  getFileSize,
  moveFile,
};