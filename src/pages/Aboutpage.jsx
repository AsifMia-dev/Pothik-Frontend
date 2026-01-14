import React from "react";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";

const AboutPage = () => {
  return (
    <Layout>
      <main className="flex-1">

        {/* ================= Hero Section ================= */}
        <section className="bg-card-light dark:bg-card-dark">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

              {/* Text */}
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter">
                  We are POTHIK, your guide to the unseen.
                </h1>

                <p className="mt-6 text-lg text-slate-600 dark:text-slate-400">
                  Founded by a group of passionate travelers, POTHIK was born from
                  a simple yet powerful idea: to make discovering hidden gems
                  accessible to everyone.
                </p>

                <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                  Our mission is to craft unforgettable travel experiences that
                  go beyond the ordinary and connect travelers with authentic
                  cultures and landscapes.
                </p>

                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  <Link to = "/contact">
                  <button className="h-11 px-6 rounded-lg bg-slate-100 dark:bg-slate-700 font-bold hover:bg-slate-200 dark:hover:bg-slate-600">
                    Contact Us
                  </button>
                  </Link>
                </div>
              </div>

              {/* Images */}
              <div className="grid grid-cols-2 gap-4">
                <ImageCard
                  className="col-span-2"
                  url="https://lh3.googleusercontent.com/aida-public/AB6AXuB6gP3Bx9gtr4CJ_7hzWeFUrNB4DQBfFivr5I4WJXZlopp36wxlvfgZDjcYkQ3BttQa6JNdjufwn1tTwfFDq_KBnbOJFpLOE4CmF9qPyLbolr0TkbDRTk8bTK2wv-g7QxZPsvVEAZwpA-e_JEEfii3LiUit4vha7_0jtGpso2mRnKhd77zQjXZpJu_P1ADwsWPbDFuZH-lXcpXBfd1D1Oc7vhOS4v83PYm8bFqAJ8I94OWrww2mqKcmOu2_IX09OeeXcU-oolEc_2nj"
                />
                <ImageCard url="https://lh3.googleusercontent.com/aida-public/AB6AXuDGy3y526HyJtkm14lAKEVjDuDE-7sjkNEU2TlfenJUa72pewz9w_2FHJCMcOBhMcA6I7Dqbk7PQkQ0YUYkfqghlZqclpfDUdFa0SLn2XL2YDYgHSIfO40R6V8HdAYlV8Z6feGMLwCikBHY-kH9cwifkT9kSAoOooLbIyg8pIyACb3IfKawmRsWEbaRfgRDESjnjBTvEMO5M2Qkm00GYTOiSDG9wipVQEQlMJyu18eLkN8K2JPs6D75h76RXcDRq6a3a2z1nKZGvEu2" />
                <ImageCard url="https://lh3.googleusercontent.com/aida-public/AB6AXuDeCD2KIXs--rwqcsneg7H2a_b84QMTcKpvtuEaMw0GP85MCZcTREb9Yfh79MybTymEGbaxbOEYRiLglZfIOtbKazUlHfEJgi6Nd_Js4Drn8yr4BOPTAux9ravbTpbu1G3yer-oPc5mlBOzmyWwiunaZpF1zQCSZxh5Rzas3TaiQsEjJnFpEXqNBJ7OR9GUiXTh_iPT1uJ8Ar3OsHGeStlE-U6EZYu6R3xXEfWszK_kyOSdsyJs1bBjNOZL_H1li5G_aDVlLaD0XAiq" />
              </div>

            </div>
          </div>
        </section>

        {/* ================= Team Section ================= */}
        <section className="py-16 bg-slate-50 dark:bg-background-dark/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">
                Meet Our Passionate Team
              </h2>
              <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
                A group of explorers and planners dedicated to your journey.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <TeamCard
                name="Md. Foysal Hossain Khan"
                role="Founder & CEO"
                text="The driving force behind POTHIK."
                img="https://lh3.googleusercontent.com/aida-public/AB6AXuCMxNBbMyc-VLn6j4qAaY2fG-baGVI8ieNBolBJ3HUR1SLXFPSO80Zc8FkgDS5YdYAVD1IiWsCj5BdJAaL9GzZjej_tOh-CgFG9gRGUrwQl8sqmHDjMb-3Xe-sZZFovujYcpDVfgKQ2-oFhf2EiQeEdhcOq5Ay2F-3IbfRWRDdQNu-cZoIUXTNXTOaj1d-DUXPRMJS0hjhfJ97-P0Iw0Szftjllw0yHv53UdSzC_m3NNnjEdP7jMkMmJueg95qUAT3QrNrkyT7gKuJm"
              />
              <TeamCard
                name="Md Ibrahim Zihad"
                role="Head of Operations"
                text="Ensures seamless and safe journeys."
                img="https://lh3.googleusercontent.com/aida-public/AB6AXuC2iEl0og1ZoNsuAwZHVt3TSchJ8reaybS2b27R-4VmcG1HX0REx3nrAzKhAVAMT3lOA6SuZiALANukheO0ZzBuYMLrPnTQg_76mL9ahYDQcbUADB0EO1nfLNaUnH0bJrNkUSm7HCaF3ji6Hk5iIDhDviW8XLDl4fL2jozh9WChR29jHXaIrR2aUN0-WpvcvwC_CgnitD74PMAQw1pR-PusQ1_rdCAChBSaNrvwnnAVkB9B8d3cHGMXCoOdFOdEPbuQJE_bHfTyvRlc"
              />
              <TeamCard
                name="Asif Mia"
                role="Lead Travel Consultant"
                text="Creates personalized travel itineraries."
                img="https://lh3.googleusercontent.com/aida-public/AB6AXuDVXKr4uMdA647tm6s3fTnrz8WMtwcBLOLeUq3LWafJiEQevYyY09BduDXxBxNdNpn_1Ns6OK8OYmfCC5fwzpSkWmZSH-frz1VMMtglT8j_-1EaydsovlC4FKCxzenRcbrvoCSw2WADau8D4ezAgnF9YHy3jNgkEHG9pnvBMQLIFWxfC1z4r5vk7nLePJwYgSzjCNCZVpE1ZVL5iRXdY701Q4HJ1sxHvSnaD7ez0hU0OdLR1TmXsKHq7IdsB3NvLZkqzMSdoFxfJGnF"
              />
              <TeamCard
                name="Tarun Chandra Das"
                role="Marketing Director"
                text="Connects travelers with inspiring stories."
                img="https://lh3.googleusercontent.com/aida-public/AB6AXuCJLOQKERBPuHymf9WhhRGyZN4LkznQcwfrf6ZEarTnX5RrbHdYhANiwuOyyk759qYTCA58CivEZkpZp0wkIMpMp0T6CsitP2Sqwa_6hdQr3drnxRmUHSgNV3ECLGLVUfaTgBguCiJSZj-SWEJNgfwHBIaYWjdNIkRq-srxLg_iv1mlpL7lrh-UN8o8LuTRNdAUC5e39m-q0e2mZl7zTYz3Kkr5RXdnarPqJNtG865an2_I39zwgTLv0JEt_Ov-8IpNLc7OEmDiJ7Wf"
              />
            </div>
          </div>
        </section>

      </main>
    </Layout>
  );
};

export default AboutPage;

/* ================= Reusable Components ================= */

const ImageCard = ({ url, className = "" }) => (
  <div
    className={`aspect-square rounded-xl bg-cover bg-center ${className}`}
    style={{ backgroundImage: `url(${url})` }}
  />
);

const TeamCard = ({ img, name, role, text }) => (
  <div className="flex flex-col items-center text-center">
    <div
      className="w-40 h-40 rounded-full bg-cover bg-center"
      style={{ backgroundImage: `url(${img})` }}
    />
    <h3 className="mt-6 text-xl font-bold">{name}</h3>
    <p className="text-primary">{role}</p>
    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{text}</p>
  </div>
);
