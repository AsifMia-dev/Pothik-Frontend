import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import Layout from '../../components/Layout';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const LoyaltyPoints = () => {
  const { user } = useContext(AuthContext);

  // Real data states
  const [currentBalance, setCurrentBalance] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [allTransactions, setAllTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Membership tiers based on total earned points
  const getTier = (points) => {
    if (points >= 15000) return { name: 'Platinum Explorer', next: null, nextThreshold: null };
    if (points >= 10000) return { name: 'Gold Explorer', next: 'Platinum', nextThreshold: 15000 };
    if (points >= 5000) return { name: 'Silver Explorer', next: 'Gold', nextThreshold: 10000 };
    return { name: 'Bronze Explorer', next: 'Silver', nextThreshold: 5000 };
  };

  // Fetch balance and history from API
  useEffect(() => {
    const fetchLoyaltyData = async () => {
      if (!user?.user_id) return;

      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch balance and history in parallel
        const [balanceRes, historyRes] = await Promise.all([
          axios.get(`${API_URL}/loyalty/balance/${user.user_id}`, { headers }),
          axios.get(`${API_URL}/loyalty/user/${user.user_id}`, { headers }),
        ]);

        if (balanceRes.data.success) {
          setCurrentBalance(balanceRes.data.data.current_balance);
          setTotalEarned(balanceRes.data.data.total_earned);
          setTotalSpent(balanceRes.data.data.total_spent);
        }

        if (historyRes.data.success) {
          const mapped = historyRes.data.data.map((item) => ({
            id: item.id,
            date: new Date(item.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: '2-digit',
            }),
            description: item.description || 'Loyalty transaction',
            type: item.points_added > 0 ? 'earned' : 'redeemed',
            points: item.points_added > 0 ? item.points_added : -(item.points_deducted || 0),
          }));
          setAllTransactions(mapped);
        }
      } catch (error) {
        console.error('Error fetching loyalty data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLoyaltyData();
  }, [user?.user_id]);

  // Filter transactions based on active tab
  const filteredTransactions = allTransactions.filter(t => {
    if (activeTab === 'all') return true;
    if (activeTab === 'earned') return t.type === 'earned';
    if (activeTab === 'redeemed') return t.type === 'redeemed';
    return true;
  });

  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortBy === 'newest') return b.id - a.id;
    if (sortBy === 'oldest') return a.id - b.id;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);
  const paginatedTransactions = sortedTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const tier = getTier(totalEarned);
  const progressPercentage = tier.nextThreshold
    ? (totalEarned / tier.nextThreshold) * 100
    : 100;
  const progressToNext = tier.nextThreshold ? tier.nextThreshold - totalEarned : 0;

  if (loading) {
    return (
      <Layout>
        <main className="flex-1 bg-slate-50 dark:bg-background-dark min-h-screen">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full"></div>
            <p className="mt-4 text-slate-500 dark:text-slate-400">Loading your loyalty data...</p>
          </div>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="flex-1 bg-slate-50 dark:bg-background-dark min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[#0f1c35] dark:text-white tracking-tight">
              My Loyalty Points
            </h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Track your rewards and see your transaction history.
            </p>
          </div>

          {/* Balance Card */}
          <div className="bg-[#0f1c35] rounded-2xl p-6 md:p-8 mb-10 relative overflow-hidden">
            {/* Decorative gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a2847] to-[#0f1c35] opacity-50"></div>

            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex-1">
                <p className="text-slate-400 text-sm uppercase tracking-wider mb-2">Current Balance</p>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {currentBalance.toLocaleString()} Points
                </h2>
                <p className="text-amber-400 font-medium">{tier.name} Member</p>

                {/* Progress Bar */}
                {tier.next && (
                  <div className="mt-6">
                    <div className="flex justify-between text-sm text-slate-400 mb-2">
                      <span>Progress to {tier.next}</span>
                      <span>{progressToNext.toLocaleString()} points to go</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="mt-6 md:mt-0 md:ml-8 flex gap-6">
                <div className="text-center">
                  <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Total Earned</p>
                  <p className="text-green-400 text-xl font-bold">{totalEarned.toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Total Spent</p>
                  <p className="text-orange-400 text-xl font-bold">{totalSpent.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Points History Section */}
          <div className="bg-white dark:bg-card-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            {/* Section Header with Tabs */}
            <div className="p-4 md:p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">Points History</h3>

                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Filter Tabs */}
                  <div className="inline-flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                    <button
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${activeTab === 'all'
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      onClick={() => { setActiveTab('all'); setCurrentPage(1); }}
                    >
                      All Transactions
                    </button>
                    <button
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${activeTab === 'earned'
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      onClick={() => { setActiveTab('earned'); setCurrentPage(1); }}
                    >
                      Earned
                    </button>
                    <button
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${activeTab === 'redeemed'
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      onClick={() => { setActiveTab('redeemed'); setCurrentPage(1); }}
                    >
                      Redeemed
                    </button>
                  </div>

                  {/* Sort Dropdown */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 text-sm font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-[#034D41] outline-none"
                  >
                    <option value="newest">Sort by: Newest</option>
                    <option value="oldest">Sort by: Oldest</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Transaction Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-800">
                  <tr>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Description</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Type</th>
                    <th className="text-right px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {paginatedTransactions.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center text-slate-400 dark:text-slate-500">
                        No transactions found.
                      </td>
                    </tr>
                  ) : (
                    paginatedTransactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">
                          {transaction.date}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-800 dark:text-white font-medium">
                          {transaction.description}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${transaction.type === 'earned'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                            }`}>
                            {transaction.type === 'earned' ? 'Earned' : 'Redeemed'}
                          </span>
                        </td>
                        <td className={`px-6 py-4 text-sm font-bold text-right whitespace-nowrap ${transaction.points > 0
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-orange-600 dark:text-orange-400'
                          }`}>
                          {transaction.points > 0 ? '+' : ''}{transaction.points.toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {sortedTransactions.length > 0 && (
              <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, sortedTransactions.length)} of {sortedTransactions.length} results
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm font-medium border border-slate-200 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-sm font-medium border border-slate-200 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </main>
    </Layout>
  );
};

export default LoyaltyPoints;