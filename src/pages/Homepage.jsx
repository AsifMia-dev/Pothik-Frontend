import React from "react";
import Layout from "../components/Layout";
import Hero from "../components/HomeComponents/Hero";
import TopDestination from "../components/HomeComponents/TopDestination";
import HeroBlog from "../components/HomeComponents/Heroblog";

const Homepage = () => {
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
