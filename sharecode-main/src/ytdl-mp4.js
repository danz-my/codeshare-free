const axios = require('axios');

const BASE_URL = 'https://ytdl.zone.id/api/ytdl';

async function ytdl(link, type = 'mp4', quality = '720') {
  try {
    const res = await axios.post(
      BASE_URL,
      {
        link,
        type,
        quality
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0',
          Origin: 'https://ytdl.zone.id',
          Referer: 'https://ytdl.zone.id/'
        }
      }
    );

    const data = res.data;

    if (!res.status || !data || !data.downloadUrl) {
      return {
        success: false,
        input: { link, type, quality },
        message: 'Download URL tidak ditemukan'
      };
    }

    return {
      success: true,
      input: { link, type, quality },
      result: {
        title: data.title || null,
        quality: data.quality || quality,
        download: data.downloadUrl,
        type
      }
    };

  } catch (err) {
    return {
      success: false,
      input: { link, type, quality },
      status: err.response?.status || 500,
      message: err.message,
      error: err.response?.data || null
    };
  }
}

(async () => {
  const link = 'https://youtu.be/8lrHoAZ3Fpo?si=nO9x1J-a2MhMT18-';

  const res720 = await ytdl(link, 'mp4', '720');
  const res1080 = await ytdl(link, 'mp4', '1080');

  console.log(
    JSON.stringify(
      {
        success: true,
        results: [res720, res1080]
      },
      null,
      2
    )
  );
})();
