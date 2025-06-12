import { createSlice } from '@reduxjs/toolkit';

// Load initial rates from localStorage or use defaults
const loadRatesFromStorage = () => {
  const savedRates = localStorage.getItem('payoutRates');
  return savedRates ? JSON.parse(savedRates) : { news: 50, blog: 100 };
};

const initialState = {
  authorPayouts: {},
  totalStats: {
    totalArticles: 0,
    totalBlogs: 0,
    totalPayout: 0
  },
  rates: loadRatesFromStorage()
};

const payoutSlice = createSlice({
  name: 'payout',
  initialState,
  reducers: {
    calculatePayouts: (state, action) => {
      const articles = action.payload;
      const newAuthorPayouts = {};
      let totalArticles = 0;
      let totalBlogs = 0;
      let totalPayout = 0;

      articles.forEach(article => {
        const author = article.author || 'Unknown Author';
        const isBlog = article.type === 'blog'; // Use the article's type field

        if (!newAuthorPayouts[author]) {
          newAuthorPayouts[author] = {
            author,
            articles: 0,
            blogs: 0,
            articlePayout: 0,
            blogPayout: 0,
            totalPayout: 0,
            status: 'pending',
            lastPayout: null
          };
        }

        if (isBlog) {
          newAuthorPayouts[author].blogs++;
          newAuthorPayouts[author].blogPayout += state.rates.blog;
          totalBlogs++;
        } else {
          newAuthorPayouts[author].articles++;
          newAuthorPayouts[author].articlePayout += state.rates.news;
          totalArticles++;
        }

        newAuthorPayouts[author].totalPayout = 
          newAuthorPayouts[author].articlePayout + 
          newAuthorPayouts[author].blogPayout;
      });

      // Calculate total payout
      totalPayout = Object.values(newAuthorPayouts).reduce(
        (sum, author) => sum + author.totalPayout, 
        0
      );

      state.authorPayouts = newAuthorPayouts;
      state.totalStats = {
        totalArticles,
        totalBlogs,
        totalPayout
      };
    },
    setRates: (state, action) => {
      const { news, blog } = action.payload;
      state.rates = { news, blog };
      
      // Save rates to localStorage
      localStorage.setItem('payoutRates', JSON.stringify({ news, blog }));

      // Recalculate all payouts with new rates
      const newAuthorPayouts = { ...state.authorPayouts };
      let totalPayout = 0;

      Object.keys(newAuthorPayouts).forEach(author => {
        const authorData = newAuthorPayouts[author];
        authorData.articlePayout = authorData.articles * state.rates.news;
        authorData.blogPayout = authorData.blogs * state.rates.blog;
        authorData.totalPayout = authorData.articlePayout + authorData.blogPayout;
        totalPayout += authorData.totalPayout;
      });

      state.authorPayouts = newAuthorPayouts;
      state.totalStats.totalPayout = totalPayout;
    }
  }
});

export const { calculatePayouts, setRates } = payoutSlice.actions;
export default payoutSlice.reducer; 