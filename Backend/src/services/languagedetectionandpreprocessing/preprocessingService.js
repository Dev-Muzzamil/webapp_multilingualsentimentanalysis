/**
 * Pre-LID (Language Identification) Cleanup
 *
 * Cleans text in a source-agnostic way before language detection.
 * - Removes noise like URLs, excessive whitespace.
 * - Normalizes Unicode to NFC.
 * - Preserves semantic value by keeping mentions and hashtags.
 *
 * @param {string} text The raw input text.
 * @returns {string} The cleaned text.
 */
function preLidCleanup(text) {
  if (!text || typeof text !== 'string') return '';

  let processedText = text;

  // Basic Unicode normalization
  processedText = processedText.normalize('NFC');

  // Remove URLs
  processedText = processedText.replace(/https?:\/\/[^\s]+/g, '');

  // Remove emails and phone numbers (basic)
  processedText = processedText.replace(/\S+@\S+\.\S+/g, '');
  processedText = processedText.replace(/(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g, '');


  // Remove control characters, but keep tabs and newlines
  processedText = processedText.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // Replace multiple whitespace characters with a single space
  processedText = processedText.replace(/\s+/g, ' ').trim();

  return processedText;
}

/**
 * Post-LID (Language Identification) Cleanup
 *
 * Cleans the text based on the detected language.
 * This is a placeholder for language-specific logic like stopword removal.
 *
 * @param {string} text The text after pre-LID cleanup.
 * @param {string} language The detected language code (e.g., 'en', 'hi').
 * @returns {string} The language-specifically cleaned text.
 */
function postLidCleanup(text, language) {
  if (!text || typeof text !== 'string') return '';

  // TODO: Implement language-specific stopword removal based on the 'language' parameter.
  // For example:
  // if (language === 'en') {
  //   text = removeEnglishStopwords(text);
  // } else if (language === 'es') {
  //   text = removeSpanishStopwords(text);
  // }

  return text;
}

/**
 * Post-Translation Cleanup
 *
 * Performs final polishing on the text before sentiment analysis.
 * - Normalizes spacing and punctuation.
 * - Converts common emojis to text to preserve sentiment.
 *
 * @param {string} text The translated text.
 * @returns {string} The final cleaned text.
 */
function postTranslationCleanup(text) {
  if (!text || typeof text !== 'string') return '';

  let processedText = text;

  // Map common emojis to text to retain sentiment
  const emojiMap = {
      '😊': ' happy ', '🙂': ' smile ',
      '😢': ' sad ', '😭': ' crying ',
      '😡': ' angry ', '😠': ' annoyed ',
      '😍': ' love ', '❤️': ' love ',
      '😂': ' laughing hard ', '🤣': ' laughing hard ',
      '👍': ' good ', '👌': ' okay ',
      '👎': ' bad ',
      '🤔': ' thinking ',
      '🙏': ' thankful ',
  };

  for (const [emoji, replacement] of Object.entries(emojiMap)) {
    processedText = processedText.replace(new RegExp(emoji, 'g'), replacement);
  }

  // Remove any remaining un-mapped emojis if needed (optional, depends on model)
  // processedText = processedText.replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '');


  // Final whitespace cleanup
  processedText = processedText.replace(/\s+/g, ' ').trim();

  return processedText;
}

module.exports = {
  preLidCleanup,
  postLidCleanup,
  postTranslationCleanup,
};