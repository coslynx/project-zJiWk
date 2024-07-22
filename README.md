# Telegram Music Bot

This project implements a Telegram bot that allows users to search for and download songs in FLAC format from Spotify directly within their Telegram chat.

## Prerequisites

* **Node.js and npm:** Install the latest version of Node.js from [https://nodejs.org/](https://nodejs.org/). This includes npm, the Node Package Manager.
* **MongoDB:** Install and set up a MongoDB database. You can use a local instance or a cloud-based service like MongoDB Atlas.
* **Telegram Account:** Create a Telegram account and obtain a bot token from BotFather.

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/telegram-music-bot.git
   cd telegram-music-bot
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## Configuration

1. **Create a .env file:**
   ```bash
   touch .env
   ```

2. **Add environment variables:**
   ```
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   SPOTIFY_REDIRECT_URI=your_spotify_redirect_uri
   MONGO_URI=your_mongodb_uri
   DOWNLOAD_DIRECTORY=./downloads  # Adjust if needed
   ```
   Replace the placeholders with your actual values.

3. **Obtain your Telegram bot token:**
   - Go to [https://t.me/BotFather](https://t.me/BotFather) in Telegram.
   - Start a conversation with BotFather and type `/newbot`.
   - Follow the instructions to create a new bot and obtain your bot token.

4. **Obtain your Spotify client ID and secret:**
   - Go to the Spotify Developer Dashboard at [https://developer.spotify.com/dashboard/](https://developer.spotify.com/dashboard/).
   - Create a new application and obtain your client ID and client secret.

5. **Set up MongoDB:**
   - Create a new database for your bot.
   - Get the connection URI for your database.

## Deployment

1. **Start the bot:**
   ```bash
   npm start
   ```

2. **Send a message to your bot:**
   - Open Telegram and search for your bot using its username.
   - Send a message to your bot to start using it.

## Usage

* **Start the bot:** Send `/start` to your bot to begin using it. You will be asked to authenticate your Spotify account.
* **Search for a song:** Send `/search song_name` to search for a song.
* **Download a song:** Send `/download song_name` to download the selected song in FLAC format.
* **Help:** Send `/help` to see a list of available commands.

## Contributing

Contributions are welcome! Please open an issue or pull request to suggest improvements or report bugs.

## License

This project is licensed under the MIT License.

## Contact

For any questions or feedback, please contact the project developers.