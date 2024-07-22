const SpotifyWebApi = require('spotify-web-api-node');
const { logInfo, logError } = require('../config/loggerConfig');

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

module.exports = {
  searchSong,
  getSongDetails,
  getAuthenticatedSpotifyApi,
};