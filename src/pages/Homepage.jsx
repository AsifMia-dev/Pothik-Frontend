import React from "react";
import Layout from "../components/Layout";
import Hero from "../components/HomeComponents/Hero";
import TopDestination from "../components/HomeComponents/TopDestination";

const Homepage = () => {
  return (
    <Layout>
      <div>
        <Hero />
        <TopDestination />
      </div>
    </Layout>
  );
};

export default Homepage;
