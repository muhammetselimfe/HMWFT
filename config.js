/**
 * Configuration for the Crypto Telegram Bot
 */

// Default cryptocurrency list to track
const DEFAULT_CRYPTO_LIST = [
  'bitcoin',
  'ethereum',
  'avalanche-2',
  'blub-2',
  'wink-3',
  'ket'
];

// API configuration
const API_CONFIG = {
  CRYPTO_API_URL: 'https://api.coingecko.com/api/v3',
  DEFAULT_CURRENCY: 'usd'
};

// Bot configuration
const BOT_CONFIG = {
  TOKEN: process.env.BOT_TOKEN,
  CHANNEL_ID: process.env.CHANNEL_ID
};

// Export configuration
module.exports = {
  DEFAULT_CRYPTO_LIST,
  API_CONFIG,
  BOT_CONFIG
}; 