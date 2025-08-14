const { Translate } = require('@google-cloud/translate').v2;

// Initialize Google Cloud Translate
const translate = new Translate({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
});

async function translateText(text, targetLang = 'en') {
  if (!text || !text.trim()) return text;
  
  try {
    const [translation] = await translate.translate(text, targetLang);
    return translation;
  } catch (err) {
    console.error('Translation failed:', err.message);
    return text; // Return original text if translation fails
  }
}

async function detectLanguage(text) {
  if (!text || !text.trim()) return 'en';
  
  try {
    const [detection] = await translate.detect(text);
    return detection.language || 'en';
  } catch (err) {
    console.error('Language detection via Translate API failed:', err.message);
    return 'en';
  }
}

module.exports = { translateText, detectLanguage };