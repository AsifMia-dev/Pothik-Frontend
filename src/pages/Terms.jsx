import React from "react";
import Layout from "../components/Layout";

const Terms = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <section className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Terms & Conditions
            </h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Please read these terms carefully before using Pothik
            </p>
          </div>

          {/* Content */}
          <div className="bg-white dark:bg-card-dark shadow-sm rounded-xl p-6 space-y-6 text-slate-700 dark:text-slate-300 leading-relaxed">

            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                1. Introduction
              </h2>
              <p>
                Welcome to <strong>Pothik</strong>, a travel agency platform designed
                to help users explore destinations, plan trips, and make bookings.
                By accessing or using this website, you agree to be bound by these
                Terms & Conditions.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                2. User Responsibilities
              </h2>
              <p>
                Users are responsible for providing accurate information during
                registration and booking. Any misuse of the platform or attempt
                to provide false information may result in account suspension.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                3. Bookings & Payments
              </h2>
              <p>
                All bookings made through Pothik are subject to availability and
                confirmation. Payments, if applicable, must be completed through
                authorized payment channels. Pothik is not responsible for delays
                caused by third-party service providers.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                4. Cancellations & Refunds
              </h2>
              <p>
                Cancellation and refund policies vary depending on the service
                provider. Users are advised to review specific cancellation
                terms before making a booking.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                5. Limitation of Liability
              </h2>
              <p>
                Pothik shall not be held liable for any direct or indirect damages
                arising from the use of this platform, including but not limited
                to service interruptions, data loss, or third-party failures.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                6. Changes to Terms
              </h2>
              <p>
                Pothik reserves the right to modify these Terms & Conditions at any
                time. Continued use of the platform indicates acceptance of the
                updated terms.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                7. Contact Information
              </h2>
              <p>
                If you have any questions regarding these terms, please contact
                us through the official Pothik support channels.
              </p>
            </div>

          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Terms;
