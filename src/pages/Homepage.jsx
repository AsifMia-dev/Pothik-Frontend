import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import Hero from "../components/HomeComponents/Hero";
import TopDestination from "../components/HomeComponents/TopDestination";
import HeroBlog from "../components/HomeComponents/Heroblog";
import ReviewSection from "../components/HomeComponents/ReviewSection";

const Homepage = () => {
  const location = useLocation();
  const [toast, setToast] = useState(null);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const notice = sessionStorage.getItem("paymentSuccessNotice");
    if (!notice) return;

    try {
      const parsed = JSON.parse(notice);
      setToast(parsed);
    } finally {
      sessionStorage.removeItem("paymentSuccessNotice");
    }
  }, [location.pathname]);

  // Auto-dismiss after 4s
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setClosing(true);
      setTimeout(() => { setToast(null); setClosing(false); }, 400);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const dismissToast = () => {
    setClosing(true);
    setTimeout(() => { setToast(null); setClosing(false); }, 400);
  };

  return (
    <Layout>
      {/* ── Payment Success Toast ── */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: 24,
            right: 24,
            zIndex: 9999,
            animation: closing
              ? "toastOut .4s ease forwards"
              : "toastIn .45s cubic-bezier(.16,1,.3,1) forwards",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: "#fff",
              border: "1px solid #d1fae5",
              borderRadius: 14,
              padding: "14px 20px",
              boxShadow: "0 8px 30px rgba(0,0,0,.12)",
              minWidth: 280,
              maxWidth: 360,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Green check icon */}
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #34d399, #059669)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M6 10l3 3 5-6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#065f46" }}>
                Payment Successful! 🎉
              </p>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: "#6b7280" }}>
                {toast.tranId && toast.tranId !== "-"
                  ? `TXN: ${toast.tranId}`
                  : "Your booking is confirmed."}
              </p>
            </div>

            {/* Close button */}
            <button
              onClick={dismissToast}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#9ca3af",
                fontSize: 18,
                lineHeight: 1,
                padding: 2,
              }}
            >
              ✕
            </button>

            {/* Progress bar */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                height: 3,
                background: "linear-gradient(90deg, #34d399, #059669)",
                borderRadius: "0 0 14px 14px",
                animation: "toastProgress 4s linear forwards",
              }}
            />
          </div>

          <style>{`
            @keyframes toastIn {
              from { opacity: 0; transform: translateX(60px) scale(.95); }
              to   { opacity: 1; transform: translateX(0) scale(1); }
            }
            @keyframes toastOut {
              from { opacity: 1; transform: translateX(0) scale(1); }
              to   { opacity: 0; transform: translateX(60px) scale(.95); }
            }
            @keyframes toastProgress {
              from { width: 100%; }
              to   { width: 0%; }
            }
          `}</style>
        </div>
      )}

      <div>
        <Hero />
        <TopDestination />
        <HeroBlog />
        <ReviewSection/>
      </div>
    </Layout>
  );
};

export default Homepage;

