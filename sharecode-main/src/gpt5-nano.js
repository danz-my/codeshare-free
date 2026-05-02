const axios = require('axios');

const BASE_URL = 'https://api.lexcode.biz.id/api/ai/gpt5-nano';

async function chatAI() {
  const question = 'Hai👋';

  try {
    const res = await axios.get(BASE_URL, {
      params: { text: question },
      headers: {
        Accept: 'application/json',
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const data = res.data;

    return {
      success: true,
      creator: 'v.d share code',
      input: question,
      output: data.result?.result || null,
      meta: {
        status: data.result?.success || false,
        timestamp: data.result?.timestamp || null,
        responseTime: data.result?.responseTime || null
      }
    };

  } catch (err) {
    return {
      success: false,
      input: question,
      status: err.response?.status || 500,
      message: err.message
    };
  }
}

(async () => {
  const result = await chatAI();
  console.log(JSON.stringify(result, null, 2));
})();
