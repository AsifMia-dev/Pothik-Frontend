import React, { useState } from "react";
import Layout from "../components/Layout";

// PrimeReact components
import { Button } from "primereact/button";
import "primeicons/primeicons.css";
import "primereact/resources/themes/saga-blue/theme.css"; // theme
import "primereact/resources/primereact.min.css"; // core css

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const contactEmail = "mkhan221045@bscse.uiu.ac.bd";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Open user's mail client to send mail
    const mailtoLink = `mailto:${contactEmail}?subject=${encodeURIComponent(
      form.subject
    )}&body=${encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
    )}`;
    window.location.href = mailtoLink;
  };

  return (
    <Layout>
      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-card-light dark:bg-card-dark">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <h1 className="text-4xl font-black leading-tight tracking-tighter md:text-5xl">
              Get in Touch
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-500 dark:text-slate-400">
              We’d love to hear from you. Whether you have a question about
              features, pricing, or anything else, our team is ready to help.
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-8">
              <div className="p-6 rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark">
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                <div className="space-y-6">
                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-xl">
                      <i className="pi pi-phone" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Customer Support</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Our support team is available 24/7.
                      </p>
                      <a
                        href="tel:+1234567890"
                        className="mt-2 inline-block font-medium text-primary hover:underline"
                      >
                        01738569603
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-xl">
                      <i className="pi pi-envelope" />
                    </div>
                    <div>
                      <h3 className="font-semibold">General Inquiries</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Email us for general questions.
                      </p>
                      <a
                        href={`mailto:${contactEmail}`}
                        className="mt-2 inline-block font-medium text-primary hover:underline"
                      >
                        {contactEmail}
                      </a>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-xl">
                      <i className="pi pi-map-marker" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Our Office</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        United International University, Bangladesh
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3 p-8 rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark">
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>

              <form
                className="flex flex-col space-y-6"
                onSubmit={handleSubmit}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium">Full Name</label>
                    <input
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      value={form.name}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark py-2 px-4 focus:ring-2 focus:ring-primary outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email Address</label>
                    <input
                      name="email"
                      type="email"
                      placeholder="john.doe@example.com"
                      value={form.email}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark py-2 px-4 focus:ring-2 focus:ring-primary outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Subject</label>
                  <input
                    name="subject"
                    type="text"
                    placeholder="Booking Inquiry"
                    value={form.subject}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark py-2 px-4 focus:ring-2 focus:ring-primary outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Your Message</label>
                  <textarea
                    name="message"
                    rows="5"
                    placeholder="Please write your message here..."
                    value={form.message}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark py-2 px-4 focus:ring-2 focus:ring-primary outline-none resize-none"
                    required
                  />
                </div>

                {/* PrimeReact Button */}
                <Button
                  type="submit"
                  label="Send Message"
                  icon="pi pi-envelope"
                  iconPos="right"
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 mt-4"
                />
              </form>
            </div>
          </div>
        </div>

        {/* Google Map */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="rounded-xl overflow-hidden border border-border-light dark:border-border-dark">
            <iframe
              title="Pothik Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.531356706928!2d90.447521!3d23.797883!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7d8042caf2d%3A0x686fa3e360361ddf!2sUnited%20International%20University!5e0!3m2!1sen!2sbd!4v1705090000000!5m2!1sen!2sbd"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Contact;
