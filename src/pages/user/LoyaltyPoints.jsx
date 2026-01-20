import React, { useState } from 'react';
import Layout from '../../components/Layout';

const LoyaltyPoints = () => {
  // Mock data - replace with actual API data
  const [currentBalance] = useState(12500);
  const [membershipTier] = useState('Gold Explorer Member');
  const [progressToNext] = useState(2500); // Points needed for next tier
  const [totalForNext] = useState(15000); // Total points for next tier

  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Mock transaction data
  const allTransactions = [
    { id: 1, date: 'Oct 26, 2023', description: 'Flight Booking: NYC to LA', type: 'earned', points: 1500 },
    { id: 2, date: 'Sep 15, 2023', description: 'Redeemed for Hotel Voucher', type: 'redeemed', points: -5000 },
    { id: 3, date: 'Aug 01, 2023', description: 'Anniversary Bonus', type: 'earned', points: 500 },
    { id: 4, date: 'Jul 20, 2023', description: 'Hotel Stay: The Grand Paris', type: 'earned', points: 850 },
    { id: 5, date: 'Jun 05, 2023', description: 'Welcome Bonus', type: 'earned', points: 10000 },
    { id: 6, date: 'May 15, 2023', description: 'Tour Package: Maldives', type: 'earned', points: 2200 },
    { id: 7, date: 'Apr 10, 2023', description: 'Redeemed for Flight Discount', type: 'redeemed', points: -3000 },
    { id: 8, date: 'Mar 22, 2023', description: 'Referral Bonus', type: 'earned', points: 750 },
    { id: 9, date: 'Feb 14, 2023', description: 'Valentine Special Offer', type: 'earned', points: 300 },
    { id: 10, date: 'Jan 01, 2023', description: 'New Year Bonus', type: 'earned', points: 1000 },
  ];

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

  const progressPercentage = ((totalForNext - progressToNext) / totalForNext) * 100;

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
                <p className="text-amber-400 font-medium">{membershipTier}</p>

                {/* Progress Bar */}
                <div className="mt-6">
                  <div className="flex justify-between text-sm text-slate-400 mb-2">
                    <span>Progress to Platinum</span>
                    <span>{progressToNext.toLocaleString()} points to go</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Redeem Button */}
              <div className="mt-6 md:mt-0 md:ml-8">
                <button className="flex items-center gap-2 bg-[#f97316] hover:bg-[#ea580c] text-white font-semibold py-3 px-6 rounded-full transition-all duration-200 shadow-lg shadow-orange-500/30">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                  </svg>
                  Redeem Points
                </button>
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
                  {paginatedTransactions.map((transaction) => (
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
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
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
          </div>

        </div>
      </main>
    </Layout>
  );
};

export default LoyaltyPoints;