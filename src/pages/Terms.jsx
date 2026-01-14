import React from "react";
import Layout from "../components/Layout";

const Terms = () => {
  return (
    <Layout>
      <main className="flex-1">

        {/* ================= Hero Section ================= */}
        <section className="bg-card-light dark:bg-card-dark">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter">
              Terms & Conditions
            </h1>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Please read these terms carefully before using POTHIK. By accessing
              our website or services, you agree to be bound by these terms.
            </p>
          </div>
        </section>

        {/* ================= Terms Content ================= */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            
            <div className="space-y-8">

              {/* Section 1 */}
              <div>
                <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
                <p className="text-slate-600 dark:text-slate-400">
                  By using POTHIK services, you acknowledge that you have read, understood,
                  and agree to these terms. If you do not agree, please refrain from using our services.
                </p>
              </div>

              {/* Section 2 */}
              <div>
                <h2 className="text-2xl font-bold mb-4">2. Use of Services</h2>
                <p className="text-slate-600 dark:text-slate-400">
                  You agree to use POTHIK for lawful purposes only and not to engage in
                  any activity that could harm the website, other users, or violate laws.
                </p>
              </div>

              {/* Section 3 */}
              <div>
                <h2 className="text-2xl font-bold mb-4">3. Booking & Payments</h2>
                <p className="text-slate-600 dark:text-slate-400">
                  All bookings and payments made through POTHIK are subject to our policies.
                  Ensure that all information provided is accurate to avoid booking issues.
                </p>
              </div>

              {/* Section 4 */}
              <div>
                <h2 className="text-2xl font-bold mb-4">4. Cancellations & Refunds</h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Cancellations and refunds are handled according to the package policies.
                  Please review the terms for each package before booking.
                </p>
              </div>

              {/* Section 5 */}
              <div>
                <h2 className="text-2xl font-bold mb-4">5. Intellectual Property</h2>
                <p className="text-slate-600 dark:text-slate-400">
                  All content, images, logos, and materials on POTHIK are the property of
                  POTHIK or its licensors. Unauthorized use is prohibited.
                </p>
              </div>

              {/* Section 6 */}
              <div>
                <h2 className="text-2xl font-bold mb-4">6. Limitation of Liability</h2>
                <p className="text-slate-600 dark:text-slate-400">
                  POTHIK is not liable for any direct or indirect damages arising from
                  the use of our services. Travel risks are assumed by the user.
                </p>
              </div>

              {/* Section 7 */}
              <div>
                <h2 className="text-2xl font-bold mb-4">7. Changes to Terms</h2>
                <p className="text-slate-600 dark:text-slate-400">
                  We may update these terms at any time. Continued use of our services
                  constitutes acceptance of the updated terms.
                </p>
              </div>

            </div>
          </div>
        </section>

      </main>
    </Layout>
  );
};

export default Terms;
