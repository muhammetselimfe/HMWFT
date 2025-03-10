require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// Import services and utilities
const cryptoService = require('../services/cryptoService');
const { formatCryptoMessage, formatSingleCrypto, formatTrendingCryptos } = require('../utils/messageFormatter');
const { logError } = require('../utils/errorHandler');
const { DEFAULT_CRYPTO_LIST, BOT_CONFIG } = require('../config');

// Bot configuration
const token = process.env.BOT_TOKEN;
const channelId = process.env.CHANNEL_ID;

// Initialize the bot in webhook mode for Vercel
const bot = new TelegramBot(token);

// Set webhook URL (this will be done externally)
// For local development, you can use a service like ngrok

// List of cryptocurrencies to track
const cryptoList = DEFAULT_CRYPTO_LIST;

// Function to send cryptocurrency updates to the channel
async function sendCryptoUpdate() {
  try {
    const cryptoData = await cryptoService.fetchMultipleCryptoPrices(cryptoList);
    const message = formatCryptoMessage(cryptoData, cryptoList);
    
    await bot.sendMessage(channelId, message, { parse_mode: 'Markdown' });
    return true;
  } catch (error) {
    logError('Sending crypto update', error);
    console.error('Failed to send crypto update:', error.message);
    return false;
  }
}

// Process incoming update from webhook
async function processUpdate(update) {
  if (!update || !update.message) {
    return { status: 'No message in update' };
  }

  const msg = update.message;
  const chatId = msg.chat.id;
  const text = msg.text || '';

  // Handle commands
  if (text.startsWith('/fucked')) {
    try {
      const success = await sendCryptoUpdate();
      if (!success) {
        await bot.sendMessage(chatId, 'Failed to send cryptocurrency update. Please try again later.');
      }
    } catch (error) {
      await bot.sendMessage(chatId, `Error: ${error.message}`);
    }
    return { status: 'Processed /fucked command' };
  }

  // Handle /crypto command
  const cryptoMatch = text.match(/^\/crypto (.+)$/);
  if (cryptoMatch) {
    const cryptoName = cryptoMatch[1].toLowerCase();
    try {
      const cryptoData = await cryptoService.fetchSingleCryptoPrice(cryptoName);
      const message = formatSingleCrypto(cryptoData, cryptoName);
      await bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
    } catch (error) {
      await bot.sendMessage(chatId, `Error: ${error.message}`);
    }
    return { status: 'Processed /crypto command' };
  }

  // Handle /trending command
  if (text.startsWith('/trending')) {
    try {
      const trendingCryptos = await cryptoService.getTrendingCryptos();
      const message = formatTrendingCryptos(trendingCryptos);
      await bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
    } catch (error) {
      await bot.sendMessage(chatId, `Error: ${error.message}`);
    }
    return { status: 'Processed /trending command' };
  }

  // Handle /help command
  if (text.startsWith('/help')) {
    const helpMessage = `
*Crypto Price Bot Commands*

/fucked - Trigger a cryptocurrency update to the channel
/crypto [name] - Get information about a specific cryptocurrency (e.g., /crypto bitcoin)
/trending - Show trending cryptocurrencies
/list - Show the list of tracked cryptocurrencies
/help - Show this help message
    `;
    
    await bot.sendMessage(chatId, helpMessage, { parse_mode: 'Markdown' });
    return { status: 'Processed /help command' };
  }

  // Handle /list command
  if (text.startsWith('/list')) {
    const listMessage = '*Tracked Cryptocurrencies*\n\n' + 
      cryptoList.map(crypto => {
        // Use the formatCryptoName function to get proper names
        const formattedName = require('../utils/messageFormatter').formatCryptoName(crypto);
        return `• ${formattedName}`;
      }).join('\n');
    
    await bot.sendMessage(chatId, listMessage, { parse_mode: 'Markdown' });
    return { status: 'Processed /list command' };
  }

  // Handle /start command
  if (text.startsWith('/start')) {
    const welcomeMessage = `
Welcome to the Crypto Price Bot! 🤖💰

This bot provides updates on cryptocurrency prices and market data.

Type /help to see available commands.
    `;
    
    await bot.sendMessage(chatId, welcomeMessage);
    return { status: 'Processed /start command' };
  }

  return { status: 'No command matched' };
}

// Webhook handler for Vercel
module.exports = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const update = req.body;
      await processUpdate(update);
      res.status(200).send('OK');
    } catch (error) {
      console.error('Error processing webhook:', error);
      res.status(500).send('Error processing webhook');
    }
  } else if (req.method === 'GET') {
    // Health check or verification endpoint
    res.status(200).send(`Crypto Price Bot Webhook is running. Set your webhook to: ${req.headers.host}/api/webhook`);
  } else {
    res.status(405).send('Method not allowed');
  }
}; 