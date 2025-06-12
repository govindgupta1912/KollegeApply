import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchNews } from '../services/api';
import { toast } from 'react-toastify';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { calculatePayouts, setRates } from '../redux/slices/payoutSlice';

const Payout = () => {
  const { authorPayouts = {}, totalStats = { totalArticles: 0, totalBlogs: 0, totalPayout: 0 }, rates = { news: 50, blog: 100 } } = useSelector((state) => state.payout);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [tempPayoutRate, setTempPayoutRate] = useState(rates.news);
  const [tempBlogPayoutRate, setTempBlogPayoutRate] = useState(rates.blog);
  const dispatch = useDispatch();
  const itemsPerPage = 10;

  useEffect(() => {
    loadPayoutData();
  }, [currentPage]);

  useEffect(() => {
    setTempPayoutRate(rates.news);
    setTempBlogPayoutRate(rates.blog);
  }, [rates]);

  const loadPayoutData = async () => {
    try {
      setIsLoading(true);
      const response = await fetchNews(currentPage);
      const articles = response.articles;
      dispatch(calculatePayouts(articles));
      const payoutList = Object.values(authorPayouts);
      setTotalPages(Math.ceil(payoutList.length / itemsPerPage));
    } catch (error) {
      console.error('Error loading payout data:', error);
      toast.error('Failed to load payout data');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayoutRateChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setTempPayoutRate(value);
  };

  const handleBlogPayoutRateChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setTempBlogPayoutRate(value);
  };

  const handleSaveRates = () => {
    if (tempPayoutRate < 0 || tempBlogPayoutRate < 0) {
      toast.error('Payout rates cannot be negative');
      return;
    }
    dispatch(setRates({ news: tempPayoutRate, blog: tempBlogPayoutRate }));
    toast.success('Payout rates updated successfully');
  };

  const handleStatusChange = (status) => {
    setFilterStatus(status);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleExportCSV = () => {
    const csv = Papa.unparse(paginatedPayouts);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `payouts-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleExportPDF = () => {
      const doc = new jsPDF();
      doc.autoTable({
      head: [['Author', 'Articles', 'Blogs', 'Total Payout', 'Status']],
      body: paginatedPayouts.map(item => [
        item.author,
        item.articles,
        item.blogs,
        `$${item.totalPayout}`,
        item.status
      ])
    });
    doc.save(`payouts-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const payouts = Object.values(authorPayouts || {});

  const filteredPayouts = payouts
    .filter(payout => {
      if (!payout || !payout.author) return false;
      const matchesSearch = payout.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || payout.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => b.totalPayout - a.totalPayout);

  const paginatedPayouts = filteredPayouts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Payout Management</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export CSV
          </button>
          <button
            onClick={handleExportPDF}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Article Payout Rate</h3>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label htmlFor="payoutRate" className="block text-sm font-medium text-gray-700 mb-1">
                Rate per Article ($)
                </label>
                  <input
                    type="number"
                    id="payoutRate"
                    value={tempPayoutRate}
                onChange={handlePayoutRateChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    min="0"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Blog Payout Rate</h3>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label htmlFor="blogPayoutRate" className="block text-sm font-medium text-gray-700 mb-1">
                Rate per Blog ($)
              </label>
              <input
                type="number"
                id="blogPayoutRate"
                value={tempBlogPayoutRate}
                onChange={handleBlogPayoutRateChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                min="0"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
              <button
          onClick={handleSaveRates}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
          Save Rates
              </button>
            </div>

      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleStatusChange('all')}
              className={`px-4 py-2 rounded-lg ${
                filterStatus === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleStatusChange('paid')}
              className={`px-4 py-2 rounded-lg ${
                filterStatus === 'paid'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Paid
            </button>
            <button
              onClick={() => handleStatusChange('pending')}
              className={`px-4 py-2 rounded-lg ${
                filterStatus === 'pending'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending
            </button>
          </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Articles
                  </th>
                <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Article Rate
                </th>
                <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Article Payout
                </th>
                <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Blogs
                </th>
                <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Blog Rate
                </th>
                <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Blog Payout
                  </th>
                <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Total Payout
                  </th>
                <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
              {paginatedPayouts.map((item) => (
                <tr key={item.author} className="hover:bg-gray-50">
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.author}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.articles}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${rates.news}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${item.articlePayout}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.blogs}
                    </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${rates.blog}
                    </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${item.blogPayout}
                    </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                    ${item.totalPayout}
                    </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === 'paid' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td colSpan="7" className="px-4 sm:px-6 py-4 text-sm font-medium text-gray-900 text-right">
                  Total Payout:
                </td>
                <td className="px-4 sm:px-6 py-4 text-sm font-medium text-indigo-600">
                  ${totalStats.totalPayout}
                </td>
                <td></td>
              </tr>
            </tfoot>
            </table>
        </div>

        {totalPages > 1 && (
          <div className="px-4 sm:px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Next
            </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * itemsPerPage, filteredPayouts.length)}
                  </span>{' '}
                  of <span className="font-medium">{filteredPayouts.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => handlePageChange(index + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === index + 1
                          ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payout; 