import axios from 'axios';
import { dummyArticles, dummyHeadlines } from '../utils/dummyData';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Fetch news articles with pagination
export const fetchNews = async (page = 1, pageSize = 10) => {
  try {
    // Use dummy data in development, real API in production
    if (import.meta.env.DEV) {
      await delay(500);
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedArticles = dummyArticles.slice(startIndex, endIndex);

      return {
        articles: paginatedArticles,
        totalResults: dummyArticles.length,
        status: 'ok'
      };
    }

    // In production, use the proxy endpoint
    const response = await axios.get('/api/news', {
      params: {
        page,
        pageSize,
        from: new Date().toISOString().split('T')[0],
        to: new Date().toISOString().split('T')[0]
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
};

// Fetch top headlines
export const fetchTopHeadlines = async () => {
  try {
    // Use dummy data in development
    if (import.meta.env.DEV) {
      await delay(300);
      return {
        articles: dummyHeadlines,
        status: 'ok'
      };
    }

    // In production, use the proxy endpoint
    const response = await axios.get('/api/news', {
      params: {
        sortBy: 'popularity',
        pageSize: 5
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching headlines:', error);
    throw error;
  }
};

// Search articles
export const searchArticles = async (query, page = 1, pageSize = 10) => {
  try {
    // Use dummy data in development
    if (import.meta.env.DEV) {
      await delay(500);
      const filteredArticles = dummyArticles.filter(article => 
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.description.toLowerCase().includes(query.toLowerCase()) ||
        article.content.toLowerCase().includes(query.toLowerCase())
      );

      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

      return {
        articles: paginatedArticles,
        totalResults: filteredArticles.length,
        status: 'ok'
      };
    }

    // In production, use the proxy endpoint
    const response = await axios.get('/api/news', {
      params: {
        query,
        page,
        pageSize
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error searching articles:', error);
    throw error;
  }
}; 