import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')
from flask import Flask, request, jsonify
from werkzeug.exceptions import BadRequest
import sys
import os


# Adjust sys.path for robust src import in any environment
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))



# Import detection from new bv2.py location
try:
    from src.services.languagedetectionandpreprocessing.bv2 import detect_languages, TOP_20_LANGS
except Exception:
    detect_languages = None
    TOP_20_LANGS = [
        'en','fr','de','es','it','pt','ru','zh','ja','ko',
        'ar','hi','bn','pa','te','mr','ta','tr','vi','ur'
    ]

# Import pre- and post-language-id processing from new locations
from src.services.languagedetectionandpreprocessing.prelangidprocessing import prelangid_clean
from src.services.languagedetectionandpreprocessing.postlangidprocessing import postlangid_process, lang_preprocessors


app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False


@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'supported': list(TOP_20_LANGS)})


@app.route('/detect', methods=['POST'])
def detect():
    print("""Basic language detection without preprocessing""")
    try:
        data = request.get_json(force=True, silent=True)
    except BadRequest:
        return jsonify({'error': 'Invalid JSON'}), 400

    text = (data or {}).get('text', '')
    if not text or not detect_languages:
        return jsonify({'languages': [], 'supported': list(TOP_20_LANGS)})

    try:
        result = detect_languages(text)
        # result: List[Tuple[segment, lang]]
        languages = []
        for segment, lang in result:
            if lang in TOP_20_LANGS:
                languages.append({'segment': segment, 'language': lang})
        return jsonify({'languages': languages})
    except Exception as e:
        return jsonify({'error': str(e), 'languages': []}), 500


@app.route('/detect_and_preprocess', methods=['POST'])
def detect_and_preprocess():
    """Complete pipeline: prelangid -> bv2 -> postlangid"""
    try:
        data = request.get_json(force=True, silent=True)
    except BadRequest:
        return jsonify({'error': 'Invalid JSON'}), 400

    text = (data or {}).get('text', '')
    if not text:
        return jsonify({'error': 'No text provided', 'languages': []}), 400
    
    if not detect_languages:
        return jsonify({'error': 'Language detection service unavailable', 'languages': []}), 503

    try:
        # STEP 1: Pre-language-id processing
        print(f"[DEBUG] Original text: {repr(text)}")
        precleaned_text = prelangid_clean(text)
        print(f"[DEBUG] After prelangid_clean: {repr(precleaned_text)}")

        # Check if text is empty after cleaning
        if not precleaned_text.strip():
            return jsonify({
                'languages': [],
                'message': 'Text became empty after preprocessing',
                'original_text': text
            })

        # STEP 2: Send cleaned text to bv2 for language detection
        print("[DEBUG] Sending to bv2 for language detection...")
        detection_result = detect_languages(precleaned_text)
        print(f"[DEBUG] bv2 detection result: {detection_result}")

        # STEP 3: Post-language-id processing for each detected segment
        processed_languages = []
        for segment, detected_lang in detection_result:
            if detected_lang in TOP_20_LANGS:
                print(f"[DEBUG] Processing segment '{segment}' with language '{detected_lang}'")

                # Apply language-specific post-processing
                cleaned_segment = postlangid_process(segment, detected_lang, lang_preprocessors)
                print(f"[DEBUG] After postlangid_process: {repr(cleaned_segment)}")

                processed_languages.append({
                    'original_segment': segment,
                    'language': detected_lang,
                    'cleaned_segment': cleaned_segment,
                    'segment_length': len(cleaned_segment)
                })
            else:
                # Language not in supported list
                print(f"[DEBUG] Skipping unsupported language: {detected_lang}")

        return jsonify({
            'languages': processed_languages,
            'preprocessing_info': {
                'original_length': len(text),
                'precleaned_length': len(precleaned_text),
                'segments_processed': len(processed_languages)
            }
        })
    except Exception as e:
        print(f"[ERROR] Exception in detect_and_preprocess: {str(e)}")
        return jsonify({'error': str(e), 'languages': []}), 500


@app.route('/process_pipeline', methods=['POST'])
def process_pipeline():
    """Alternative endpoint with more detailed pipeline information"""
    try:
        data = request.get_json(force=True, silent=True)
    except BadRequest:
        return jsonify({'error': 'Invalid JSON'}), 400

    text = (data or {}).get('text', '')
    options = (data or {}).get('options', {})
    
    # Extract options for prelangid_clean
    remove_emojis = options.get('remove_emojis', False)
    normalize_unicode_chars = options.get('normalize_unicode', True)
    preserve_hashtag_text = options.get('preserve_hashtags', False)
    preserve_mention_text = options.get('preserve_mentions', False)
    
    if not text:
        return jsonify({'error': 'No text provided'}), 400
    
    if not detect_languages:
        return jsonify({'error': 'Language detection service unavailable'}), 503

    pipeline_info = {
        'step_1_prelangid': {},
        'step_2_detection': {},
        'step_3_postlangid': {},
        'final_result': []
    }

    try:
        # STEP 1: Pre-language-id processing with custom options
        original_text = text
        precleaned_text = prelangid_clean(
            text,
            preserve_hashtag_text=preserve_hashtag_text,
            preserve_mention_text=preserve_mention_text
        )
        
        pipeline_info['step_1_prelangid'] = {
            'original_text': original_text,
            'cleaned_text': precleaned_text,
            'original_length': len(original_text),
            'cleaned_length': len(precleaned_text),
            'options_used': options
        }

        # STEP 2: Language detection via bv2
        detection_result = detect_languages(precleaned_text)
        pipeline_info['step_2_detection'] = {
            'input_text': precleaned_text,
            'detected_segments': len(detection_result),
            'raw_detection': detection_result
        }

        # STEP 3: Post-language-id processing
        final_segments = []
        for segment, detected_lang in detection_result:
            if detected_lang in TOP_20_LANGS:
                cleaned_segment = postlangid_process(segment, detected_lang, lang_preprocessors)
                
                segment_info = {
                    'original_segment': segment,
                    'language': detected_lang,
                    'final_cleaned_segment': cleaned_segment,
                    'processing_steps': {
                        'input_length': len(segment),
                        'output_length': len(cleaned_segment)
                    }
                }
                final_segments.append(segment_info)

        pipeline_info['step_3_postlangid'] = {
            'processed_segments': len(final_segments)
        }
        pipeline_info['final_result'] = final_segments

        return jsonify(pipeline_info)

    except Exception as e:
        return jsonify({'error': str(e), 'pipeline_info': pipeline_info}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
