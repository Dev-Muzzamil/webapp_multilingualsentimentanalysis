import os
import requests
from dotenv import load_dotenv
load_dotenv()
# Get YouTube API key from environment variable
YOUTUBE_API_KEY = os.environ.get('YOUTUBE_API_KEY')
VIDEO_ID = 'jfKfPfyJRdk'  # Example live video

if not YOUTUBE_API_KEY:
    raise Exception('YOUTUBE_API_KEY not set in environment')

# Step 1: Get liveChatId from video details
video_url = f'https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id={VIDEO_ID}&key={YOUTUBE_API_KEY}'
resp = requests.get(video_url)
resp.raise_for_status()
data = resp.json()
live_chat_id = None
try:
    live_chat_id = data['items'][0]['liveStreamingDetails']['activeLiveChatId']
    print('liveChatId:', live_chat_id)
except (KeyError, IndexError):
    print('No liveChatId found. Is the video live?')
    exit(1)

# Step 2: Get live chat messages
chat_url = f'https://www.googleapis.com/youtube/v3/liveChat/messages?liveChatId={live_chat_id}&part=snippet,authorDetails&key={YOUTUBE_API_KEY}'
chat_resp = requests.get(chat_url)
chat_resp.raise_for_status()
chat_data = chat_resp.json()

print('Sample live chat messages:')
for item in chat_data.get('items', []):
    author = item['authorDetails']['displayName']
    message = item['snippet']['displayMessage']
    print(f'{author}: {message}')
