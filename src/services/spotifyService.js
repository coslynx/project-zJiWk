const SpotifyWebApi = require('spotify-web-api-node');
const { logInfo, logError } = require('../config/loggerConfig');

const getAuthenticatedSpotifyApi = (accessToken, refreshToken) => {
  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI,
  });
  spotifyApi.setAccessToken(accessToken);
  spotifyApi.setRefreshToken(refreshToken);
  return spotifyApi;
};

const searchSong = async (spotifyApi, query) => {
  try {
    logInfo(`Searching for song: ${query}`);
    const searchResults = await spotifyApi.search({
      q: query,
      type: 'track',
    });
    logInfo(`Search results:`, searchResults.body);
    return searchResults.body;
  } catch (error) {
    logError(`Error searching for song: ${error}`);
    throw error;
  }
};

const getSongDetails = async (spotifyApi, songUri) => {
  try {
    logInfo(`Getting song details: ${songUri}`);
    const songDetails = await spotifyApi.getTrack(songUri);
    logInfo(`Song details:`, songDetails.body);
    return songDetails.body;
  } catch (error) {
    logError(`Error getting song details: ${error}`);
    throw error;
  }
};

const getAccessToken = async (refreshToken) => {
  try {
    logInfo('Refreshing Spotify access token');
    const spotifyApi = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      redirectUri: process.env.SPOTIFY_REDIRECT_URI,
    });
    const data = await spotifyApi.refreshAccessToken(refreshToken);
    logInfo('Spotify access token refreshed successfully');
    return data.body.access_token;
  } catch (error) {
    logError('Error refreshing Spotify access token:', error);
    throw error;
  }
};

const refreshToken = async (refreshToken) => {
  try {
    logInfo('Refreshing Spotify refresh token');
    const spotifyApi = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      redirectUri: process.env.SPOTIFY_REDIRECT_URI,
    });
    const data = await spotifyApi.refreshAccessToken(refreshToken);
    logInfo('Spotify refresh token refreshed successfully');
    return data.body.refresh_token;
  } catch (error) {
    logError('Error refreshing Spotify refresh token:', error);
    throw error;
  }
};

module.exports = {
  getAuthenticatedSpotifyApi,
  searchSong,
  getSongDetails,
  getAccessToken,
  refreshToken,
};