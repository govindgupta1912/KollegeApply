import { dummyArticles, dummyHeadlines } from '../utils/dummyData';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Fetch news articles with pagination
export const fetchNews = async (page = 1, pageSize = 10) => {
  try {
    // Simulate API delay
    await delay(500);

    // Calculate pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedArticles = dummyArticles.slice(startIndex, endIndex);

    return {
      articles: paginatedArticles,
      totalResults: dummyArticles.length,
      status: 'ok'
    };
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
};

// Fetch top headlines
export const fetchTopHeadlines = async () => {
  try {
    // Simulate API delay
    await delay(300);

    return {
      articles: dummyHeadlines,
      status: 'ok'
    };
  } catch (error) {
    console.error('Error fetching headlines:', error);
    throw error;
  }
};

// Search articles
export const searchArticles = async (query, page = 1, pageSize = 10) => {
  try {
    // Simulate API delay
    await delay(500);

    // Filter articles based on search query
    const filteredArticles = dummyArticles.filter(article => 
      article.title.toLowerCase().includes(query.toLowerCase()) ||
      article.description.toLowerCase().includes(query.toLowerCase()) ||
      article.content.toLowerCase().includes(query.toLowerCase())
    );

    // Calculate pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

    return {
      articles: paginatedArticles,
      totalResults: filteredArticles.length,
      status: 'ok'
    };
  } catch (error) {
    console.error('Error searching articles:', error);
    throw error;
  }
};

// Get article by ID
export const getArticleById = async (id) => {
  try {
    await delay(300);
    const article = dummyArticles.find(article => article.id === id);
    if (!article) {
      throw new Error('Article not found');
    }
    return article;
  } catch (error) {
    console.error('Error fetching article:', error);
    throw error;
  }
};

// Get articles by author
export const getArticlesByAuthor = async (author, page = 1, pageSize = 10) => {
  try {
    await delay(500);
    const filteredArticles = dummyArticles.filter(article => 
      article.author.toLowerCase().includes(author.toLowerCase())
    );

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

    return {
      articles: paginatedArticles,
      totalResults: filteredArticles.length,
      status: 'ok'
    };
  } catch (error) {
    console.error('Error fetching author articles:', error);
    throw error;
  }
}; 