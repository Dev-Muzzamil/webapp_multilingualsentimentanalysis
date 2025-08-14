const { Translate } = require('@google-cloud/translate').v2;

// Initialize the Google Cloud Translate client
const translate = new Translate();

async function translateText(text, targetLanguage = 'en', sourceLanguage = null) {
  try {
    // If no text provided, return original
    if (!text || !text.trim()) {
      return text;
    }

    // If already in target language, return original
    if (sourceLanguage === targetLanguage) {
      return text;
    }

    // Perform translation
    const options = {
      to: targetLanguage,
    };
    
    if (sourceLanguage) {
      options.from = sourceLanguage;
    }

    const [translation] = await translate.translate(text, options);
    
    return translation;
  } catch (error) {
    console.error('Translation error:', error);
    
    // Fallback: return original text if translation fails
    return text;
  }
}

async function detectLanguage(text) {
  try {
    if (!text || !text.trim()) {
      return 'en';
    }

    const [detection] = await translate.detect(text);
    return detection.language || 'en';
  } catch (error) {
    console.error('Language detection error:', error);
    return 'en';
  }
}

async function getSupportedLanguages() {
  try {
    const [languages] = await translate.getLanguages();
    return languages.map(lang => ({
      code: lang.code,
      name: lang.name
    }));
  } catch (error) {
    console.error('Error getting supported languages:', error);
    return [
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Spanish' },
      { code: 'fr', name: 'French' },
      { code: 'de', name: 'German' },
      { code: 'it', name: 'Italian' },
      { code: 'pt', name: 'Portuguese' },
      { code: 'ru', name: 'Russian' },
      { code: 'ja', name: 'Japanese' },
      { code: 'ko', name: 'Korean' },
      { code: 'zh', name: 'Chinese' },
      { code: 'ar', name: 'Arabic' },
      { code: 'hi', name: 'Hindi' }
    ];
  }
}

module.exports = { 
  translateText, 
  detectLanguage,
  getSupportedLanguages 
};