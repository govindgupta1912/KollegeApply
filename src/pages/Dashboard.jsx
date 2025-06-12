import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchNews, fetchTopHeadlines } from '../services/api';
import { toast } from 'react-toastify';
import { calculatePayouts } from '../redux/slices/payoutSlice';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { authorPayouts, totalStats, rates } = useSelector((state) => state.payout);
  const [topHeadlines, setTopHeadlines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        // Fetch news articles
        const newsResponse = await fetchNews(1);
        const articles = newsResponse.articles;

        // Calculate payouts using Redux
        dispatch(calculatePayouts(articles));

        // Fetch top headlines
        const headlinesResponse = await fetchTopHeadlines();
        setTopHeadlines(headlinesResponse.articles);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [dispatch]);

  // Prepare chart data with better formatting
  const chartData = Object.entries(authorPayouts)
    .map(([author, data]) => ({
      author: author.length > 15 ? author.substring(0, 15) + '...' : author,
      articles: data.articles,
      blogs: data.blogs,
      articlePayout: data.articlePayout,
      blogPayout: data.blogPayout,
      totalPayout: data.totalPayout
    }))
    .sort((a, b) => b.totalPayout - a.totalPayout)
    .slice(0, 10); // Show top 10 authors

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Welcome back, {user?.name || 'User'}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Articles</p>
              <p className="text-xl sm:text-2xl font-semibold text-gray-900">{totalStats.totalArticles}</p>
              <p className="text-sm text-gray-500">Rate: ${rates.news}/article</p>
            </div>
            <div className="p-2 sm:p-3 bg-indigo-100 rounded-full">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Blogs</p>
              <p className="text-xl sm:text-2xl font-semibold text-gray-900">{totalStats.totalBlogs}</p>
              <p className="text-sm text-gray-500">Rate: ${rates.blog}/blog</p>
            </div>
            <div className="p-2 sm:p-3 bg-green-100 rounded-full">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Authors</p>
              <p className="text-xl sm:text-2xl font-semibold text-gray-900">{Object.keys(authorPayouts).length}</p>
            </div>
            <div className="p-2 sm:p-3 bg-blue-100 rounded-full">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M17 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Payout</p>
              <p className="text-xl sm:text-2xl font-semibold text-gray-900">
                ${totalStats.totalPayout}
              </p>
            </div>
            <div className="p-2 sm:p-3 bg-yellow-100 rounded-full">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Recent Articles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
            <h3 className="text-lg font-medium text-gray-900">Top Authors</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Top 10</span>
            </div>
          </div>
          <div className="h-[300px] sm:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                barSize={20}
              >
                <defs>
                  <linearGradient id="colorArticles" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.2}/>
                  </linearGradient>
                  <linearGradient id="colorBlogs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  vertical={false}
                  stroke="#E5E7EB"
                />
                <XAxis 
                  dataKey="author" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  interval={0}
                  tickFormatter={(value) => {
                    // Truncate long author names
                    return value.length > 10 ? value.substring(0, 10) + '...' : value;
                  }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  width={40}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  }}
                  formatter={(value, name) => [
                    `${value} ${name === 'articles' ? 'articles' : name === 'blogs' ? 'blogs' : '$'}`,
                    name === 'articles' ? 'Articles' : name === 'blogs' ? 'Blogs' : 'Payout'
                  ]}
                />
                <Bar 
                  dataKey="articles" 
                  fill="url(#colorArticles)"
                  radius={[4, 4, 0, 0]}
                  name="Articles"
                />
                <Bar 
                  dataKey="blogs" 
                  fill="url(#colorBlogs)"
                  radius={[4, 4, 0, 0]}
                  name="Blogs"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-indigo-600 mr-2"></div>
              <span className="text-sm text-gray-600">Articles</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-sm text-gray-600">Blogs</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
            <h3 className="text-lg font-medium text-gray-900">Top Headlines</h3>
            <span className="text-sm text-gray-500">Latest Updates</span>
          </div>
          <div className="space-y-4">
            {topHeadlines.slice(0, 5).map((headline, index) => (
              <div key={index} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-sm font-medium text-indigo-600">{index + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{headline.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{headline.source}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 