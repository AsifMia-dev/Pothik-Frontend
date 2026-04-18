import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Layout from "../../components/Layout";

const statusConfig = {
    paid: {
        title: "Payment Successful",
        chipClass: "bg-green-100 text-green-700",
        panelClass: "border-green-200",
    },
    failed: {
        title: "Payment Failed",
        chipClass: "bg-red-100 text-red-700",
        panelClass: "border-red-200",
    },
    cancelled: {
        title: "Payment Cancelled",
        chipClass: "bg-amber-100 text-amber-700",
        panelClass: "border-amber-200",
    },
};

const PaymentStatus = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const status = (searchParams.get("status") || "failed").toLowerCase();
    const tranId = searchParams.get("tran_id") || "-";
    const message = searchParams.get("message") || "Payment response received.";

    const config = statusConfig[status] || statusConfig.failed;

    useEffect(() => {
        if (status === "paid") {
            sessionStorage.setItem(
                "paymentSuccessNotice",
                JSON.stringify({
                    message: "Your payment is successful.",
                    tranId,
                })
            );
            navigate("/", { replace: true });
        }
    }, [status, tranId, navigate]);

    if (status === "paid") {
        return null;
    }

    return (
        <Layout>
            <div className="min-h-[70vh] px-4 py-12 flex items-center justify-center">
                <div className={`w-full max-w-2xl bg-white rounded-2xl shadow-lg border p-8 ${config.panelClass}`}>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{config.title}</h1>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-5 ${config.chipClass}`}>
                        {status.toUpperCase()}
                    </span>

                    <p className="text-gray-700 mb-2">{message}</p>
                    <p className="text-gray-600 mb-4">Transaction ID: {tranId}</p>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => navigate("/packages")}
                            className="px-5 py-2.5 bg-[#034D41] text-white rounded-lg font-semibold hover:bg-[#023830]"
                        >
                            Browse Packages
                        </button>
                        <button
                            onClick={() => navigate("/user/bookings")}
                            className="px-5 py-2.5 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50"
                        >
                            My Bookings
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default PaymentStatus;
