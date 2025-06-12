import axios from 'axios';

export default async function handler(req, res) {
  const { query, from, to, sortBy, language, pageSize, page } = req.query;
  
  try {
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: query || 'technology',
        from,
        to,
        sortBy: sortBy || 'popularity',
        language: language || 'en',
        pageSize: pageSize || 20,
        page: page || 1,
        apiKey: process.env.NEWS_API_KEY
      }
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('News API Error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data || 'Failed to fetch news'
    });
  }
} 