"""
Pre-language-detection processing: Remove emails, URLs, mentions, hashtags, and obvious noise.
Enhanced version with more comprehensive social media noise removal.
"""
import re
import unicodedata


# Core patterns (improved)
EMAIL_PATTERN = re.compile(r"\b[\w\.-]+@[\w\.-]+\.[a-zA-Z]{2,}(?=\b|\s|$|[.,!?;:])", re.IGNORECASE)
URL_PATTERN = re.compile(r"(?:https?://|www\.|ftp://)\S+|(?:\w+\.)+(?:com|org|net|edu|gov|mil|co|io|ai|in|uk|us|info|biz|me|tv|ca|de|fr|jp|ru|cn|br|au|es|it|nl|se|no|fi|pl|ch|be|at|dk|tr|ir|gr|cz|pt|hu|il|za|mx|kr|sg|hk|tw|vn|id|my|ph|th|sa|ae|nz|cl|ar|ro|sk|bg|lt|lv|ee|hr|si|rs|ua|by|kz|ge|az|md|lu|li|is|mc|sm|ad|fo|gl|gi|je|gg|im|eu)(?:/\S*)?", re.IGNORECASE)

# Social media specific patterns
MENTION_PATTERN = re.compile(r"@[\w_]+")
HASHTAG_PATTERN = re.compile(r"#[\w_]+")
CASHTAG_PATTERN = re.compile(r"\$[A-Z]{1,5}\b")  # Stock symbols like $AAPL
RT_PATTERN = re.compile(r"\bRT\b:?\s*", re.IGNORECASE)  # Retweet indicators

# Numeric and contact patterns
PHONE_PATTERN = re.compile(r"(?:\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}")
IP_PATTERN = re.compile(r"\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b")
CREDIT_CARD_PATTERN = re.compile(r"\b(?:\d{4}[-\s]?){3}\d{4}\b")
STANDALONE_NUMBERS = re.compile(r"\b\d{5,}\b")  # Long standalone numbers

# Text normalization patterns
REPEATED_CHARS = re.compile(r"(.)\1{2,}")  # 3+ repeated characters
EXCESSIVE_PUNCT = re.compile(r"[!?.,;:]{2,}")  # Multiple punctuation
EMOJI_PATTERN = re.compile(r"[\U0001F600-\U0001F64F\U0001F300-\U0001F5FF\U0001F680-\U0001F6FF\U0001F1E0-\U0001F1FF\U00002700-\U000027BF\U0001F900-\U0001F9FF\U0001F018-\U0001F270]+")

# HTML and encoding patterns
HTML_ENTITIES = re.compile(r"&[a-zA-Z][a-zA-Z0-9]*;|&#[0-9]+;|&#x[0-9a-fA-F]+;")
HTML_TAGS = re.compile(r"<[^>]+>")

# Whitespace patterns (enhanced)
WHITESPACE_PATTERN = re.compile(r'\s+')
UNICODE_WHITESPACE = re.compile(r'[\u00A0\u1680\u2000-\u200B\u2028\u2029\u202F\u205F\u3000\uFEFF]+')

# File extensions and paths
FILE_EXTENSIONS = re.compile(r"\S+\.[a-zA-Z0-9]{2,4}(?=\s|$)")

# Cryptocurrency addresses (basic patterns)
CRYPTO_PATTERN = re.compile(r"\b(?:bc1|[13])[a-zA-HJ-NP-Z0-9]{25,62}\b|\b0x[a-fA-F0-9]{40}\b")


def normalize_repeated_chars(text, max_repeats=2):
    """Normalize repeated characters (e.g., 'sooooo' -> 'soo')"""
    def replace_repeated(match):
        char = match.group(1)
        return char * min(len(match.group(0)), max_repeats)
    
    return REPEATED_CHARS.sub(replace_repeated, text)


def normalize_unicode(text):
    """Normalize Unicode characters to their closest ASCII equivalents where possible"""
    # Normalize to NFKD form and remove diacritics
    normalized = unicodedata.normalize('NFKD', text)
    # Keep only ASCII characters and common punctuation
    ascii_text = ''.join(c for c in normalized if ord(c) < 128 or c in '""''—–')
    return ascii_text


def remove_excessive_punctuation(text):
    """Replace excessive punctuation with single instances"""
    return EXCESSIVE_PUNCT.sub(lambda m: m.group(0)[0], text)


def prelangid_clean(text, 
                   remove_emojis=True, 
                   normalize_unicode_chars=True,
                   normalize_repeated=True,
                   remove_phone_numbers=True,
                   remove_crypto=True,
                   preserve_mention_text=False,
                   preserve_hashtag_text=False):
    """
    Enhanced text cleaning for social media content before language detection.
    
    Args:
        text (str): Input text to clean
        remove_emojis (bool): Whether to remove emoji characters
        normalize_unicode_chars (bool): Whether to normalize Unicode to ASCII
        normalize_repeated (bool): Whether to normalize repeated characters
        remove_phone_numbers (bool): Whether to remove phone numbers
        remove_crypto (bool): Whether to remove cryptocurrency addresses
        preserve_mention_text (bool): If True, keep text of mentions without @
        preserve_hashtag_text (bool): If True, keep text of hashtags without #
    
    Returns:
        str: Cleaned text
    """
    if not text or not isinstance(text, str):
        return ""
    
    # Remove HTML tags and entities first
    text = HTML_TAGS.sub(" ", text)
    text = HTML_ENTITIES.sub(" ", text)
    
    # Remove URLs and domains
    text = URL_PATTERN.sub(" ", text)
    
    # Remove contact information
    text = EMAIL_PATTERN.sub(" ", text)
    if remove_phone_numbers:
        text = PHONE_PATTERN.sub(" ", text)
    
    # Remove financial patterns
    text = CREDIT_CARD_PATTERN.sub(" ", text)
    text = CASHTAG_PATTERN.sub(" ", text)
    if remove_crypto:
        text = CRYPTO_PATTERN.sub(" ", text)
    
    # Handle social media patterns
    text = RT_PATTERN.sub(" ", text)
    
    if preserve_mention_text:
        text = MENTION_PATTERN.sub(lambda m: m.group(0)[1:], text)  # Remove @ but keep text
    else:
        text = MENTION_PATTERN.sub(" ", text)
        
    if preserve_hashtag_text:
        text = HASHTAG_PATTERN.sub(lambda m: m.group(0)[1:], text)  # Remove # but keep text
    else:
        text = HASHTAG_PATTERN.sub(" ", text)
    
    # Remove technical patterns
    text = IP_PATTERN.sub(" ", text)
    text = FILE_EXTENSIONS.sub(" ", text)
    text = STANDALONE_NUMBERS.sub(" ", text)
    
    # Remove or normalize special characters
    if remove_emojis:
        text = EMOJI_PATTERN.sub(" ", text)
    
    # Normalize text patterns
    if normalize_repeated:
        text = normalize_repeated_chars(text)
    
    text = remove_excessive_punctuation(text)
    
    # Normalize whitespace (including Unicode whitespace)
    text = UNICODE_WHITESPACE.sub(" ", text)
    text = WHITESPACE_PATTERN.sub(" ", text)
    
    # Unicode normalization (should be done after other cleaning)
    if normalize_unicode_chars:
        text = normalize_unicode(text)
    
    # Final cleanup
    text = text.strip()
    
    # Remove any remaining control characters
    text = ''.join(char for char in text if ord(char) >= 32 or char in '\n\t')
    
    return text


def prelangid_clean_batch(texts, **kwargs):
    """
    Clean a batch of texts with the same parameters.
    
    Args:
        texts (list): List of texts to clean
        **kwargs: Arguments to pass to prelangid_clean
    
    Returns:
        list: List of cleaned texts
    """
    return [prelangid_clean(text, **kwargs) for text in texts]


# Backward compatibility - simple function with default behavior
def simple_clean(text):
    """Simple cleaning function for backward compatibility"""
    return prelangid_clean(text, 
                          remove_emojis=True,
                          normalize_unicode_chars=False,
                          normalize_repeated=True,
                          preserve_mention_text=False,
                          preserve_hashtag_text=False)


if __name__ == "__main__":
    print("[DEBUG] Entered __main__ test block")
    # Test examples
    test_texts = [
        "RT @user: Check out this amazing website! https://example.com #awesome #AI 🚀🔥",
        "Contact me at john.doe@email.com or call (555) 123-4567!!!",
        "Sooooo excited about this new feature!!! Can't wait to try it out...",
        "投資 $AAPL stock now! Visit www.trading.com for more info",
        "HTML content: <div>Hello &amp; welcome!</div>",
        "Crypto address: bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
    ]
    print("Original vs Cleaned texts:")
    print("=" * 50)
    print("[DEBUG] Starting test loop")
    for text in test_texts:
        print("[DEBUG] Cleaning text:", text)
        cleaned = prelangid_clean(text)
        print(f"Original: {text}")
        print(f"Cleaned:  {cleaned}")
        print("-" * 30)
    print("[DEBUG] Finished test loop")
