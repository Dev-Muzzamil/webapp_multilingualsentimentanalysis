require('dotenv').config();

const preprocessingService = require('./languagedetectionandpreprocessing/preprocessingService');
const languageDetectionService = require('./languagedetectionandpreprocessing/languageDetectionService');
const translationService = require('./translationService');
const sentimentService = require('./sentimentService');
const dbService = require('./core/dbService');
const { realTimeService } = require('./realtimeService');

/**
 * The main processing pipeline for sentiment analysis.
 * @param {object} data - The initial data object from the source.
 * @param {string} data.source - The data source (e.g., 'youtube', 'twitter').
 * @param {string} data.id - The unique ID from the source.
 * @param {string} data.timestamp - The UTC timestamp.
 * @param {string} data.text - The raw text content.
 * @returns {Promise<object>} The final processed result.
 */
async function process(data) {
  const pipelineData = {
    ...data,
    processing_timestamp: new Date().toISOString(),
  };

  try {
    // Step 1: Pre-LID (General Preprocessing)
    pipelineData.pre_lid_cleaned_text = preprocessingService.preLidCleanup(pipelineData.text);

    // Step 2: LID (Language Identification) - get all segments
    // Call the LID API directly for all segments
    const axios = require('axios');
  const LANGUAGE_API_URL = (typeof process !== 'undefined' && process.env && process.env.LANGUAGE_API_URL) ? process.env.LANGUAGE_API_URL : 'http://127.0.0.1:5001';
    let lidResponse;
    try {
      const res = await axios.post(`${LANGUAGE_API_URL}/detect_and_preprocess`, { text: pipelineData.pre_lid_cleaned_text }, { timeout: 5000 });
      lidResponse = res?.data?.languages || [];
    } catch (err) {
      console.error('LID API failed:', err.message);
      lidResponse = [];
    }

    pipelineData.lid_segments = lidResponse;

    // Step 3: Determine Dominant Language
    const languageCounts = lidResponse.reduce((acc, seg) => {
      const lang = seg.language || 'en';
      const length = seg.original_segment.length;
      acc[lang] = (acc[lang] || 0) + length;
      return acc;
    }, {});

    const dominantLanguage = Object.keys(languageCounts).reduce((a, b) => languageCounts[a] > languageCounts[b] ? a : b, 'en');

    // Step 4: Translate and Unify Text
    const unifiedSegments = [];
    for (const seg of lidResponse) {
      const segmentText = seg.cleaned_segment || seg.original_segment || '';
      const segmentLang = seg.language || 'en';

      if (segmentLang === dominantLanguage) {
        unifiedSegments.push(segmentText);
      } else {
        const translationResult = await translationService.translate(segmentText, segmentLang, dominantLanguage);
        unifiedSegments.push(translationResult.translated_text);
      }
    }

    const unifiedText = unifiedSegments.join(' ');
    pipelineData.unified_text = unifiedText;
    pipelineData.dominant_language = dominantLanguage;

    // Step 5: Post-Translation Cleanup
    const finalCleanedText = preprocessingService.postTranslationCleanup(unifiedText);
    pipelineData.final_cleaned_text = finalCleanedText;

    // Step 6: Final Sentiment Analysis
    const finalSentiment = await sentimentService.analyzeSentiment(finalCleanedText, dominantLanguage);
    pipelineData.sentiment_result = finalSentiment;


    // Step 7: Storage (Firebase)
    await dbService.savePipelineResult(pipelineData);

    // Step 8: Real-time Broadcast
    realTimeService.broadcast('pipeline_update', pipelineData);

    return pipelineData;

  } catch (error) {
    console.error(`[Pipeline Error] for ID ${pipelineData.id}:`, error);
    // Optionally, save error state to DB
    pipelineData.error = error.message;
    await dbService.saveErrorResult(pipelineData);
    throw error;
  }
}

module.exports = {
  process,
};
