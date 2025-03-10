# Cryptocurrency Telegram Bot

A Telegram bot that fetches cryptocurrency prices and sends updates to a Telegram channel when triggered by a command.

## Features

- Fetches real-time cryptocurrency prices from CoinGecko API
- Sends updates to a specified Telegram channel when triggered by a command
- Provides detailed information about specific cryptocurrencies
- Tracks Bitcoin, Ethereum, Avalanche, Blub, Wink, and Ket

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- A Telegram Bot Token (obtained from [@BotFather](https://t.me/BotFather))
- A Telegram Channel ID where the bot will send updates

## Setup

1. Clone this repository:
   ```
   git clone <repository-url>
   cd crypto-telegram-bot
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory based on the `.env.example` file:
   ```
   cp .env.example .env
   ```

4. Edit the `.env` file and add your Telegram Bot Token and Channel ID:
   ```
   BOT_TOKEN=your_telegram_bot_token_here
   CHANNEL_ID=your_telegram_channel_id_here
   ```

## How to Get a Telegram Bot Token

1. Start a chat with [@BotFather](https://t.me/BotFather) on Telegram
2. Send the command `/newbot`
3. Follow the instructions to create a new bot
4. Once created, BotFather will provide you with a token

## How to Get a Channel ID

1. Create a channel in Telegram or use an existing one
2. Add your bot to the channel as an administrator
3. Send a message to the channel
4. Visit `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
5. Look for the `chat` object and find the `id` field (it will be a negative number for channels)

## Running the Bot

Start the bot with:
```
npm start
```

For development with auto-restart on file changes:
```
npm run dev
```

## Bot Commands

- `/start` - Start the bot and get a welcome message
- `/help` - Show available commands
- `/cryptoupdate` - Trigger a cryptocurrency update to the channel
- `/crypto [name]` - Get information about a specific cryptocurrency (e.g., `/crypto bitcoin`)
- `/trending` - Show trending cryptocurrencies
- `/list` - Show the list of tracked cryptocurrencies

## Customizing Tracked Cryptocurrencies

To modify the list of tracked cryptocurrencies, edit the `cryptoList` array in `index.js`. The names should match the IDs used by the CoinGecko API.

## License

MIT 