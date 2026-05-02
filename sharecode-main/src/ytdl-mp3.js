const axios = require('axios');

async function ytdlProcessor(youtubeLink) {
    const endpoint = 'https://ytdl.zone.id/api/ytdl';
    
    const payload = {
        link: youtubeLink,
        type: 'mp3',
        quality: '128'
    };

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'Origin': 'https://ytdl.zone.id',
            'Referer': 'https://ytdl.zone.id/'
        }
    };

    try {
        const { status, data } = await axios.post(endpoint, payload, config);

        if (status === 200 && data.downloadUrl) {
            return {
                success: true,
                title: data.title,
                metadata: {
                    type: data.type,
                    quality: data.quality
                },
                download: data.downloadUrl
            };
        } else {
            return {
                success: false,
                message: 'Gagal mendapatkan link download'
            };
        }

    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || error.message
        };
    }
}

(async () => {
    const target = 'https://youtu.be/8lrHoAZ3Fpo?si=nO9x1J-a2MhMT18-';
    
    console.log('PROSES DOWNLOAD...');
    
    const result = await ytdlProcessor(target);
    
    if (result.success) {
        console.log('Judul    :', result.title);
        console.log('Kualitas :', result.metadata.quality);
        console.log('Link     :', result.download);
    } else {
        console.log('Error    :', result.message);
    }
    
    console.log('SELESAI!');
})();
