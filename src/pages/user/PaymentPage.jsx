// src/pages/user/PaymentPage.jsx
import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import Layout from "../../components/Layout";
import api from "../../Helper/baseUrl.helper";
import { AuthContext } from "../../context/AuthContext";

const PaymentPage = () => {
    const { packageId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    // Package & pricing state
    const [packageInfo, setPackageInfo] = useState(null);
    const [destinations, setDestinations] = useState([]);
    const [services, setServices] = useState({ hotels: [], transports: [], guides: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Booking details - single traveler only for prebuilt packages
    const [travelers] = useState({
        adults: 1,
        children: 0,
    });
    const [travelDate, setTravelDate] = useState(searchParams.get("date") || "");
    const [specialRequests, setSpecialRequests] = useState("");
    const [emergencyContact, setEmergencyContact] = useState("");

    // Traveler details
    const [travelerDetails, setTravelerDetails] = useState([]);

    // Coupon state
    const [couponCode, setCouponCode] = useState("");
    const [couponApplied, setCouponApplied] = useState(null);
    const [couponError, setCouponError] = useState("");
    const [couponLoading, setCouponLoading] = useState(false);

    // Loyalty points
    const [loyaltyPoints, setLoyaltyPoints] = useState(0);
    const [useLoyaltyPoints, setUseLoyaltyPoints] = useState(false);
    const [pointsToUse, setPointsToUse] = useState(0);

    // bKash payment
    const [bkashNumber, setBkashNumber] = useState("");
    const [bkashOtp, setBkashOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [paymentStep, setPaymentStep] = useState(1); // 1: details, 2: otp, 3: processing

    // Terms
    const [agreeTerms, setAgreeTerms] = useState(false);

    // Payment type
    const [paymentType, setPaymentType] = useState("full"); // full or partial

    // Processing state
    const [processing, setProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [bookingId, setBookingId] = useState(null);

    // Format price
    const formatPrice = (price) => {
        if (!price) return "0";
        return parseFloat(price).toLocaleString("en-BD");
    };

    // Calculate pricing - single traveler
    const calculatePricing = () => {
        const basePrice = parseFloat(packageInfo?.base_price) || 0;
        const totalTravelers = 1;

        const subtotal = basePrice;

        // Coupon discount
        let couponDiscount = 0;
        if (couponApplied) {
            if (couponApplied.discount_type === "percentage") {
                couponDiscount = (subtotal * couponApplied.discount_value) / 100;
                if (couponApplied.max_discount && couponDiscount > couponApplied.max_discount) {
                    couponDiscount = couponApplied.max_discount;
                }
            } else {
                couponDiscount = couponApplied.discount_value;
            }
        }

        // Loyalty points discount (1 point = 1 BDT)
        const loyaltyDiscount = useLoyaltyPoints ? Math.min(pointsToUse, loyaltyPoints) : 0;

        // Tax (0%)
        const taxableAmount = subtotal - couponDiscount - loyaltyDiscount;
        const tax = 0;

        // Service fee
        const serviceFee = 0;

        // Grand total
        const grandTotal = Math.max(0, taxableAmount + tax + serviceFee);

        // Partial payment (50%)
        const partialAmount = grandTotal * 0.5;

        return {
            basePrice,
            subtotal,
            couponDiscount,
            loyaltyDiscount,
            tax,
            serviceFee,
            grandTotal,
            partialAmount,
            payableAmount: paymentType === "partial" ? partialAmount : grandTotal,
        };
    };

    // Fetch package details
    useEffect(() => {
        const fetchPackageDetails = async () => {
            try {
                setLoading(true);

                // Fetch package info
                const resPackage = await api.get(`/package/packages/${packageId}`);
                const pkg = resPackage.data?.data;
                if (!pkg) throw new Error("Package not found");
                setPackageInfo(pkg);

                // Set travel date from package if not provided
                if (!travelDate && pkg.Start_Date) {
                    setTravelDate(pkg.Start_Date.split("T")[0]);
                }

                // Fetch destinations
                const resDest = await api.get(`/packageDestination/package/${packageId}`);
                const packageDestinations = resDest.data?.data || [];

                if (packageDestinations.length > 0) {
                    const destPromises = packageDestinations.map(async (pd) => {
                        const resDestDetails = await api.get(`/destination/destinations/${pd.destination_id}`);
                        return resDestDetails.data?.destination || {};
                    });
                    const destinationsData = await Promise.all(destPromises);
                    setDestinations(destinationsData);
                }

                // Fetch services
                const resServices = await api.get(`/service/package/${packageId}`);
                const packageServices = resServices.data?.data || [];

                const hotels = packageServices.filter((s) => s.service_type === "hotel");
                const transports = packageServices.filter((s) => s.service_type === "transport");
                const guides = packageServices.filter((s) => s.service_type === "guide");

                setServices({ hotels, transports, guides });

                // Fetch user's loyalty points if logged in
                if (user?.user_id) {
                    try {
                        const token = localStorage.getItem('token');
                        const resLoyalty = await api.get(`/loyalty/balance/${user.user_id}`, {
                            headers: { Authorization: `Bearer ${token}` },
                        });
                        setLoyaltyPoints(resLoyalty.data?.data?.current_balance || 0);
                    } catch (err) {
                        console.log("Could not fetch loyalty points");
                    }
                }
            } catch (err) {
                console.error(err);
                setError("Failed to fetch package details.");
            } finally {
                setLoading(false);
            }
        };

        fetchPackageDetails();
    }, [packageId, user]);

    // Initialize single traveler details
    useEffect(() => {
        setTravelerDetails([{
            name: user?.full_name || "",
            nid: "",
            phone: user?.phone || "",
            email: user?.email || "",
            type: "adult",
        }]);
    }, [user]);

    // Apply coupon
    const applyCoupon = async () => {
        if (!couponCode.trim()) {
            setCouponError("Please enter a coupon code");
            return;
        }

        setCouponLoading(true);
        setCouponError("");

        try {
            const res = await api.get(`/coupon/code/${couponCode.trim().toUpperCase()}`);
            if (res.data?.success && res.data?.coupon) {
                const coupon = res.data.coupon;
                const pricing = calculatePricing();

                // Check minimum order
                if (coupon.min_order && pricing.subtotal < coupon.min_order) {
                    setCouponError(`Minimum order amount is ৳${formatPrice(coupon.min_order)}`);
                    return;
                }

                setCouponApplied(coupon);
                setCouponError("");
            } else {
                setCouponError("Invalid or expired coupon code");
            }
        } catch (err) {
            setCouponError(err.response?.data?.message || "Invalid coupon code");
        } finally {
            setCouponLoading(false);
        }
    };

    // Remove coupon
    const removeCoupon = () => {
        setCouponApplied(null);
        setCouponCode("");
        setCouponError("");
    };

    // Send bKash OTP (simulated)
    const sendBkashOtp = () => {
        if (!bkashNumber || bkashNumber.length !== 11) {
            alert("Please enter a valid 11-digit bKash number");
            return;
        }
        setOtpSent(true);
        setPaymentStep(2);
        // Simulated OTP - in real implementation, call bKash API
        alert(`OTP sent to ${bkashNumber}. For demo, use OTP: 123456`);
    };

    // Process payment
    const processPayment = async () => {
        // Validation
        if (!agreeTerms) {
            alert("Please agree to the terms and conditions");
            return;
        }

        if (!bkashNumber || bkashNumber.length !== 11) {
            alert("Please enter a valid bKash number");
            return;
        }

        if (!bkashOtp || bkashOtp.length !== 6) {
            alert("Please enter the 6-digit OTP");
            return;
        }

        // Validate traveler details
        const traveler = travelerDetails[0];
        if (!traveler?.name?.trim()) {
            alert("Please enter your full name");
            return;
        }
        if (!traveler?.phone?.trim()) {
            alert("Please enter your phone number");
            return;
        }
        if (!traveler?.email?.trim()) {
            alert("Please enter your email address");
            return;
        }

        if (!user) {
            alert("Please login to continue");
            navigate("/login");
            return;
        }

        setProcessing(true);
        setPaymentStep(3);

        try {
            const pricing = calculatePricing();

            // Create booking - single traveler
            const bookingData = {
                user_id: user.user_id,
                package_id: parseInt(packageId),
                travel_date: travelDate,
                num_travelers: 1,
                adults: 1,
                children: 0,
                total_price: pricing.grandTotal,
                paid_amount: pricing.payableAmount,
                payment_type: paymentType,
                special_requests: specialRequests,
                emergency_contact: emergencyContact,
                traveler_details: JSON.stringify(travelerDetails),
                coupon_id: couponApplied?.coupon_id || null,
                coupon_discount: pricing.couponDiscount,
                loyalty_points_used: pricing.loyaltyDiscount,
                status: "confirmed",
            };

            const bookingRes = await api.post("/booking/bookings", bookingData, {
                headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
            });

            const booking = bookingRes.data?.data;

            // Create payment record
            const paymentData = {
                booking_id: booking.booking_id,
                amount: pricing.payableAmount,
                method: "bkash",
                bkash_number: bkashNumber,
                transaction_id: `BK${Date.now()}`,
                status: "completed",
            };

            await api.post("/payments/payments", paymentData, {
                headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
            });

            // Deduct loyalty points if used
            if (useLoyaltyPoints && pricing.loyaltyDiscount > 0) {
                await api.post(
                    "/loyalty/deduct",
                    {
                        user_id: user.user_id,
                        points: pricing.loyaltyDiscount,
                        description: `Used for booking #${booking.booking_id}`,
                    },
                    { headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` } }
                );
            }

            // Add loyalty points for this booking (5% of total)
            const earnedPoints = Math.floor(pricing.grandTotal * 0.05);
            if (earnedPoints > 0) {
                await api.post(
                    "/loyalty/add",
                    {
                        user_id: user.user_id,
                        points: earnedPoints,
                        description: `Earned from booking #${booking.booking_id}`,
                    },
                    { headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` } }
                );
            }

            setBookingId(booking.booking_id);
            setPaymentSuccess(true);
        } catch (err) {
            console.error("Payment error:", err);
            alert(err.response?.data?.error || "Payment failed. Please try again.");
            setPaymentStep(2);
        } finally {
            setProcessing(false);
        }
    };

    // Update traveler detail
    const updateTravelerDetail = (index, field, value) => {
        const updated = [...travelerDetails];
        updated[index][field] = value;
        setTravelerDetails(updated);
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center items-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#034D41]"></div>
                </div>
            </Layout>
        );
    }

    if (error || !packageInfo) {
        return (
            <Layout>
                <div className="text-center py-20">
                    <p className="text-red-500 text-xl">{error || "Package not found"}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="mt-4 px-6 py-2 bg-[#034D41] text-white rounded-lg"
                    >
                        Go Back
                    </button>
                </div>
            </Layout>
        );
    }

    // Payment success screen
    if (paymentSuccess) {
        return (
            <Layout>
                <div className="max-w-2xl mx-auto px-4 py-16 text-center">
                    <div className="bg-green-100 rounded-full w-24 h-24 mx-auto flex items-center justify-center mb-6">
                        <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h1>
                    <p className="text-gray-600 mb-2">Your booking has been confirmed.</p>
                    <p className="text-gray-600 mb-6">Booking ID: <strong>#{bookingId}</strong></p>

                    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 text-left">
                        <h2 className="text-xl font-bold mb-4">Booking Summary</h2>
                        <div className="space-y-2 text-gray-700">
                            <p><strong>Package:</strong> {packageInfo.name}</p>
                            <p><strong>Travel Date:</strong> {new Date(travelDate).toLocaleDateString("en-BD", { dateStyle: "long" })}</p>
                            <p><strong>Traveler:</strong> 1 Person</p>
                            <p><strong>Amount Paid:</strong> ৳{formatPrice(calculatePricing().payableAmount)}</p>
                            {paymentType === "partial" && (
                                <p className="text-orange-600"><strong>Remaining:</strong> ৳{formatPrice(calculatePricing().partialAmount)} (Due before trip)</p>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => navigate("/user/bookings")}
                            className="px-6 py-3 bg-[#034D41] text-white font-bold rounded-lg hover:bg-[#023830] transition"
                        >
                            View My Bookings
                        </button>
                        <button
                            onClick={() => window.print()}
                            className="px-6 py-3 border-2 border-[#034D41] text-[#034D41] font-bold rounded-lg hover:bg-gray-50 transition"
                        >
                            Download Invoice
                        </button>
                    </div>

                    <p className="mt-6 text-sm text-gray-500">
                        A confirmation email has been sent to your registered email address.
                    </p>
                </div>
            </Layout>
        );
    }

    const pricing = calculatePricing();

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Page Title */}
                <h1 className="text-3xl font-bold text-center mb-8">Complete Your Booking</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Side - Package Information */}
                    <div className="space-y-6">
                        {/* Package Card */}
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="relative h-48">
                                <img
                                    src={
                                        packageInfo.image
                                            ? `http://localhost:5000/uploads/${packageInfo.image}`
                                            : "https://via.placeholder.com/600x300?text=No+Image"
                                    }
                                    alt={packageInfo.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-4 right-4 bg-[#034D41] text-white px-3 py-1 rounded-full text-sm font-medium">
                                    {packageInfo.package_type || "Adventure"}
                                </div>
                            </div>

                            <div className="p-6">
                                <h2 className="text-2xl font-bold mb-2">{packageInfo.name}</h2>
                                <p className="text-gray-600 mb-4">{packageInfo.description}</p>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[#034D41]">📅</span>
                                        <span><strong>Duration:</strong> {packageInfo.duration_days} Days</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[#034D41]">💰</span>
                                        <span><strong>Base Price:</strong> ৳{formatPrice(packageInfo.base_price)}/person</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Traveler Details Form */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <span>�</span> Traveler Information
                            </h3>

                            {/* Travel Date */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-2">Travel Date</label>
                                <input
                                    type="date"
                                    value={travelDate}
                                    onChange={(e) => setTravelDate(e.target.value)}
                                    min={new Date().toISOString().split("T")[0]}
                                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#034D41]"
                                />
                            </div>

                            {/* Traveler Information */}
                            <div className="space-y-4">
                                {travelerDetails.length > 0 && (
                                    <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Full Name *</label>
                                            <input
                                                type="text"
                                                placeholder="Enter your full name"
                                                value={travelerDetails[0]?.name || ""}
                                                onChange={(e) => updateTravelerDetail(0, "name", e.target.value)}
                                                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#034D41]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Phone Number *</label>
                                            <input
                                                type="tel"
                                                placeholder="01XXXXXXXXX"
                                                value={travelerDetails[0]?.phone || ""}
                                                onChange={(e) => updateTravelerDetail(0, "phone", e.target.value)}
                                                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#034D41]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Email Address *</label>
                                            <input
                                                type="email"
                                                placeholder="your@email.com"
                                                value={travelerDetails[0]?.email || ""}
                                                onChange={(e) => updateTravelerDetail(0, "email", e.target.value)}
                                                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#034D41]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">NID / Passport (Optional)</label>
                                            <input
                                                type="text"
                                                placeholder="Enter NID or Passport number"
                                                value={travelerDetails[0]?.nid || ""}
                                                onChange={(e) => updateTravelerDetail(0, "nid", e.target.value)}
                                                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#034D41]"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Emergency Contact */}
                            <div className="mt-6">
                                <label className="block text-sm font-medium mb-2">Emergency Contact Number</label>
                                <input
                                    type="tel"
                                    placeholder="01XXXXXXXXX"
                                    value={emergencyContact}
                                    onChange={(e) => setEmergencyContact(e.target.value)}
                                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#034D41]"
                                />
                            </div>

                            {/* Special Requests */}
                            <div className="mt-6">
                                <label className="block text-sm font-medium mb-2">Special Requests (Optional)</label>
                                <textarea
                                    placeholder="Dietary requirements, accessibility needs, room preferences..."
                                    value={specialRequests}
                                    onChange={(e) => setSpecialRequests(e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#034D41]"
                                />
                            </div>
                        </div>

                        {/* Cancellation Policy */}
                        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                            <h3 className="text-lg font-bold mb-2 flex items-center gap-2 text-orange-700">
                                <span>⚠️</span> Cancellation Policy
                            </h3>
                            <ul className="text-sm text-orange-800 space-y-1">
                                <li>• Full refund if cancelled 7+ days before trip</li>
                                <li>• 50% refund if cancelled 3-7 days before trip</li>
                                <li>• No refund if cancelled less than 3 days before trip</li>
                            </ul>
                        </div>
                    </div>

                    {/* Right Side - Payment */}
                    <div className="space-y-6">
                        {/* Price Summary */}
                        <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <span>💳</span> Payment Summary
                            </h3>

                            <div className="space-y-3 text-gray-700">
                                <div className="flex justify-between">
                                    <span>Package Price (1 Person)</span>
                                    <span>৳{formatPrice(pricing.basePrice)}</span>
                                </div>
                                <div className="flex justify-between font-medium border-t pt-2">
                                    <span>Subtotal</span>
                                    <span>৳{formatPrice(pricing.subtotal)}</span>
                                </div>

                                {couponApplied && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Coupon Discount ({couponApplied.code})</span>
                                        <span>-৳{formatPrice(pricing.couponDiscount)}</span>
                                    </div>
                                )}

                                {useLoyaltyPoints && pricing.loyaltyDiscount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Loyalty Points ({pricing.loyaltyDiscount} pts)</span>
                                        <span>-৳{formatPrice(pricing.loyaltyDiscount)}</span>
                                    </div>
                                )}

                                <div className="flex justify-between">
                                    <span>Tax (5%)</span>
                                    <span>৳{formatPrice(pricing.tax)}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span>Service Fee</span>
                                    <span>৳{formatPrice(pricing.serviceFee)}</span>
                                </div>

                                <div className="flex justify-between font-bold text-xl border-t pt-3">
                                    <span>Grand Total</span>
                                    <span className="text-[#034D41]">৳{formatPrice(pricing.grandTotal)}</span>
                                </div>
                            </div>

                            {/* Payment Type Selection */}
                            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                <p className="font-medium mb-3">Payment Option</p>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="paymentType"
                                            value="full"
                                            checked={paymentType === "full"}
                                            onChange={() => setPaymentType("full")}
                                            className="w-5 h-5 text-[#034D41]"
                                        />
                                        <span>Full Payment - ৳{formatPrice(pricing.grandTotal)}</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="paymentType"
                                            value="partial"
                                            checked={paymentType === "partial"}
                                            onChange={() => setPaymentType("partial")}
                                            className="w-5 h-5 text-[#034D41]"
                                        />
                                        <span>50% Advance - ৳{formatPrice(pricing.partialAmount)}</span>
                                    </label>
                                </div>
                                {paymentType === "partial" && (
                                    <p className="text-sm text-orange-600 mt-2">
                                        Remaining ৳{formatPrice(pricing.partialAmount)} due before trip
                                    </p>
                                )}
                            </div>

                            {/* Coupon Section */}
                            <div className="mt-6">
                                <h4 className="font-medium mb-3 flex items-center gap-2">
                                    <span>🎟️</span> Apply Coupon
                                </h4>
                                {couponApplied ? (
                                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                                        <div>
                                            <span className="font-bold text-green-700">{couponApplied.code}</span>
                                            <span className="ml-2 text-green-600">
                                                {couponApplied.discount_type === "percentage"
                                                    ? `${couponApplied.discount_value}% off`
                                                    : `৳${couponApplied.discount_value} off`}
                                            </span>
                                        </div>
                                        <button onClick={removeCoupon} className="text-red-500 hover:text-red-700">
                                            ✕ Remove
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Enter coupon code"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#034D41]"
                                        />
                                        <button
                                            onClick={applyCoupon}
                                            disabled={couponLoading}
                                            className="px-4 py-2 bg-[#034D41] text-white rounded-lg hover:bg-[#023830] disabled:opacity-50"
                                        >
                                            {couponLoading ? "..." : "Apply"}
                                        </button>
                                    </div>
                                )}
                                {couponError && <p className="text-red-500 text-sm mt-2">{couponError}</p>}
                            </div>

                            {/* Loyalty Points Section */}
                            {user && loyaltyPoints > 0 && (
                                <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={useLoyaltyPoints}
                                            onChange={(e) => setUseLoyaltyPoints(e.target.checked)}
                                            className="w-5 h-5"
                                        />
                                        <div>
                                            <p className="font-medium">Use Loyalty Points</p>
                                            <p className="text-sm text-gray-600">
                                                Available: <strong>{loyaltyPoints}</strong> points (৳{loyaltyPoints})
                                            </p>
                                        </div>
                                    </label>
                                    {useLoyaltyPoints && (
                                        <div className="mt-3">
                                            <input
                                                type="number"
                                                min={0}
                                                max={Math.min(loyaltyPoints, pricing.subtotal)}
                                                value={pointsToUse}
                                                onChange={(e) => setPointsToUse(Math.min(parseInt(e.target.value) || 0, loyaltyPoints))}
                                                placeholder="Points to use"
                                                className="w-full px-4 py-2 border rounded-lg"
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* bKash Payment */}
                            <div className="mt-6">
                                <h4 className="font-medium mb-3 flex items-center gap-2">
                                    <img src="https://www.logo.wine/a/logo/BKash/BKash-Icon-Logo.wine.svg" alt="bKash" className="w-8 h-8" />
                                    Pay with bKash
                                </h4>

                                <div className="space-y-4">
                                    {/* bKash Number */}
                                    <div>
                                        <label className="block text-sm mb-2">bKash Account Number</label>
                                        <input
                                            type="tel"
                                            placeholder="01XXXXXXXXX"
                                            value={bkashNumber}
                                            onChange={(e) => setBkashNumber(e.target.value.replace(/\D/g, "").slice(0, 11))}
                                            disabled={paymentStep > 1}
                                            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:bg-gray-100"
                                        />
                                    </div>

                                    {/* Send OTP Button */}
                                    {paymentStep === 1 && (
                                        <button
                                            onClick={sendBkashOtp}
                                            className="w-full py-3 bg-pink-600 text-white font-bold rounded-lg hover:bg-pink-700 transition"
                                        >
                                            Send OTP
                                        </button>
                                    )}

                                    {/* OTP Input */}
                                    {paymentStep >= 2 && (
                                        <div>
                                            <label className="block text-sm mb-2">Enter OTP</label>
                                            <input
                                                type="text"
                                                placeholder="6-digit OTP"
                                                value={bkashOtp}
                                                onChange={(e) => setBkashOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                                disabled={paymentStep === 3}
                                                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:bg-gray-100"
                                            />
                                            <p className="text-sm text-gray-500 mt-1">
                                                OTP sent to {bkashNumber}. <button onClick={() => setPaymentStep(1)} className="text-pink-600 underline">Change number</button>
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Terms & Conditions */}
                            <div className="mt-6">
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={agreeTerms}
                                        onChange={(e) => setAgreeTerms(e.target.checked)}
                                        className="w-5 h-5 mt-0.5"
                                    />
                                    <span className="text-sm text-gray-600">
                                        I agree to the{" "}
                                        <a href="/terms" target="_blank" className="text-[#034D41] underline">
                                            Terms & Conditions
                                        </a>{" "}
                                        and{" "}
                                        <a href="/privacy" target="_blank" className="text-[#034D41] underline">
                                            Privacy Policy
                                        </a>
                                    </span>
                                </label>
                            </div>

                            {/* Pay Now Button */}
                            <button
                                onClick={processPayment}
                                disabled={processing || !agreeTerms || paymentStep < 2}
                                className="w-full mt-6 py-4 bg-[#034D41] text-white font-bold text-lg rounded-lg hover:bg-[#023830] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {processing ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        🔒 Pay ৳{formatPrice(pricing.payableAmount)}
                                    </>
                                )}
                            </button>

                            {/* Security Badge */}
                            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
                                <span>🔐</span>
                                <span>Secure Payment • SSL Encrypted</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default PaymentPage;
