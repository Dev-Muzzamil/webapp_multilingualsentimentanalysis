
const axios = require('axios');
const AZURE_TRANSLATOR_KEY = process.env.AZURE_TRANSLATOR_KEY;
const AZURE_TRANSLATOR_ENDPOINT = process.env.AZURE_TRANSLATOR_ENDPOINT;

/**
 * Translates text to a specified target language.
 *
 * @param {string} text The text to process.
 * @param {string} sourceLanguage The detected language of the text.
 * @param {string} targetLanguage The target language for translation.
 * @returns {Promise<object>} An object containing the processed text and translation details.
 */

async function translate(text, sourceLanguage, targetLanguage = 'en') {
  if (!text || !text.trim()) {
    return {
      translated_text: '',
      target_language: sourceLanguage,
      was_translated: false,
    };
  }

  if (sourceLanguage === targetLanguage) {
    return {
      translated_text: text,
      target_language: sourceLanguage,
      was_translated: false,
    };
  }

  try {
    const url = `${AZURE_TRANSLATOR_ENDPOINT}/translate?api-version=3.0&from=${sourceLanguage}&to=${targetLanguage}`;
    const headers = {
      'Ocp-Apim-Subscription-Key': AZURE_TRANSLATOR_KEY,
      'Content-Type': 'application/json',
      // If using a regional resource, add 'Ocp-Apim-Subscription-Region': 'your-region',
    };
    const body = [ { Text: text } ];
    const response = await axios.post(url, body, { headers });
    const translation = response.data[0]?.translations[0]?.text || text;
    return {
      translated_text: translation,
      target_language: targetLanguage,
      was_translated: true,
      original_language: sourceLanguage,
    };
  } catch (err) {
    console.error(`Translation from '${sourceLanguage}' to '${targetLanguage}' failed:`, err.message);
    // Return original text as a fallback
    return {
      translated_text: text,
      target_language: sourceLanguage,
      was_translated: false,
      error: 'Translation failed',
    };
  }
}

module.exports = {
  translate
};