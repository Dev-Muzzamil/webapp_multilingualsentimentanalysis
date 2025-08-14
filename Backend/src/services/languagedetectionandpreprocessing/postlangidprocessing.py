"""
Post-language-detection processing: Language-specific tokenization, lemmatization, 
stemming, stopword removal, etc.
"""

import re
import unicodedata
import os
import string

# Optional imports with fallbacks
try:
    from stopwords import get_stopwords
except ImportError:
    get_stopwords = None

try:
    from spellchecker import SpellChecker
except ImportError:
    SpellChecker = None

try:
    import spacy
    # Try to load spacy models with fallbacks
    spacy_models = {}
    model_mapping = {
        'en': 'en_core_web_sm',
        'es': 'es_core_news_sm', 
        'fr': 'fr_core_news_sm',
        'de': 'de_core_news_sm',
        'it': 'it_core_news_sm',
        'pt': 'pt_core_news_sm'
    }
    
    for lang, model_name in model_mapping.items():
        try:
            spacy_models[lang] = spacy.load(model_name)
        except OSError:
            print(f"[WARNING] SpaCy model {model_name} not found for {lang}")
            spacy_models[lang] = None
            
except ImportError:
    spacy = None
    spacy_models = {}

try:
    import snowballstemmer
except ImportError:
    snowballstemmer = None

try:
    import jieba
except ImportError:
    jieba = None

try:
    import MeCab
except ImportError:
    MeCab = None

try:
    from konlpy.tag import Okt
except ImportError:
    Okt = None


def load_txt_stopwords(filepath):
    """Load stopwords from text file"""
    try:
        with open(filepath, encoding='utf-8') as f:
            return set(line.strip() for line in f if line.strip())
    except Exception:
        return set()


# Load custom stopwords
try:
    # Try to use __file__ if available
    STOPWORDS_PATH = os.path.join(os.path.dirname(__file__), 'stopwords')
except NameError:
    # Fallback when __file__ is not available - use relative path
    STOPWORDS_PATH = os.path.join(os.path.dirname(os.path.abspath('.')), 'src', 'services', 'languagedetectionandpreprocessing', 'stopwords')

try:
    bn_stopwords = load_txt_stopwords(os.path.join(STOPWORDS_PATH, 'stopwords-bn.txt'))
    vi_stopwords = load_txt_stopwords(os.path.join(STOPWORDS_PATH, 'stopwords-vi.txt'))
except Exception as e:
    print(f"[WARNING] Could not load custom stopwords: {e}")
    bn_stopwords = set()
    vi_stopwords = set()

# Spell check language mapping
SPELLCHECK_LANGS = {
    'en': 'en', 'fr': 'fr', 'de': 'de', 'es': 'es', 'it': 'it', 'pt': 'pt',
    'ru': 'ru', 'pl': 'pl', 'nl': 'nl', 'tr': 'tr', 'id': 'id'
}

# Common noise tokens
NOISE_TOKENS = set([
    'na', 'naa', 'an', 'la', 'ha', 'ba', 'da', 'pa', 'ma', 'ka', 'ra', 'ya', 
    'ga', 'sa', 'ta', 'fa', 'za', 'wa', 'xa', 'yo', 'ho', 'no', 'lo', 'do', 
    'go', 'jo', 'ko', 'mo', 'po', 'ro', 'so', 'to', 'vo', 'wo', 'zo', 'uh', 
    'um', 'hmm', 'huh', 'eh', 'ah', 'oh', 'oo', 'mm', 'oooh', 'aa', 'aaa', 
    'ooo', 'eee', 'iii', 'uuu', 'nnn', 'zzz', '...', 'bro', 'sis', 'lol', 
    'omg', 'wtf', 'lmao', 'rofl', 'xd', 'haha', 'hehe', 'hihi', 'huhu', 
    'hahaha', 'hehehe', 'hihihi', 'huhuhu', 'lalala', 'nanana', 'nananana', 
    'blabla', 'blablabla', 'test', 'testing', 'foo', 'bar', 'baz', 'qux', 
    'quux', 'corge', 'grault', 'garply', 'waldo', 'fred', 'plugh', 'xyzzy', 'thud'
])


def filter_noise(tokens):
    """Remove noise tokens"""
    return [w for w in tokens if w.lower() not in NOISE_TOKENS]


def spell_check(text, lang_code):
    """Apply spell checking if available"""
    if SpellChecker and lang_code in SPELLCHECK_LANGS:
        try:
            spell = SpellChecker(language=SPELLCHECK_LANGS[lang_code])
            return ' '.join([
                str(spell.correction(w)) if w not in spell else str(w) 
                for w in text.split()
            ])
        except Exception:
            pass
    return text


def get_stopwords_for_lang(lang):
    """Get stopwords for a specific language"""
    if get_stopwords:
        try:
            return get_stopwords(lang)
        except Exception:
            pass
    return set()


# --- Language-specific preprocessors ---

def preprocess_en(text):
    """English preprocessing"""
    text = text.lower()
    
    if spacy_models.get('en'):
        try:
            nlp = spacy_models['en']
            doc = nlp(text)
            tokens = [token.lemma_ for token in doc if not token.is_punct and not token.is_space]
        except Exception:
            tokens = text.split()
    else:
        tokens = text.split()
    
    # Remove stopwords
    sw = get_stopwords_for_lang('en')
    if sw:
        tokens = [w for w in tokens if w not in sw]
    
    tokens = filter_noise(tokens)
    tokens = [spell_check(w, 'en') for w in tokens]
    tokens = [w for w in tokens if len(w) >= 3 and len(w) <= 20]
    
    return ' '.join(tokens)


def preprocess_fr(text):
    """French preprocessing"""
    text = text.lower()
    
    if spacy_models.get('fr'):
        try:
            nlp = spacy_models['fr']
            doc = nlp(text)
            tokens = [token.lemma_ for token in doc if not token.is_punct and not token.is_space]
        except Exception:
            tokens = text.split()
    else:
        tokens = text.split()
    
    sw = get_stopwords_for_lang('fr')
    if sw:
        tokens = [w for w in tokens if w not in sw]
    
    tokens = filter_noise(tokens)
    tokens = [spell_check(w, 'fr') for w in tokens]
    tokens = [w for w in tokens if len(w) >= 3 and len(w) <= 20]
    
    return ' '.join(tokens)


def preprocess_de(text):
    """German preprocessing"""
    text = text.lower()
    
    if spacy_models.get('de'):
        try:
            nlp = spacy_models['de']
            doc = nlp(text)
            tokens = [token.lemma_ for token in doc if not token.is_punct and not token.is_space]
        except Exception:
            tokens = text.split()
    else:
        tokens = text.split()
    
    sw = get_stopwords_for_lang('de')
    if sw:
        tokens = [w for w in tokens if w not in sw]
    
    tokens = filter_noise(tokens)
    tokens = [spell_check(w, 'de') for w in tokens]
    tokens = [w for w in tokens if len(w) >= 3 and len(w) <= 20]
    
    return ' '.join(tokens)


def preprocess_es(text):
    """Spanish preprocessing"""
    text = text.lower()
    
    if spacy_models.get('es'):
        try:
            nlp = spacy_models['es']
            doc = nlp(text)
            tokens = [token.lemma_ for token in doc if not token.is_punct and not token.is_space]
        except Exception:
            tokens = text.split()
    else:
        tokens = text.split()
    
    sw = get_stopwords_for_lang('es')
    if sw:
        tokens = [w for w in tokens if w not in sw]
    
    tokens = filter_noise(tokens)
    tokens = [spell_check(w, 'es') for w in tokens]
    tokens = [w for w in tokens if len(w) >= 3 and len(w) <= 20]
    
    return ' '.join(tokens)


def preprocess_it(text):
    """Italian preprocessing"""
    text = text.lower()
    
    if spacy_models.get('it'):
        try:
            nlp = spacy_models['it']
            doc = nlp(text)
            tokens = [token.lemma_ for token in doc if not token.is_punct and not token.is_space]
        except Exception:
            tokens = text.split()
    else:
        tokens = text.split()
    
    sw = get_stopwords_for_lang('it')
    if sw:
        tokens = [w for w in tokens if w not in sw]
    
    tokens = filter_noise(tokens)
    tokens = [spell_check(w, 'it') for w in tokens]
    tokens = [w for w in tokens if len(w) >= 3 and len(w) <= 20]
    
    return ' '.join(tokens)


def preprocess_pt(text):
    """Portuguese preprocessing"""
    text = text.lower()
    
    if spacy_models.get('pt'):
        try:
            nlp = spacy_models['pt']
            doc = nlp(text)
            tokens = [token.lemma_ for token in doc if not token.is_punct and not token.is_space]
        except Exception:
            tokens = text.split()
    else:
        tokens = text.split()
    
    sw = get_stopwords_for_lang('pt')
    if sw:
        tokens = [w for w in tokens if w not in sw]
    
    tokens = filter_noise(tokens)
    tokens = [spell_check(w, 'pt') for w in tokens]
    tokens = [w for w in tokens if len(w) >= 3 and len(w) <= 20]
    
    return ' '.join(tokens)


def preprocess_ru(text):
    """Russian preprocessing with stemming"""
    text = text.lower()
    
    if snowballstemmer:
        try:
            stemmer = snowballstemmer.stemmer('russian')
            tokens = [stemmer.stemWord(w) for w in text.split()]
        except Exception:
            tokens = text.split()
    else:
        tokens = text.split()
    
    sw = get_stopwords_for_lang('ru')
    if sw:
        tokens = [w for w in tokens if w not in sw]
    
    tokens = filter_noise(tokens)
    tokens = [spell_check(w, 'ru') for w in tokens]
    tokens = [w for w in tokens if len(w) >= 3 and len(w) <= 20]
    
    return ' '.join(tokens)


def preprocess_zh(text):
    """Chinese preprocessing"""
    if jieba:
        try:
            tokens = list(jieba.cut(text))
        except Exception:
            tokens = list(text)
    else:
        # Fallback: split by character for Chinese
        tokens = list(text)
    
    tokens = [w for w in tokens if w.strip()]
    tokens = [w for w in tokens if len(w) > 1]
    tokens = [w for w in tokens if len(w) >= 1 and len(w) <= 20]  # Chinese chars are shorter
    
    return ' '.join(tokens)


def preprocess_ja(text):
    """Japanese preprocessing"""
    if MeCab:
        try:
            tagger = MeCab.Tagger()
            parsed = tagger.parse(text)
            tokens = [line.split('\t')[0] for line in parsed.split('\n') if '\t' in line]
        except Exception:
            tokens = list(text)
    else:
        tokens = list(text)
    
    tokens = [w for w in tokens if w.strip()]
    tokens = [w for w in tokens if len(w) >= 1 and len(w) <= 20]
    
    return ' '.join(tokens)


def preprocess_ko(text):
    """Korean preprocessing"""
    if Okt:
        try:
            okt = Okt()
            tokens = okt.morphs(text)
        except Exception:
            tokens = list(text)
    else:
        tokens = list(text)
    
    tokens = [w for w in tokens if w.strip()]
    tokens = [w for w in tokens if len(w) >= 1 and len(w) <= 20]
    
    return ' '.join(tokens)


def preprocess_ar(text):
    """Arabic preprocessing"""
    # Keep Arabic Unicode range
    text = re.sub(r'[^\u0600-\u06FF\s]', '', text)
    tokens = text.split()
    tokens = [w for w in tokens if len(w) >= 2 and len(w) <= 20]
    
    return ' '.join(tokens)


def preprocess_hi(text):
    """Hindi preprocessing"""
    # Keep Devanagari Unicode range
    text = re.sub(r'[^\u0900-\u097F\s]', '', text)
    tokens = text.split()
    tokens = [w for w in tokens if len(w) >= 2 and len(w) <= 20]
    
    return ' '.join(tokens)


def preprocess_bn(text):
    """Bengali preprocessing"""
    # Keep Bengali Unicode range
    text = re.sub(r'[^\u0980-\u09FF\s]', '', text)
    tokens = text.split()
    
    if bn_stopwords:
        tokens = [w for w in tokens if w not in bn_stopwords]
    
    tokens = [w for w in tokens if len(w) >= 2 and len(w) <= 20]
    
    return ' '.join(tokens)


def preprocess_ur(text):
    """Urdu preprocessing"""
    # Keep Urdu Unicode range (Arabic + additional)
    text = re.sub(r'[^\u0600-\u06FF\u0750-\u077F\s]', '', text)
    tokens = text.split()
    tokens = [w for w in tokens if len(w) >= 2 and len(w) <= 20]
    
    return ' '.join(tokens)


def preprocess_vi(text):
    """Vietnamese preprocessing"""
    text = text.lower()
    tokens = text.split()
    
    if vi_stopwords:
        tokens = [w for w in tokens if w not in vi_stopwords]
    
    tokens = [w for w in tokens if len(w) >= 3 and len(w) <= 20]
    
    return ' '.join(tokens)


def preprocess_th(text):
    """Thai preprocessing"""
    # Keep Thai Unicode range
    text = re.sub(r'[^\u0E00-\u0E7F\s]', '', text)
    tokens = text.split()
    tokens = [w for w in tokens if len(w) >= 2 and len(w) <= 20]
    
    return ' '.join(tokens)


def preprocess_tr(text):
    """Turkish preprocessing"""
    text = text.lower()
    
    if snowballstemmer:
        try:
            stemmer = snowballstemmer.stemmer('turkish')
            tokens = [stemmer.stemWord(w) for w in text.split()]
        except Exception:
            tokens = text.split()
    else:
        tokens = text.split()
    
    sw = get_stopwords_for_lang('tr')
    if sw:
        tokens = [w for w in tokens if w not in sw]
    
    tokens = filter_noise(tokens)
    tokens = [spell_check(w, 'tr') for w in tokens]
    tokens = [w for w in tokens if len(w) >= 3 and len(w) <= 20]
    
    return ' '.join(tokens)


def preprocess_pl(text):
    """Polish preprocessing"""
    text = text.lower()
    
    if snowballstemmer:
        try:
            stemmer = snowballstemmer.stemmer('polish')
            tokens = [stemmer.stemWord(w) for w in text.split()]
        except Exception:
            tokens = text.split()
    else:
        tokens = text.split()
    
    sw = get_stopwords_for_lang('pl')
    if sw:
        tokens = [w for w in tokens if w not in sw]
    
    tokens = filter_noise(tokens)
    tokens = [spell_check(w, 'pl') for w in tokens]
    tokens = [w for w in tokens if len(w) >= 3 and len(w) <= 20]
    
    return ' '.join(tokens)


def preprocess_nl(text):
    """Dutch preprocessing"""
    text = text.lower()
    
    if snowballstemmer:
        try:
            stemmer = snowballstemmer.stemmer('dutch')
            tokens = [stemmer.stemWord(w) for w in text.split()]
        except Exception:
            tokens = text.split()
    else:
        tokens = text.split()
    
    sw = get_stopwords_for_lang('nl')
    if sw:
        tokens = [w for w in tokens if w not in sw]
    
    tokens = filter_noise(tokens)
    tokens = [spell_check(w, 'nl') for w in tokens]
    tokens = [w for w in tokens if len(w) >= 3 and len(w) <= 20]
    
    return ' '.join(tokens)


def preprocess_id(text):
    """Indonesian preprocessing"""
    text = text.lower()
    
    if snowballstemmer:
        try:
            stemmer = snowballstemmer.stemmer('indonesian')
            tokens = [stemmer.stemWord(w) for w in text.split()]
        except Exception:
            tokens = text.split()
    else:
        tokens = text.split()
    
    sw = get_stopwords_for_lang('id')
    if sw:
        tokens = [w for w in tokens if w not in sw]
    
    tokens = filter_noise(tokens)
    tokens = [spell_check(w, 'id') for w in tokens]
    tokens = [w for w in tokens if len(w) >= 3 and len(w) <= 20]
    
    return ' '.join(tokens)


# Add missing languages with basic preprocessing
def preprocess_pa(text):
    """Punjabi preprocessing"""
    # Keep Gurmukhi Unicode range
    text = re.sub(r'[^\u0A00-\u0A7F\s]', '', text)
    tokens = text.split()
    tokens = [w for w in tokens if len(w) >= 2 and len(w) <= 20]
    return ' '.join(tokens)


def preprocess_te(text):
    """Telugu preprocessing"""
    # Keep Telugu Unicode range
    text = re.sub(r'[^\u0C00-\u0C7F\s]', '', text)
    tokens = text.split()
    tokens = [w for w in tokens if len(w) >= 2 and len(w) <= 20]
    return ' '.join(tokens)


def preprocess_mr(text):
    """Marathi preprocessing"""
    # Keep Devanagari Unicode range (same as Hindi)
    text = re.sub(r'[^\u0900-\u097F\s]', '', text)
    tokens = text.split()
    tokens = [w for w in tokens if len(w) >= 2 and len(w) <= 20]
    return ' '.join(tokens)


def preprocess_ta(text):
    """Tamil preprocessing"""
    # Keep Tamil Unicode range
    text = re.sub(r'[^\u0B80-\u0BFF\s]', '', text)
    tokens = text.split()
    tokens = [w for w in tokens if len(w) >= 2 and len(w) <= 20]
    return ' '.join(tokens)


# Language preprocessor mapping
lang_preprocessors = {
    'en': preprocess_en,
    'es': preprocess_es,
    'fr': preprocess_fr,
    'de': preprocess_de,
    'it': preprocess_it,
    'pt': preprocess_pt,
    'ru': preprocess_ru,
    'zh': preprocess_zh,
    'ja': preprocess_ja,
    'ko': preprocess_ko,
    'ar': preprocess_ar,
    'hi': preprocess_hi,
    'bn': preprocess_bn,
    'ur': preprocess_ur,
    'vi': preprocess_vi,
    'th': preprocess_th,
    'tr': preprocess_tr,
    'pl': preprocess_pl,
    'nl': preprocess_nl,
    'id': preprocess_id,
    'pa': preprocess_pa,
    'te': preprocess_te,
    'mr': preprocess_mr,
    'ta': preprocess_ta,
}


def postlangid_process(text, lang, preprocessors):
    """
    Apply language-specific post-processing after language detection.
    
    Args:
        text (str): Text to process
        lang (str): Detected language code
        preprocessors (dict): Dictionary mapping language codes to preprocessor functions
    
    Returns:
        str: Processed text
    """
    if not text or not isinstance(text, str):
        return ""
    
    if lang in preprocessors:
        try:
            return preprocessors[lang](text)
        except Exception as e:
            print(f"[WARNING] Error in {lang} preprocessor: {e}")
            # Fallback to basic preprocessing
            return basic_preprocess(text)
    else:
        print(f"[WARNING] No preprocessor found for language: {lang}")
        return basic_preprocess(text)


def basic_preprocess(text):
    """Basic fallback preprocessing for unsupported languages"""
    text = text.lower().strip()
    tokens = text.split()
    tokens = [w for w in tokens if len(w) >= 2 and len(w) <= 20]
    tokens = filter_noise(tokens)
    return ' '.join(tokens)


if __name__ == "__main__":
    # Test the preprocessing functions
    test_cases = {
        'en': "This is a test sentence with some noise words like lol and hmm.",
        'es': "Esta es una oración de prueba en español.",
        'zh': "这是一个中文测试句子。",
        'ar': "هذه جملة تجريبية باللغة العربية",
        'hi': "यह हिंदी में एक परीक्षण वाक्य है।"
    }
    
    print("Testing language-specific preprocessing:")
    for lang, text in test_cases.items():
        processed = postlangid_process(text, lang, lang_preprocessors)
        print(f"{lang}: {text} -> {processed}")
