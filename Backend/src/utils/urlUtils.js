function getYouTubeVideoId(url) {
  let videoId = null;
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})[^\s]*/;
  const match = url.match(regex);
  if (match) {
    videoId = match[1];
  }
  return videoId;
}

module.exports = { getYouTubeVideoId };
