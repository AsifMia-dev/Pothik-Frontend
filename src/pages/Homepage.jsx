import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import Hero from "../components/HomeComponents/Hero";
import TopDestination from "../components/HomeComponents/TopDestination";
import HeroBlog from "../components/HomeComponents/Heroblog";

const Homepage = () => {
  const location = useLocation();

  useEffect(() => {
    const notice = sessionStorage.getItem("paymentSuccessNotice");
    if (!notice) {
      return;
    }

    try {
      const parsedNotice = JSON.parse(notice);
      window.alert(parsedNotice.message || "Your payment is successful.");
    } finally {
      sessionStorage.removeItem("paymentSuccessNotice");
    }
  }, [location.pathname]);

  return (
    <Layout>
      <div>
        <Hero />
        <TopDestination />
        <HeroBlog />
      </div>
    </Layout>
  );
};

export default Homepage;
