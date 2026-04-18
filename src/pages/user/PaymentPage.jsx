import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import Layout from "../../components/Layout";
import api from "../../Helper/baseUrl.helper";
import { AuthContext } from "../../context/AuthContext";

const getAuthToken = () => sessionStorage.getItem("token") || localStorage.getItem("token") || "";

const PaymentPage = () => {
    const { packageId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [packageInfo, setPackageInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [travelDate, setTravelDate] = useState(searchParams.get("date") || "");
    const [specialRequests, setSpecialRequests] = useState("");
    const [emergencyContact, setEmergencyContact] = useState("");

    const [travelerDetails, setTravelerDetails] = useState([]);

    const [couponCode, setCouponCode] = useState("");
    const [couponApplied, setCouponApplied] = useState(null);
    const [couponError, setCouponError] = useState("");
    const [couponLoading, setCouponLoading] = useState(false);

    const [loyaltyPoints, setLoyaltyPoints] = useState(0);
    const [useLoyaltyPoints, setUseLoyaltyPoints] = useState(false);
    const [pointsToUse, setPointsToUse] = useState(0);

    const [agreeTerms, setAgreeTerms] = useState(false);
    const [paymentType, setPaymentType] = useState("full");
    const [processing, setProcessing] = useState(false);
    const [paymentError, setPaymentError] = useState("");

    const formatPrice = (price) => {
        if (!price) return "0";
        return parseFloat(price).toLocaleString("en-BD");
    };

    const calculatePricing = () => {
        const basePrice = parseFloat(packageInfo?.base_price) || 0;
        const subtotal = basePrice;

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

        const loyaltyDiscount = useLoyaltyPoints && pointsToUse >= 50 ? Math.min(pointsToUse, loyaltyPoints) : 0;
        const taxableAmount = subtotal - couponDiscount - loyaltyDiscount;
        const tax = 0;
        const serviceFee = 0;
        const grandTotal = Math.max(0, taxableAmount + tax + serviceFee);
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

    useEffect(() => {
        const fetchPackageDetails = async () => {
            try {
                setLoading(true);
                setError(null);

                const resPackage = await api.get(`/package/packages/${packageId}`);
                const pkg = resPackage.data?.data;
                if (!pkg) throw new Error("Package not found");
                setPackageInfo(pkg);

                if (!travelDate && pkg.Start_Date) {
                    setTravelDate(pkg.Start_Date.split("T")[0]);
                }

                if (user?.user_id) {
                    try {
                        const token = getAuthToken();
                        const resLoyalty = await api.get(`/loyalty/balance/${user.user_id}`, {
                            headers: token ? { Authorization: `Bearer ${token}` } : {},
                        });
                        setLoyaltyPoints(resLoyalty.data?.data?.current_balance || 0);
                    } catch {
                        setLoyaltyPoints(0);
                    }
                }
            } catch (err) {
                setError(err?.response?.data?.error || "Failed to fetch package details.");
            } finally {
                setLoading(false);
            }
        };

        fetchPackageDetails();
    }, [packageId, user, travelDate]);

    useEffect(() => {
        setTravelerDetails([
            {
                name: user?.full_name || "",
                nid: "",
                phone: user?.phone || "",
                email: user?.email || "",
                type: "adult",
            },
        ]);
    }, [user]);

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

                if (coupon.min_order && pricing.subtotal < coupon.min_order) {
                    setCouponError(`Minimum order amount is ৳${formatPrice(coupon.min_order)}`);
                    return;
                }

                setCouponApplied(coupon);
            } else {
                setCouponError("Invalid or expired coupon code");
            }
        } catch (err) {
            setCouponError(err.response?.data?.message || "Invalid coupon code");
        } finally {
            setCouponLoading(false);
        }
    };

    const removeCoupon = () => {
        setCouponApplied(null);
        setCouponCode("");
        setCouponError("");
    };

    const updateTravelerDetail = (index, field, value) => {
        const updated = [...travelerDetails];
        updated[index][field] = value;
        setTravelerDetails(updated);
    };

    const handleProceedToPayment = async () => {
        setPaymentError("");

        if (!agreeTerms) {
            setPaymentError("Please agree to the terms and conditions.");
            return;
        }

        if (!travelDate) {
            setPaymentError("Please select a travel date.");
            return;
        }

        const traveler = travelerDetails[0];
        if (!traveler?.name?.trim() || !traveler?.phone?.trim() || !traveler?.email?.trim()) {
            setPaymentError("Traveler name, phone and email are required.");
            return;
        }

        if (!user) {
            navigate("/login");
            return;
        }

        setProcessing(true);

        try {
            const pricing = calculatePricing();
            const token = getAuthToken();
            const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

            const bookingData = {
                user_id: user.user_id,
                package_id: parseInt(packageId, 10),
                travel_date: travelDate,
                num_travelers: 1,
                adults: 1,
                children: 0,
                total_price: pricing.grandTotal,
                paid_amount: 0,
                payment_type: paymentType,
                special_requests: specialRequests,
                emergency_contact: emergencyContact,
                traveler_details: JSON.stringify(travelerDetails),
                coupon_id: couponApplied?.coupon_id || null,
                coupon_discount: pricing.couponDiscount,
                loyalty_points_used: pricing.loyaltyDiscount,
                status: "pending",
            };

            const bookingRes = await api.post("/booking/booking", bookingData, {
                headers: authHeaders,
            });

            const booking = bookingRes.data?.data;
            if (!booking?.booking_id) {
                throw new Error("Booking was created but booking id was not returned");
            }

            const paymentPayload = {
                booking_id: booking.booking_id,
                amount: Number(pricing.payableAmount).toFixed(2),
                currency: "BDT",
                customer_name: traveler.name,
                customer_email: traveler.email,
                customer_phone: traveler.phone,
                customer_address: emergencyContact || "Dhaka",
                customer_city: "Dhaka",
                customer_postcode: "1207",
                customer_country: "Bangladesh",
            };

            const paymentInit = await api.post("/payments/init", paymentPayload, {
                headers: authHeaders,
            });

            const gatewayUrl = paymentInit.data?.data?.gateway_url;
            if (!gatewayUrl) {
                throw new Error(paymentInit.data?.error || paymentInit.data?.message || "Could not start SSLCommerz payment");
            }

            if (useLoyaltyPoints && pricing.loyaltyDiscount > 0) {
                await api.post(
                    "/loyalty/deduct",
                    {
                        user_id: user.user_id,
                        points: pricing.loyaltyDiscount,
                        description: `Used for booking #${booking.booking_id}`,
                    },
                    { headers: authHeaders }
                );
            }

            sessionStorage.setItem("pendingBookingId", String(booking.booking_id));
            window.location.href = gatewayUrl;
        } catch (err) {
            const backendError = err.response?.data?.error;
            const backendDetails = err.response?.data?.details;
            const backendMessage = err.response?.data?.message;
            setPaymentError(
                backendError || backendDetails || backendMessage || err.message || "Payment initialization failed. Please try again."
            );
            setProcessing(false);
        }
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
                    <button onClick={() => navigate(-1)} className="mt-4 px-6 py-2 bg-[#034D41] text-white rounded-lg">
                        Go Back
                    </button>
                </div>
            </Layout>
        );
    }

    const pricing = calculatePricing();

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-center mb-8">Complete Your Booking</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
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
                                        <span><strong>Duration:</strong> {packageInfo.duration_days} Days</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span><strong>Base Price:</strong> ৳{formatPrice(packageInfo.base_price)}/person</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h3 className="text-xl font-bold mb-4">Traveler Information</h3>

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
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
                            <h3 className="text-xl font-bold mb-4">Payment Summary</h3>

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
                                    <span>Tax (0%)</span>
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
                            </div>

                            <div className="mt-6">
                                <h4 className="font-medium mb-3">Apply Coupon</h4>
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
                                            Remove
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

                            {user && loyaltyPoints >= 50 && (
                                <div className="mt-6">
                                    <div
                                        onClick={() => {
                                            setUseLoyaltyPoints(!useLoyaltyPoints);
                                            if (useLoyaltyPoints) setPointsToUse(0);
                                        }}
                                        className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all duration-200 ${useLoyaltyPoints ? "border-green-400 bg-green-50" : "border-gray-200 bg-gray-50 hover:border-green-300"
                                            }`}
                                    >
                                        <span className="text-sm font-medium text-gray-800">Use Loyalty Points</span>
                                        <span className="text-sm text-green-600 font-semibold">{loyaltyPoints} pts available</span>
                                    </div>

                                    {useLoyaltyPoints && (
                                        <div className="mt-3 flex items-center gap-2">
                                            <input
                                                type="number"
                                                min={50}
                                                max={Math.min(loyaltyPoints, Math.floor(pricing.subtotal))}
                                                value={pointsToUse || ""}
                                                onChange={(e) => {
                                                    const val = parseInt(e.target.value, 10) || 0;
                                                    setPointsToUse(Math.min(val, loyaltyPoints, Math.floor(pricing.subtotal)));
                                                }}
                                                placeholder={`Enter points (min 50, max ${Math.min(loyaltyPoints, Math.floor(pricing.subtotal))})`}
                                                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                                            />
                                            <span className="text-sm font-bold text-green-600 whitespace-nowrap">৳{pointsToUse || 0} off</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="mt-6 p-4 border border-[#c7e3dd] bg-[#f2fbf9] rounded-lg">
                                <h4 className="font-medium text-[#034D41] mb-1">Pay with SSLCommerz</h4>
                                <p className="text-sm text-gray-600">
                                    You will be redirected to SSLCommerz secure checkout to complete the payment.
                                </p>
                            </div>

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
                                        <a href="/terms" target="_blank" className="text-[#034D41] underline" rel="noreferrer">
                                            Terms & Conditions
                                        </a>{" "}
                                        and{" "}
                                        <a href="/privacy" target="_blank" className="text-[#034D41] underline" rel="noreferrer">
                                            Privacy Policy
                                        </a>
                                    </span>
                                </label>
                            </div>

                            {paymentError && <p className="mt-4 text-sm text-red-600">{paymentError}</p>}

                            <button
                                onClick={handleProceedToPayment}
                                disabled={processing || !agreeTerms}
                                className="w-full mt-6 py-4 bg-[#034D41] text-white font-bold text-lg rounded-lg hover:bg-[#023830] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {processing ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                        Redirecting to SSLCommerz...
                                    </>
                                ) : (
                                    <>Pay ৳{formatPrice(pricing.payableAmount)}</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default PaymentPage;
