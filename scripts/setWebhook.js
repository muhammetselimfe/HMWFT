require('dotenv').config();
const axios = require('axios');

// Get the Vercel deployment URL from command line argument or environment variable
const deploymentUrl = process.argv[2] || process.env.VERCEL_URL;
const botToken = process.env.BOT_TOKEN;

if (!deploymentUrl) {
  console.error('Please provide a deployment URL as an argument or set VERCEL_URL environment variable');
  process.exit(1);
}

if (!botToken) {
  console.error('BOT_TOKEN environment variable is not set');
  process.exit(1);
}

const webhookUrl = `https://${deploymentUrl}/api/webhook`;

// Set the webhook
async function setWebhook() {
  try {
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
      console.log(`Webhook set successfully to: ${webhookUrl}`);
    } else {
      console.error('Failed to set webhook:', response.data.description);
    }
  } catch (error) {
    console.error('Error setting webhook:', error.message);
  }
}

setWebhook(); 