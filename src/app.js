const { Telegraf } = require('telegraf');
const { getTelegramBot } = require('./config/telegramConfig');
const { getSpotifyApi } = require('./config/spotifyConfig');
const { connectToMongoDB, getMongoDB } = require('./config/mongoConfig');
const { logInfo, logError } = require('./config/loggerConfig');
const { sendMessage, sendFile, getChatId } = require('./utils/telegramUtils');
const { searchSong, getSongDetails, getAuthenticatedSpotifyApi } = require('./utils/spotifyUtils');
const { downloadFile, getFilePath } = require('./utils/fileUtils');
const { createSong, readUser, updateUser } = require('./services/mongoService');
const { handleError } = require('./utils/errorHandler');
const { SPOTIFY_REDIRECT_URI } = require('./config/spotifyConfig');
const { DOWNLOAD_DIRECTORY } = require('./utils/constants');
const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const yargs = require('yargs/yargs')(process.argv);
const argv = yargs.argv;

const bot = getTelegramBot();
const spotifyApi = getSpotifyApi();
let mongoDB;

passport.use(new SpotifyStrategy({
  clientID: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  callbackURL: SPOTIFY_REDIRECT_URI
}, (accessToken, refreshToken, expires_in, profile, done) => {
  logInfo(`Spotify authentication successful for user: ${profile.id}`);
  done(null, { accessToken, refreshToken, expires_in, spotifyId: profile.id });
}));

bot.use(passport.initialize());
bot.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user.spotifyId);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await readUser(id);
    done(null, user);
  } catch (error) {
    logError(`Error deserializing user: ${error}`);
    done(error, null);
  }
});

bot.start(async (ctx) => {
  try {
    const chatId = getChatId(ctx.message);
    const user = ctx.session.passport?.user;
    if (!user) {
      await sendMessage(chatId, 'Please authenticate your Spotify account to use this bot.');
      await ctx.authenticate('spotify');
    } else {
      await sendMessage(chatId, `Welcome back, ${user.displayName || 'user'}!`);
      await updateUser(user.spotifyId, { accessToken: user.accessToken, refreshToken: user.refreshToken });
    }
  } catch (error) {
    handleError(error, ctx);
  }
});

bot.on('authenticated', async (ctx) => {
  try {
    const chatId = getChatId(ctx.message);
    const user = ctx.session.passport.user;
    await updateUser(user.spotifyId, { accessToken: user.accessToken, refreshToken: user.refreshToken });
    await sendMessage(chatId, 'Spotify account authenticated successfully!');
  } catch (error) {
    handleError(error, ctx);
  }
});

bot.command('search', async (ctx) => {
  try {
    const chatId = getChatId(ctx.message);
    const query = ctx.message.text.split(' ').slice(1).join(' ');
    if (!query) {
      await sendMessage(chatId, 'Please provide a song name to search for.');
      return;
    }
    const user = ctx.session.passport?.user;
    if (!user) {
      await sendMessage(chatId, 'Please authenticate your Spotify account first.');
      return;
    }
    const spotifyApi = getAuthenticatedSpotifyApi(user.accessToken, user.refreshToken);
    const searchResults = await searchSong(spotifyApi, query);
    if (searchResults.tracks.items.length === 0) {
      await sendMessage(chatId, 'No results found for your query.');
      return;
    }
    const song = searchResults.tracks.items[0];
    await sendMessage(chatId, `Found song: ${song.name} by ${song.artists[0].name}. Do you want to download it?`);
    await ctx.replyWithInlineKeyboard([
      [
        { text: 'Download', callback_data: `download ${song.uri}` },
      ],
    ]);
  } catch (error) {
    handleError(error, ctx);
  }
});

bot.action(/download (.*)/, async (ctx) => {
  try {
    const chatId = getChatId(ctx.message);
    const songUri = ctx.match[1];
    const user = ctx.session.passport?.user;
    if (!user) {
      await sendMessage(chatId, 'Please authenticate your Spotify account first.');
      return;
    }
    const spotifyApi = getAuthenticatedSpotifyApi(user.accessToken, user.refreshToken);
    const songDetails = await getSongDetails(spotifyApi, songUri);
    if (!songDetails.is_playable || !songDetails.available_markets.includes('US')) {
      await sendMessage(chatId, 'This song is not available for download.');
      return;
    }
    const downloadUrl = songDetails.external_urls.spotify;
    const songTitle = songDetails.name;
    const songArtist = songDetails.artists[0].name;
    await sendMessage(chatId, `Downloading ${songTitle} by ${songArtist}...`);
    const downloadPath = getFilePath(songTitle, songArtist);
    await downloadFile(downloadUrl, downloadPath);
    await sendFile(chatId, downloadPath, { filename: `${songTitle} - ${songArtist}.flac` });
    await createSong({
      title: songTitle,
      artist: songArtist,
      downloadUrl,
      userId: user.spotifyId,
    });
    await sendMessage(chatId, `Download complete!`);
  } catch (error) {
    handleError(error, ctx);
  }
});

bot.command('help', (ctx) => {
  const chatId = getChatId(ctx.message);
  sendMessage(chatId, 'Available commands:\n/start - Start the bot and authenticate your Spotify account\n/search <song name> - Search for a song\n/download <song name> - Download a song\n/help - Display this help message');
});

bot.catch((error) => {
  logError(`Error occurred: ${error}`);
});

(async () => {
  try {
    logInfo('Connecting to MongoDB...');
    mongoDB = await connectToMongoDB();
    logInfo('MongoDB connected successfully!');
    if (argv.port) {
      const port = argv.port;
      logInfo(`Starting bot on port ${port}...`);
      bot.launch({ webhook: { port } });
    } else {
      logInfo('Starting bot...');
      bot.launch();
    }
  } catch (error) {
    logError(`Error starting bot: ${error}`);
  }
})();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));