require('dotenv').config();

const axios = require('axios');

const LANGUAGE_API_URL = process.env.LANGUAGE_API_URL || 'http://127.0.0.1:5001';

/**
 * Detects language and returns the most relevant language and cleaned segment using the LID service.
 * @param {string} text
 * @returns {Promise<{language: string, confidence: number, cleaned_segment: string}>}
 */
async function detectLanguage(text) {
  if (!text || !text.trim()) {
    return { language: 'en', confidence: 1, cleaned_segment: text };
  }
  try {
    const res = await axios.post(`${LANGUAGE_API_URL}/detect_and_preprocess`, { text }, { timeout: 5000 });
    const languages = res?.data?.languages;
    if (Array.isArray(languages) && languages.length > 0) {
      // Pick the segment with the longest cleaned_segment
      let best = languages[0];
      for (const langObj of languages) {
        if ((langObj.cleaned_segment?.length || 0) > (best.cleaned_segment?.length || 0)) {
          best = langObj;
        }
      }
      return {
        language: best.language || 'en',
        confidence: 1, // The Python API does not return confidence, so default to 1
        cleaned_segment: best.cleaned_segment || ''
      };
    } else {
      return { language: 'en', confidence: 1, cleaned_segment: text };
    }
  } catch (err) {
    console.error('Language detection failed:', err.message);
    return { language: 'en', confidence: 1, cleaned_segment: text };
  }
}

module.exports = { detectLanguage };