/**
 * Service for interacting with cryptocurrency APIs
 */

const axios = require('axios');
const { logError, handleApiError } = require('../utils/errorHandler');
const { API_CONFIG } = require('../config');

// CoinGecko API configuration
const CRYPTO_API_URL = API_CONFIG.CRYPTO_API_URL;
const DEFAULT_CURRENCY = API_CONFIG.DEFAULT_CURRENCY;

/**
 * Fetch prices for multiple cryptocurrencies
 * @param {Array} cryptoIds - Array of cryptocurrency IDs
 * @param {String} currency - Currency to convert to (default: from config)
 * @returns {Object} Cryptocurrency data
 */
async function fetchMultipleCryptoPrices(cryptoIds, currency = DEFAULT_CURRENCY) {
  try {
    const response = await axios.get(`${CRYPTO_API_URL}/simple/price`, {
      params: {
        ids: Array.isArray(cryptoIds) ? cryptoIds.join(',') : cryptoIds,
        vs_currencies: currency,
        include_24hr_change: true,
        include_market_cap: true
      }
    });
    
    return response.data;
  } catch (error) {
    logError('Fetching multiple crypto prices', error);
    throw new Error(handleApiError(error));
  }
}

/**
 * Fetch price for a single cryptocurrency
 * @param {String} cryptoId - Cryptocurrency ID
 * @param {String} currency - Currency to convert to (default: from config)
 * @returns {Object} Cryptocurrency data
 */
async function fetchSingleCryptoPrice(cryptoId, currency = DEFAULT_CURRENCY) {
  try {
    const response = await axios.get(`${CRYPTO_API_URL}/simple/price`, {
      params: {
        ids: cryptoId,
        vs_currencies: currency,
        include_24hr_change: true,
        include_market_cap: true
      }
    });
    
    return response.data;
  } catch (error) {
    logError(`Fetching price for ${cryptoId}`, error);
    throw new Error(handleApiError(error));
  }
}

/**
 * Get trending cryptocurrencies
 * @returns {Array} List of trending cryptocurrencies
 */
async function getTrendingCryptos() {
  try {
    const response = await axios.get(`${CRYPTO_API_URL}/search/trending`);
    return response.data.coins.map(item => ({
      id: item.item.id,
      name: item.item.name,
      symbol: item.item.symbol,
      market_cap_rank: item.item.market_cap_rank
    }));
  } catch (error) {
    logError('Fetching trending cryptos', error);
    throw new Error(handleApiError(error));
  }
}

module.exports = {
  fetchMultipleCryptoPrices,
  fetchSingleCryptoPrice,
  getTrendingCryptos
}; 