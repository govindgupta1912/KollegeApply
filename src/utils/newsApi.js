import axios from 'axios';

const API_KEY = '26856265c7b144ffaf9ef69a2de6ae5d';
const API_URL = 'https://newsapi.org/v2';

const newsApi = axios.create({
  baseURL: API_URL,
  headers: {
    'X-Api-Key': API_KEY,
  },
});

export const fetchNews = async (page = 1) => {
  try {
    const response = await newsApi.get('/everything', {
      params: {
        q: 'technology',
        from: '2025-06-10',
        to: '2025-06-10',
        sortBy: 'popularity',
        language: 'en',
        pageSize: 20,
        page,
      },
    });

    if (response.data.status === 'error') {
      throw new Error(response.data.message || 'Failed to fetch news');
    }

    return {
      articles: response.data.articles.map(article => ({
        id: article.url,
        title: article.title,
        description: article.description,
        content: article.content,
        url: article.url,
        imageUrl: article.urlToImage,
        source: article.source.name,
        author: article.author || 'Unknown',
        publishDate: article.publishedAt,
        type: 'news',
      })),
      totalResults: response.data.totalResults,
      page,
    };
  } catch (error) {
    console.error('Error fetching news:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch news');
  }
};

export const searchNews = async (query, page = 1) => {
  try {
    const response = await newsApi.get('/everything', {
      params: {
        q: query,
        
        sortBy: 'popularity',
        language: 'en',
        pageSize: 20,
        page,
      },
    });

    if (response.data.status === 'error') {
      throw new Error(response.data.message || 'Failed to search news');
    }

    return {
      articles: response.data.articles.map(article => ({
        id: article.url,
        title: article.title,
        description: article.description,
        content: article.content,
        url: article.url,
        imageUrl: article.urlToImage,
        source: article.source.name,
        author: article.author || 'Unknown',
        publishDate: article.publishedAt,
        type: 'news',
      })),
      totalResults: response.data.totalResults,
      page,
    };
  } catch (error) {
    console.error('Error searching news:', error);
    throw new Error(error.response?.data?.message || 'Failed to search news');
  }
};

export const getTopHeadlines = async (category = 'technology') => {
  try {
    const response = await newsApi.get('/top-headlines', {
      params: {
        category,
        language: 'en',
        pageSize: 5,
      },
    });

    if (response.data.status === 'error') {
      throw new Error(response.data.message || 'Failed to fetch top headlines');
    }

    return response.data.articles.map(article => ({
      id: article.url,
      title: article.title,
      description: article.description,
      content: article.content,
      url: article.url,
      imageUrl: article.urlToImage,
      source: article.source.name,
      author: article.author || 'Unknown',
      publishDate: article.publishedAt,
      type: 'news',
    }));
  } catch (error) {
    console.error('Error fetching top headlines:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch top headlines');
  }
}; 