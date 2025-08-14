// Comprehensive text preprocessing service
function preprocessText(text, options = {}) {
  if (!text || typeof text !== 'string') {
    return '';
  }

  let processedText = text;

  // Default preprocessing options
  const defaultOptions = {
    lowercase: true,
    removeUrls: true,
    removeEmails: true,
    removeMentions: false, // Keep @ mentions for social media context
    removeHashtags: false, // Keep hashtags for social media context
    removeExtraWhitespace: true,
    removeEmojis: false, // Keep emojis as they can indicate sentiment
    removePunctuation: false, // Keep some punctuation for context
    removeNumbers: false,
    removeStopwords: false // We'll handle this in language-specific way
  };

  const config = { ...defaultOptions, ...options };

  // Remove URLs
  if (config.removeUrls) {
    processedText = processedText.replace(/https?:\/\/[^\s]+/g, '');
    processedText = processedText.replace(/www\.[^\s]+/g, '');
  }

  // Remove email addresses
  if (config.removeEmails) {
    processedText = processedText.replace(/\S+@\S+\.\S+/g, '');
  }

  // Remove mentions (but preserve for social media analysis)
  if (config.removeMentions) {
    processedText = processedText.replace(/@\w+/g, '');
  }

  // Remove hashtags (but preserve for social media analysis)
  if (config.removeHashtags) {
    processedText = processedText.replace(/#\w+/g, '');
  }

  // Remove emojis (but preserve for sentiment analysis)
  if (config.removeEmojis) {
    processedText = processedText.replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '');
  }

  // Convert to lowercase
  if (config.lowercase) {
    processedText = processedText.toLowerCase();
  }

  // Remove excessive punctuation but keep some for context
  if (config.removePunctuation) {
    processedText = processedText.replace(/[^\w\s@#]/g, ' ');
  } else {
    // Just clean up excessive punctuation
    processedText = processedText.replace(/[.]{2,}/g, '.');
    processedText = processedText.replace(/[!]{2,}/g, '!');
    processedText = processedText.replace(/[?]{2,}/g, '?');
  }

  // Remove numbers (but keep for context in many cases)
  if (config.removeNumbers) {
    processedText = processedText.replace(/\d+/g, '');
  }

  // Remove extra whitespace
  if (config.removeExtraWhitespace) {
    processedText = processedText.replace(/\s+/g, ' ').trim();
  }

  return processedText;
}

// Language-specific preprocessing
function preprocessTextByLanguage(text, language, options = {}) {
  let processedText = preprocessText(text, options);

  // Language-specific cleaning
  switch (language) {
    case 'en':
      // English-specific preprocessing
      processedText = processedText.replace(/\b(rt|via)\b/gi, ''); // Remove retweet indicators
      break;
    case 'es':
      // Spanish-specific preprocessing
      processedText = processedText.replace(/\b(rt|vía)\b/gi, '');
      break;
    case 'fr':
      // French-specific preprocessing
      processedText = processedText.replace(/\b(rt|via)\b/gi, '');
      break;
    case 'de':
      // German-specific preprocessing
      processedText = processedText.replace(/\b(rt|über)\b/gi, '');
      break;
    default:
      // Default processing
      break;
  }

  return processedText.trim();
}

// Clean text for social media platforms
function preprocessSocialMedia(text, platform = 'general') {
  let processedText = text;

  switch (platform.toLowerCase()) {
    case 'twitter':
      // Twitter-specific cleaning
      processedText = preprocessText(text, {
        removeUrls: true,
        removeEmails: true,
        removeMentions: false, // Keep for context
        removeHashtags: false, // Keep for context
        removeEmojis: false,
        lowercase: true
      });
      // Remove "RT @username:" pattern
      processedText = processedText.replace(/^rt\s+@\w+:?\s*/i, '');
      break;

    case 'youtube':
      // YouTube comment specific cleaning
      processedText = preprocessText(text, {
        removeUrls: true,
        removeEmails: true,
        removeMentions: false,
        removeHashtags: false,
        removeEmojis: false,
        lowercase: true
      });
      // Remove timestamp references
      processedText = processedText.replace(/\b\d{1,2}:\d{2}(?::\d{2})?\b/g, '');
      break;

    case 'discord':
      // Discord message specific cleaning
      processedText = preprocessText(text, {
        removeUrls: true,
        removeEmails: true,
        removeMentions: false, // Keep for context
        removeHashtags: false,
        removeEmojis: false,
        lowercase: true
      });
      // Remove Discord-specific formatting
      processedText = processedText.replace(/[*_~`]/g, '');
      break;

    case 'twitch':
      // Twitch chat specific cleaning
      processedText = preprocessText(text, {
        removeUrls: true,
        removeEmails: true,
        removeMentions: false,
        removeHashtags: false,
        removeEmojis: false,
        lowercase: true
      });
      // Remove common Twitch emotes (basic ones)
      processedText = processedText.replace(/\b(kappa|pogchamp|4head|lul|pepehands|sadge|monkas)\b/gi, '');
      break;

    default:
      processedText = preprocessText(text);
      break;
  }

  return processedText;
}

// Extract meaningful features from text
function extractFeatures(text) {
  const features = {
    length: text.length,
    wordCount: text.split(/\s+/).filter(word => word.length > 0).length,
    avgWordLength: 0,
    exclamationCount: (text.match(/!/g) || []).length,
    questionCount: (text.match(/\?/g) || []).length,
    capitalCount: (text.match(/[A-Z]/g) || []).length,
    mentionCount: (text.match(/@\w+/g) || []).length,
    hashtagCount: (text.match(/#\w+/g) || []).length,
    urlCount: (text.match(/https?:\/\/[^\s]+/g) || []).length,
    emojiCount: (text.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu) || []).length
  };

  if (features.wordCount > 0) {
    const words = text.split(/\s+/).filter(word => word.length > 0);
    features.avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
  }

  return features;
}

module.exports = { 
  preprocessText, 
  preprocessTextByLanguage,
  preprocessSocialMedia,
  extractFeatures
};