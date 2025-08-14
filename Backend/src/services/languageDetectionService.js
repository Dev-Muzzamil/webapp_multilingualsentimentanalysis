const axios = require('axios');

const LANGUAGE_API_URL = process.env.LANGUAGE_API_URL || 'http://127.0.0.1:5001';

async function detectLanguage(text) {
  if (!text || !text.trim()) return 'en';
  try {
    const res = await axios.post(`${LANGUAGE_API_URL}/detect`, { text }, { timeout: 5000 });
    const lang = res?.data?.language;
    return lang || 'en';
  } catch (err) {
    console.error('Language detection failed:', err.message);
    return 'en'; // fallback
  }
}

module.exports = { detectLanguage };