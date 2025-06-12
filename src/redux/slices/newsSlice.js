import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  articles: [],
  filteredArticles: [],
  loading: false,
  error: null,
  filters: {
    author: '',
    dateRange: {
      startDate: null,
      endDate: null,
    },
    type: 'all',
    searchQuery: '',
  },
  stats: {
    totalArticles: 0,
    totalBlogs: 0,
  },
};

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    fetchArticlesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchArticlesSuccess: (state, action) => {
      state.loading = false;
      state.articles = action.payload;
      state.filteredArticles = action.payload;
      state.stats = {
        totalArticles: action.payload.filter(article => article.type === 'news').length,
        totalBlogs: action.payload.filter(article => article.type === 'blog').length,
      };
    },
    fetchArticlesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      // Apply filters
      let filtered = [...state.articles];
      
      if (state.filters.author) {
        filtered = filtered.filter(article => 
          article.author.toLowerCase().includes(state.filters.author.toLowerCase())
        );
      }
      
      if (state.filters.dateRange.startDate && state.filters.dateRange.endDate) {
        filtered = filtered.filter(article => {
          const articleDate = new Date(article.publishDate);
          return articleDate >= state.filters.dateRange.startDate && 
                 articleDate <= state.filters.dateRange.endDate;
        });
      }
      
      if (state.filters.type !== 'all') {
        filtered = filtered.filter(article => article.type === state.filters.type);
      }
      
      if (state.filters.searchQuery) {
        const query = state.filters.searchQuery.toLowerCase();
        filtered = filtered.filter(article =>
          article.title.toLowerCase().includes(query) ||
          article.description.toLowerCase().includes(query)
        );
      }
      
      state.filteredArticles = filtered;
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.filteredArticles = state.articles;
    },
  },
});

export const {
  fetchArticlesStart,
  fetchArticlesSuccess,
  fetchArticlesFailure,
  setFilters,
  clearFilters,
} = newsSlice.actions;

export default newsSlice.reducer; 