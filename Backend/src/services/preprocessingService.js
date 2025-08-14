// Enhanced text preprocessing for multilingual sentiment analysis
function preprocessText(text, options = {}) {
  if (!text || typeof text !== 'string') return '';
  
  let processedText = text;
  
  // Basic cleaning
  processedText = processedText.trim();
  
  // Remove URLs
  if (options.removeUrls !== false) {
    processedText = processedText.replace(/https?:\/\/[^\s]+/g, '');
  }
  
  // Handle mentions and hashtags
  if (options.preserveHashtags !== true) {
    processedText = processedText.replace(/#\w+/g, '');
  }
  if (options.preserveMentions !== true) {
    processedText = processedText.replace(/@\w+/g, '');
  }
  
  // Remove excessive whitespace
  processedText = processedText.replace(/\s+/g, ' ').trim();
  
  // Remove empty parentheses, brackets
  processedText = processedText.replace(/\(\s*\)|\[\s*\]|\{\s*\}/g, '');
  
  // Handle emojis - convert common ones to text or remove
  if (options.removeEmojis === true) {
    processedText = processedText.replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '');
  } else {
    // Convert some common emojis to sentiment indicators
    const emojiMap = {
      '😊': ' happy ',
      '😢': ' sad ',
      '😡': ' angry ',
      '😍': ' love ',
      '😂': ' laugh ',
      '👍': ' good ',
      '👎': ' bad ',
      '❤️': ' love '
    };
    
    for (const [emoji, text] of Object.entries(emojiMap)) {
      processedText = processedText.replace(new RegExp(emoji, 'g'), text);
    }
  }
  
  // Final cleanup
  processedText = processedText.replace(/\s+/g, ' ').trim();
  
  return processedText;
}

// Extract text from various data sources
function extractTextFromSource(data, sourceType) {
  switch (sourceType) {
    case 'youtube':
      return extractYouTubeText(data);
    case 'twitter':
      return extractTwitterText(data);
    case 'reddit':
      return extractRedditText(data);
    case 'twitch':
      return extractTwitchText(data);
    case 'discord':
      return extractDiscordText(data);
    default:
      return data.text || data.content || data.message || '';
  }
}

function extractYouTubeText(data) {
  // Extract from comments, descriptions, titles
  if (data.comments) {
    return data.comments.map(comment => comment.text || '').join(' ');
  }
  return data.title || data.description || '';
}

function extractTwitterText(data) {
  return data.full_text || data.text || '';
}

function extractRedditText(data) {
  return (data.title || '') + ' ' + (data.selftext || '');
}

function extractTwitchText(data) {
  return data.message || data.comment || '';
}

function extractDiscordText(data) {
  return data.content || data.message || '';
}

module.exports = { 
  preprocessText, 
  extractTextFromSource,
  extractYouTubeText,
  extractTwitterText,
  extractRedditText,
  extractTwitchText,
  extractDiscordText
};