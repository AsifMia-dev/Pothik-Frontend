import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { FiChevronLeft, FiChevronRight, FiCornerUpLeft } from "react-icons/fi";

const Ratings = () => {
    const { user } = useContext(AuthContext);
    const [reviews, setReviews] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterProperty, setFilterProperty] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState("");
    const [properties] = useState([
        { id: 1, name: "Seaside Villa" },
        { id: 2, name: "Mountain Cabin" },
        { id: 3, name: "City Apartment" },
    ]);

    const [stats] = useState({
        overallRating: 4.8,
        totalReviews: 124,
        responseRate: 95,
        breakdown: {
            5: 98,
            4: 15,
            3: 5,
            2: 2,
            1: 4,
        },
    });

    useEffect(() => {
        // Mock reviews data
        const mockReviews = [
            {
                id: 1,
                guestName: "Alicia Keys",
                guestAvatar: null,
                propertyName: "Seaside Villa",
                rating: 5,
                title: "Absolutely stunning getaway!",
                content: "The view was breathtaking and the villa was immaculate. Everything we needed was provided, and the host was incredibly responsive. We will definitely be back!",
                createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                reply: null,
            },
            {
                id: 2,
                guestName: "Johnathan Lee",
                guestAvatar: null,
                propertyName: "Mountain Cabin",
                rating: 4,
                title: "Cozy and peaceful",
                content: "A great place to disconnect. The cabin was rustic but comfortable. The only downside was a slightly spotty Wi-Fi connection, but that's expected in the mountains. We enjoyed our stay.",
                createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                reply: "Thank you for your feedback, Johnathan! We're glad you enjoyed the peace and quiet. We're currently working on upgrading our internet service for a better experience.",
            },
            {
                id: 3,
                guestName: "Sarah Miller",
                guestAvatar: null,
                propertyName: "City Apartment",
                rating: 5,
                title: "Perfect city escape",
                content: "Great location, clean apartment, and the host was very accommodating. Would highly recommend for anyone visiting the city.",
                createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
                reply: null,
            },
            {
                id: 4,
                guestName: "Michael Chen",
                guestAvatar: null,
                propertyName: "Seaside Villa",
                rating: 5,
                title: "Amazing experience",
                content: "The villa exceeded all our expectations. Beautiful views, excellent amenities, and perfect for our family vacation.",
                createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
                reply: "Thank you so much, Michael! We loved hosting your family and hope to see you again soon!",
            },
        ];
        setReviews(mockReviews);
    }, []);

    const formatTimeAgo = (date) => {
        const now = new Date();
        const diff = now - date;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        if (days === 0) return "Today";
        if (days === 1) return "1 day ago";
        if (days < 7) return `${days} days ago`;
        if (days < 14) return "1 week ago";
        if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
        return `${Math.floor(days / 30)} months ago`;
    };

    const renderStars = (rating) => {
        return (
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        className={`text-sm ${star <= rating ? "text-orange-400" : "text-gray-300"}`}
                    >
                        ★
                    </span>
                ))}
            </div>
        );
    };

    const handleSubmitReply = (reviewId) => {
        if (!replyText.trim()) return;
        setReviews(reviews.map(r =>
            r.id === reviewId ? { ...r, reply: replyText } : r
        ));
        setReplyingTo(null);
        setReplyText("");
    };

    const filteredReviews = reviews
        .filter(r => filterProperty === "all" || r.propertyName === properties.find(p => p.id === parseInt(filterProperty))?.name)
        .sort((a, b) => {
            if (sortBy === "newest") return b.createdAt - a.createdAt;
            if (sortBy === "oldest") return a.createdAt - b.createdAt;
            if (sortBy === "highest") return b.rating - a.rating;
            if (sortBy === "lowest") return a.rating - b.rating;
            return 0;
        });

    const totalPages = 8;

    // Calculate breakdown percentages
    const totalBreakdown = Object.values(stats.breakdown).reduce((a, b) => a + b, 0);

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Your Ratings & Reviews</h1>
                <p className="text-gray-500 mt-1">View and analyze feedback from your guests.</p>
            </div>

            <div className="flex gap-8">
                {/* Left Side - Reviews */}
                <div className="flex-1">
                    {/* Filters */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-gray-800">Guest Reviews</h2>
                        <div className="flex items-center gap-4">
                            <select
                                value={filterProperty}
                                onChange={(e) => setFilterProperty(e.target.value)}
                                className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white"
                            >
                                <option value="all">Filter by Property</option>
                                {properties.map((prop) => (
                                    <option key={prop.id} value={prop.id}>{prop.name}</option>
                                ))}
                            </select>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white"
                            >
                                <option value="newest">Sort by: Newest</option>
                                <option value="oldest">Sort by: Oldest</option>
                                <option value="highest">Sort by: Highest</option>
                                <option value="lowest">Sort by: Lowest</option>
                            </select>
                        </div>
                    </div>

                    {/* Reviews List */}
                    <div className="space-y-4">
                        {filteredReviews.map((review) => (
                            <div key={review.id} className="bg-white rounded-xl p-6 shadow-sm">
                                <div className="flex items-start gap-4">
                                    {/* Avatar */}
                                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                                        {review.guestAvatar ? (
                                            <img src={review.guestAvatar} alt="" className="w-full h-full rounded-full object-cover" />
                                        ) : (
                                            <span className="text-gray-600 font-medium text-lg">
                                                {review.guestName.charAt(0)}
                                            </span>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="font-semibold text-gray-800">{review.guestName}</h3>
                                                <p className="text-sm text-teal-600">Reviewed '{review.propertyName}'</p>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-gray-500">
                                                {renderStars(review.rating)}
                                                <span>• {formatTimeAgo(review.createdAt)}</span>
                                            </div>
                                        </div>

                                        <h4 className="font-medium text-gray-800 mt-3">{review.title}</h4>
                                        <p className="text-gray-600 mt-1 text-sm leading-relaxed">{review.content}</p>

                                        {/* Reply Button */}
                                        {!review.reply && replyingTo !== review.id && (
                                            <button
                                                onClick={() => setReplyingTo(review.id)}
                                                className="mt-4 flex items-center gap-2 text-teal-600 hover:text-teal-700 text-sm font-medium"
                                            >
                                                <FiCornerUpLeft className="w-4 h-4" />
                                                Reply
                                            </button>
                                        )}

                                        {/* Reply Input */}
                                        {replyingTo === review.id && (
                                            <div className="mt-4 bg-gray-50 rounded-lg p-4">
                                                <textarea
                                                    value={replyText}
                                                    onChange={(e) => setReplyText(e.target.value)}
                                                    placeholder="Write your reply..."
                                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm resize-none"
                                                    rows={3}
                                                />
                                                <div className="flex justify-end gap-2 mt-2">
                                                    <button
                                                        onClick={() => { setReplyingTo(null); setReplyText(""); }}
                                                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={() => handleSubmitReply(review.id)}
                                                        className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700"
                                                    >
                                                        Send Reply
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Existing Reply */}
                                        {review.reply && (
                                            <div className="mt-4 bg-gray-50 rounded-lg p-4">
                                                <p className="text-sm font-medium text-gray-700 mb-1">Your reply:</p>
                                                <p className="text-sm text-gray-600">{review.reply}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-center gap-2 mt-8">
                        <button
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 disabled:opacity-50"
                        >
                            <FiChevronLeft className="w-4 h-4" />
                        </button>
                        {[1, 2, 3].map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium ${currentPage === page ? "bg-teal-600 text-white" : "hover:bg-gray-200 text-gray-700"
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                        <span className="text-gray-500">...</span>
                        <button
                            onClick={() => setCurrentPage(totalPages)}
                            className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium ${currentPage === totalPages ? "bg-teal-600 text-white" : "hover:bg-gray-200 text-gray-700"
                                }`}
                        >
                            {totalPages}
                        </button>
                        <button
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 disabled:opacity-50"
                        >
                            <FiChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Right Sidebar - Stats */}
                <div className="w-80 space-y-6">
                    {/* Overall Rating */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <p className="text-sm text-gray-500 mb-1">Overall Rating</p>
                        <p className="text-3xl font-bold text-gray-800">{stats.overallRating} Stars</p>
                    </div>

                    {/* Total Reviews */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <p className="text-sm text-gray-500 mb-1">Total Reviews</p>
                        <p className="text-3xl font-bold text-gray-800">{stats.totalReviews}</p>
                    </div>

                    {/* Response Rate */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <p className="text-sm text-gray-500 mb-1">Response Rate</p>
                        <p className="text-3xl font-bold text-gray-800">{stats.responseRate}%</p>
                    </div>

                    {/* Rating Breakdown */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <p className="text-sm text-gray-500 mb-4">Rating Breakdown</p>

                        {/* Circular Progress */}
                        <div className="flex justify-center mb-6">
                            <div className="relative w-32 h-32">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="45"
                                        fill="none"
                                        stroke="#f3f4f6"
                                        strokeWidth="10"
                                    />
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="45"
                                        fill="none"
                                        stroke="#f97316"
                                        strokeWidth="10"
                                        strokeLinecap="round"
                                        strokeDasharray={`${(stats.overallRating / 5) * 283} 283`}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-2xl font-bold text-gray-800">{stats.overallRating}</span>
                                    <span className="text-xs text-gray-500">Average</span>
                                </div>
                            </div>
                        </div>

                        {/* Bars */}
                        <div className="space-y-3">
                            {[5, 4, 3, 2, 1].map((star) => (
                                <div key={star} className="flex items-center gap-3">
                                    <span className="text-sm text-gray-600 w-12">{star} Stars</span>
                                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-orange-400 rounded-full"
                                            style={{ width: `${(stats.breakdown[star] / totalBreakdown) * 100}%` }}
                                        />
                                    </div>
                                    <span className="text-sm text-gray-500 w-8 text-right">{stats.breakdown[star]}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Performance Over Time */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-sm text-gray-500">Performance Over Time</p>
                            <span className="text-sm text-teal-600">Last 6 Months</span>
                        </div>

                        {/* Simple line chart */}
                        <div className="h-24">
                            <svg width="100%" height="100%" viewBox="0 0 200 80" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="performanceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="#f97316" stopOpacity="0.2" />
                                        <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                <path
                                    d="M0,60 Q30,40 50,45 T100,35 T150,30 T200,20"
                                    fill="none"
                                    stroke="#f97316"
                                    strokeWidth="2"
                                />
                                <path
                                    d="M0,60 Q30,40 50,45 T100,35 T150,30 T200,20 L200,80 L0,80 Z"
                                    fill="url(#performanceGradient)"
                                />
                            </svg>
                        </div>

                        {/* Month labels */}
                        <div className="flex justify-between mt-2">
                            {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month) => (
                                <span key={month} className="text-xs text-gray-400">{month}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Ratings;
