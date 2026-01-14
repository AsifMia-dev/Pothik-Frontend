import React from "react";
import Layout from "../components/Layout";

const PrivacyPolicy = () => {
  return (
    <Layout>
      <main className="flex-1">

        {/* ================= Hero Section ================= */}
        <section className="bg-card-light dark:bg-card-dark">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter">
              Privacy Policy
            </h1>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information when you use POTHIK.
            </p>
          </div>
        </section>

        {/* ================= Privacy Policy Content ================= */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            
            <div className="space-y-8">

              {/* Section 1 */}
              <div>
                <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
                <p className="text-slate-600 dark:text-slate-400">
                  We collect personal information such as name, email, and booking details when you use our services. We also collect non-personal data like browser type and usage patterns.
                </p>
              </div>

              {/* Section 2 */}
              <div>
                <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Your information is used to provide and improve our services, communicate with you, process bookings, and personalize your experience.
                </p>
              </div>

              {/* Section 3 */}
              <div>
                <h2 className="text-2xl font-bold mb-4">3. Data Sharing & Security</h2>
                <p className="text-slate-600 dark:text-slate-400">
                  We do not sell your personal information. We may share data with trusted partners to provide services or comply with legal obligations. We implement security measures to protect your data.
                </p>
              </div>

              {/* Section 4 */}
              <div>
                <h2 className="text-2xl font-bold mb-4">4. Cookies & Tracking</h2>
                <p className="text-slate-600 dark:text-slate-400">
                  POTHIK uses cookies and similar technologies to enhance website functionality and analyze usage. You can manage cookie preferences in your browser.
                </p>
              </div>

              {/* Section 5 */}
              <div>
                <h2 className="text-2xl font-bold mb-4">5. User Rights</h2>
                <p className="text-slate-600 dark:text-slate-400">
                  You can request access, correction, or deletion of your personal information. Contact us via our support channels for assistance.
                </p>
              </div>

              {/* Section 6 */}
              <div>
                <h2 className="text-2xl font-bold mb-4">6. Policy Updates</h2>
                <p className="text-slate-600 dark:text-slate-400">
                  We may update this Privacy Policy from time to time. Continued use of our services constitutes acceptance of the updated policy.
                </p>
              </div>

            </div>
          </div>
        </section>

      </main>
    </Layout>
  );
};

export default PrivacyPolicy;
