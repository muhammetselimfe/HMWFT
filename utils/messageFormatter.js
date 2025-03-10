/**
 * Utility for formatting messages for Telegram
 */

/**
 * Format cryptocurrency data for display
 * @param {Object} cryptoData - Cryptocurrency data from API
 * @param {Array} cryptoList - List of cryptocurrency IDs to include
 * @returns {String} Formatted message
 */
function formatCryptoMessage(cryptoData, cryptoList) {
  if (!cryptoData) return 'Failed to fetch cryptocurrency data.';
  
  let message = '🚀 *Cryptocurrency Price Update* 🚀\n\n';
  
  for (const crypto of cryptoList) {
    if (cryptoData[crypto]) {
      const price = cryptoData[crypto].usd;
      const change24h = cryptoData[crypto].usd_24h_change;
      const marketCap = cryptoData[crypto].usd_market_cap;
      
      const changeEmoji = change24h >= 0 ? '🟢' : '🔴';
      const formattedChange = change24h ? change24h.toFixed(2) : 'N/A';
      const formattedMarketCap = marketCap ? formatMarketCap(marketCap) : 'N/A';
      
      message += `*${formatCryptoName(crypto)}*\n`;
      message += `💰 Price: $${formatPrice(price)}\n`;
      message += `${changeEmoji} 24h Change: ${formattedChange}%\n`;
      message += `📊 Market Cap: $${formattedMarketCap}\n\n`;
    }
  }
  
  return message;
}

/**
 * Format a single cryptocurrency for display
 * @param {Object} cryptoData - Cryptocurrency data from API
 * @param {String} cryptoId - Cryptocurrency ID
 * @returns {String} Formatted message
 */
function formatSingleCrypto(cryptoData, cryptoId) {
  if (!cryptoData || !cryptoData[cryptoId]) {
    return `Failed to fetch data for ${cryptoId}.`;
  }
  
  const price = cryptoData[cryptoId].usd;
  const change24h = cryptoData[cryptoId].usd_24h_change;
  const marketCap = cryptoData[cryptoId].usd_market_cap;
  
  const changeEmoji = change24h >= 0 ? '🟢' : '🔴';
  const formattedChange = change24h ? change24h.toFixed(2) : 'N/A';
  const formattedMarketCap = marketCap ? formatMarketCap(marketCap) : 'N/A';
  
  let message = `*${formatCryptoName(cryptoId)}*\n`;
  message += `💰 Price: $${formatPrice(price)}\n`;
  message += `${changeEmoji} 24h Change: ${formattedChange}%\n`;
  message += `📊 Market Cap: $${formattedMarketCap}`;
  
  return message;
}

/**
 * Format trending cryptocurrencies for display
 * @param {Array} trendingCryptos - List of trending cryptocurrencies
 * @returns {String} Formatted message
 */
function formatTrendingCryptos(trendingCryptos) {
  if (!trendingCryptos || trendingCryptos.length === 0) {
    return 'Failed to fetch trending cryptocurrencies.';
  }
  
  let message = '🔥 *Trending Cryptocurrencies* 🔥\n\n';
  
  trendingCryptos.forEach((crypto, index) => {
    message += `${index + 1}. *${crypto.name}* (${crypto.symbol})\n`;
    if (crypto.market_cap_rank) {
      message += `   Market Cap Rank: #${crypto.market_cap_rank}\n`;
    }
    message += '\n';
  });
  
  return message;
}

/**
 * Format cryptocurrency name for display
 * @param {String} cryptoId - Cryptocurrency ID
 * @returns {String} Formatted name
 */
function formatCryptoName(cryptoId) {
  // Special cases for certain cryptocurrencies
  const specialCases = {
    'binancecoin': 'Binance Coin',
    'avalanche-2': 'Avalanche',
    'matic-network': 'Polygon',
    'ethereum-classic': 'Ethereum Classic',
    'blub-2': 'Blub',
    'wink-3': 'Wink',
    'ket': 'Ket'
  };
  
  if (specialCases[cryptoId]) {
    return specialCases[cryptoId];
  }
  
  // Default formatting: capitalize first letter of each word
  return cryptoId
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Format price for display
 * @param {Number} price - Price value
 * @returns {String} Formatted price
 */
function formatPrice(price) {
  if (price >= 1000) {
    return price.toLocaleString();
  } else if (price >= 1) {
    return price.toFixed(2);
  } else {
    // For very small prices, show more decimal places
    return price.toFixed(6);
  }
}

/**
 * Format market cap for display
 * @param {Number} marketCap - Market cap value
 * @returns {String} Formatted market cap
 */
function formatMarketCap(marketCap) {
  if (marketCap >= 1000000000) {
    return (marketCap / 1000000000).toFixed(2) + 'B';
  } else if (marketCap >= 1000000) {
    return (marketCap / 1000000).toFixed(2) + 'M';
  } else if (marketCap >= 1000) {
    return (marketCap / 1000).toFixed(2) + 'K';
  } else {
    return marketCap.toString();
  }
}

module.exports = {
  formatCryptoMessage,
  formatSingleCrypto,
  formatTrendingCryptos
}; 