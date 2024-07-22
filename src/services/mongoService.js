const { getMongoDB, createDocument, readDocument, updateDocument, deleteDocument, findDocuments } = require('../utils/mongoUtils');
const { logInfo, logError } = require('../config/loggerConfig');
const Song = require('../models/Song');
const User = require('../models/User');

const createSong = async (songData) => {
  try {
    const newSong = new Song(songData);
    await newSong.save();
    logInfo(`Created new song: ${songData.title} by ${songData.artist}`);
    return newSong;
  } catch (error) {
    logError(`Error creating song: ${error}`);
    throw error;
  }
};

const readSong = async (songId) => {
  try {
    const song = await Song.findById(songId);
    logInfo(`Read song: ${song.title} by ${song.artist}`);
    return song;
  } catch (error) {
    logError(`Error reading song: ${error}`);
    throw error;
  }
};

const updateSong = async (songId, songData) => {
  try {
    const updatedSong = await Song.findByIdAndUpdate(songId, songData, { new: true });
    logInfo(`Updated song: ${updatedSong.title} by ${updatedSong.artist}`);
    return updatedSong;
  } catch (error) {
    logError(`Error updating song: ${error}`);
    throw error;
  }
};

const deleteSong = async (songId) => {
  try {
    await Song.findByIdAndDelete(songId);
    logInfo(`Deleted song with ID: ${songId}`);
  } catch (error) {
    logError(`Error deleting song: ${error}`);
    throw error;
  }
};

const findSongs = async (query) => {
  try {
    const songs = await Song.find(query);
    logInfo(`Found ${songs.length} songs matching the query`);
    return songs;
  } catch (error) {
    logError(`Error finding songs: ${error}`);
    throw error;
  }
};

const createUser = async (userData) => {
  try {
    const newUser = new User(userData);
    await newUser.save();
    logInfo(`Created new user with ID: ${userData.spotifyId}`);
    return newUser;
  } catch (error) {
    logError(`Error creating user: ${error}`);
    throw error;
  }
};

const readUser = async (userId) => {
  try {
    const user = await User.findOne({ spotifyId: userId });
    logInfo(`Read user with ID: ${userId}`);
    return user;
  } catch (error) {
    logError(`Error reading user: ${error}`);
    throw error;
  }
};

const updateUser = async (userId, userData) => {
  try {
    const updatedUser = await User.findOneAndUpdate({ spotifyId: userId }, userData, { new: true });
    logInfo(`Updated user with ID: ${userId}`);
    return updatedUser;
  } catch (error) {
    logError(`Error updating user: ${error}`);
    throw error;
  }
};

const deleteUser = async (userId) => {
  try {
    await User.findOneAndDelete({ spotifyId: userId });
    logInfo(`Deleted user with ID: ${userId}`);
  } catch (error) {
    logError(`Error deleting user: ${error}`);
    throw error;
  }
};

const findUsers = async (query) => {
  try {
    const users = await User.find(query);
    logInfo(`Found ${users.length} users matching the query`);
    return users;
  } catch (error) {
    logError(`Error finding users: ${error}`);
    throw error;
  }
};

module.exports = {
  createSong,
  readSong,
  updateSong,
  deleteSong,
  findSongs,
  createUser,
  readUser,
  updateUser,
  deleteUser,
  findUsers,
};