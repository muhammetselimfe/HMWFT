require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const cryptoService = require('./services/cryptoService');
const { formatCryptoMessage, formatSingleCrypto, formatTrendingCryptos } = require('./utils/messageFormatter');
const { logError } = require('./utils/errorHandler');
const { DEFAULT_CRYPTO_LIST, BOT_CONFIG } = require('./config');

// Bot configuration
const token = BOT_CONFIG.TOKEN;
const channelId = BOT_CONFIG.CHANNEL_ID;

// Initialize the bot
const bot = new TelegramBot(token, { polling: true });

// List of cryptocurrencies to track
const cryptoList = DEFAULT_CRYPTO_LIST;

// Function to send cryptocurrency updates to the channel
async function sendCryptoUpdate() {
  try {
    const cryptoData = await cryptoService.fetchMultipleCryptoPrices(cryptoList);
    const message = formatCryptoMessage(cryptoData, cryptoList);
    
    await bot.sendMessage(channelId, message, { parse_mode: 'Markdown' });
    console.log('Crypto update sent successfully!');
    return true;
  } catch (error) {
    logError('Sending crypto update', error);
    console.error('Failed to send crypto update:', error.message);
    return false;
  }
}

// Command to manually trigger a crypto update
bot.onText(/\/cryptoupdate/, async (msg) => {
  const chatId = msg.chat.id;
  
  try {
    const success = await sendCryptoUpdate();
    if (!success) {
      await bot.sendMessage(chatId, 'Failed to send cryptocurrency update. Please try again later.');
    }
  } catch (error) {
    await bot.sendMessage(chatId, `Error: ${error.message}`);
  }
});

// Command to get specific cryptocurrency info
bot.onText(/\/crypto (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const cryptoName = match[1].toLowerCase();
  
  try {
    const cryptoData = await cryptoService.fetchSingleCryptoPrice(cryptoName);
    const message = formatSingleCrypto(cryptoData, cryptoName);
    
    await bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
  } catch (error) {
    await bot.sendMessage(chatId, `Error: ${error.message}`);
  }
});

// Command to get trending cryptocurrencies
bot.onText(/\/trending/, async (msg) => {
  const chatId = msg.chat.id;
  
  try {
    const trendingCryptos = await cryptoService.getTrendingCryptos();
    const message = formatTrendingCryptos(trendingCryptos);
    
    await bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
  } catch (error) {
    await bot.sendMessage(chatId, `Error: ${error.message}`);
  }
});

// Help command
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  
  const helpMessage = `
*Crypto Price Bot Commands*

/cryptoupdate - Trigger a cryptocurrency update to the channel
/crypto [name] - Get information about a specific cryptocurrency (e.g., /crypto bitcoin)
/trending - Show trending cryptocurrencies
/list - Show the list of tracked cryptocurrencies
/help - Show this help message
  `;
  
  bot.sendMessage(chatId, helpMessage, { parse_mode: 'Markdown' });
});

// List command to show tracked cryptocurrencies
bot.onText(/\/list/, (msg) => {
  const chatId = msg.chat.id;
  
  const listMessage = '*Tracked Cryptocurrencies*\n\n' + 
    cryptoList.map(crypto => `• ${crypto.charAt(0).toUpperCase() + crypto.slice(1)}`).join('\n');
  
  bot.sendMessage(chatId, listMessage, { parse_mode: 'Markdown' });
});

// Start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  
  const welcomeMessage = `
Welcome to the Crypto Price Bot! 🤖💰

This bot provides regular updates on cryptocurrency prices and market data.

Type /help to see available commands.
  `;
  
  bot.sendMessage(chatId, welcomeMessage);
});

// Error handling for the bot
bot.on('polling_error', (error) => {
  logError('Telegram bot polling', error);
});

// Log when the bot is running
console.log('Crypto Price Bot is running...');

// Don't send initial update when the bot starts - wait for command 