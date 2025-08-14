const { detectLanguage } = require('../services/languageDetectionService');
const { translateText } = require('../services/translationService');
const { preprocessText } = require('../services/preprocessingService');
const { analyzeSentiment } = require('../services/sentimentService');
const { saveResult } = require('../services/dbService');

exports.analyze = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required.' });
    }

    // Step 1: Language Detection
    const language = await detectLanguage(text);

    // Log for debugging
    console.log(`Detected language: ${language}`);

    // Step 2: Translation (if not English)
    let processedText = text;
    let translation = null;
    if (language !== 'en') {
      translation = await translateText(text, 'en');
      processedText = translation;
    }

    // Step 3: Preprocessing
    const cleanText = preprocessText(processedText);

    // Step 4: Sentiment Analysis
    const sentiment = await analyzeSentiment(cleanText, language);

    // Step 5: Save to Firestore
    const result = {
      text,
      language,
      translation,
      sentiment,
    };
    await saveResult(result);

    // Step 6: Respond
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};