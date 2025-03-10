require('dotenv').config();
const axios = require('axios');

// Setup webhook endpoint
module.exports = async (req, res) => {
  try {
    // Get the bot token from environment variables
    const botToken = process.env.BOT_TOKEN;
    
    if (!botToken) {
      return res.status(500).json({ 
        error: true, 
        message: 'BOT_TOKEN environment variable is not set' 
      });
    }
    
    // Get the host from the request headers or use a provided URL
    const host = req.headers.host || req.query.url;
    
    if (!host) {
      return res.status(400).json({ 
        error: true, 
        message: 'Could not determine host. Please provide a URL parameter.' 
      });
    }
    
    // Construct the webhook URL
    const webhookUrl = `https://${host}/api/webhook`;
    
    // Set the webhook
    const response = await axios.get(
      `https://api.telegram.org/bot${botToken}/setWebhook`,
      {
        params: {
          url: webhookUrl,
          drop_pending_updates: true
        }
      }
    );
    
    if (response.data.ok) {
      return res.status(200).json({
        success: true,
        message: `Webhook set successfully to: ${webhookUrl}`,
        result: response.data
      });
    } else {
      return res.status(400).json({
        error: true,
        message: 'Failed to set webhook',
        result: response.data
      });
    }
  } catch (error) {
    console.error('Error setting webhook:', error);
    return res.status(500).json({
      error: true,
      message: `Error setting webhook: ${error.message}`
    });
  }
}; 