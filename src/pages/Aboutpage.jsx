import React from "react";
import Layout from "../components/Layout";

const AboutPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <section className="max-w-5xl mx-auto space-y-10">

          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              About Pothik
            </h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Your trusted companion for exploring Bangladesh
            </p>
          </div>

          {/* Mission */}
          <div className="bg-white dark:bg-card-dark shadow-sm rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
              Our Mission
            </h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong>Pothik</strong> is a travel agency platform designed to make
              trip planning simple, reliable, and enjoyable. Our mission is to
              help travelers discover the beauty, culture, and heritage of
              Bangladesh by providing accurate information, curated destinations,
              and seamless booking experiences.
            </p>
          </div>

          {/* Vision */}
          <div className="bg-white dark:bg-card-dark shadow-sm rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
              Our Vision
            </h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              We envision Pothik as a complete digital travel solution that
              connects travelers, tour operators, and service providers on a
              single platform, promoting sustainable tourism and local businesses
              across Bangladesh.
            </p>
          </div>

          {/* What We Offer */}
          <div className="bg-white dark:bg-card-dark shadow-sm rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              What We Offer
            </h2>

            <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300">
              <li>Explore popular and hidden travel destinations</li>
              <li>Detailed destination information and travel spots</li>
              <li>Easy and secure booking process</li>
              <li>User-friendly dashboards for travelers and admins</li>
              <li>Reliable customer support and trip assistance</li>
            </ul>
          </div>

          {/* Technology */}
          <div className="bg-white dark:bg-card-dark shadow-sm rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
              Technology Behind Pothik
            </h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              Pothik is developed as part of a Final Year Design Project (FYDP)
              using modern web technologies. The frontend is built with
              <strong> React </strong> and <strong> Tailwind CSS</strong>, while
              the backend follows a RESTful architecture to ensure scalability,
              security, and performance.
            </p>
          </div>

          {/* Footer Note */}
          <div className="text-center text-slate-500 dark:text-slate-400 text-sm">
            <p>
              Pothik is an academic project developed for educational purposes.
            </p>
          </div>

        </section>
      </div>
    </Layout>
  );
};

export default AboutPage;
