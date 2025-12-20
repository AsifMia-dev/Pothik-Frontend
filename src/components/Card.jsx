import React, { useState } from "react";
import Card from "./Card";

const DestinationExplorer = () => {
  const [search, setSearch] = useState("");

  const destinations = [
    {
      title: "Boga Lake",
      location: "Bandarban, Chittagong",
      description: "A breathtaking natural lake surrounded by lush green hills.",
      rating: 4.8,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDGy3y526HyJtkm14lAKEVjDuDE-7sjkNEU2TlfenJUa72pewz9w_2FHJCMcOBhMcA6I7Dqbk7PQkQ0YUYkfqghlZqclpfDUdFa0SLn2XL2YDYgHSIfO40R6V8HdAYlV8Z6feGMLwCikBHY-kH9cwifkT9kSAoOooLbIyg8pIyACb3IfKawmRsWEbaRfgRDESjnjBTvEMO5M2Qkm00GYTOiSDG9wipVQEQlMJyu18eLkN8K2JPs6D75h76RXcDRq6a3a2z1nKZGvEu2",
    },
    {
      title: "Sajek Valley",
      location: "Rangamati, Chittagong",
      description:
        "Known as the Kingdom of Clouds, offering stunning panoramic views.",
      rating: 4.9,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuB6gP3Bx9gtr4CJ_7hzWeFUrNB4DQBfFivr5I4WJXZlopp36wxlvfgZDjcYkQ3BttQa6JNdjufwn1tTwfFDq_KBnbOJFpLOE4CmF9qPyLbolr0TkbDRTk8bTK2wv-g7QxZPsvVEAZwpA-e_JEEfii3LiUit4vha7_0jtGpso2mRnKhd77zQjXZpJu_P1ADwsWPbDFuZH-lXcpXBfd1D1Oc7vhOS4v83PYm8bFqAJ8I94OWrww2mqKcmOu2_IX09OeeXcU-oolEc_2nj",
    },
    {
      title: "Patenga Sea Beach",
      location: "Chittagong City",
      description:
        "A popular urban beach perfect for evening strolls and snacks.",
      rating: 4.5,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDeCD2KIXs--rwqcsneg7H2a_b84QMTcKpvtuEaMw0GP85MCZcTREb9Yfh79MybTymEGbaxbOEYRiLglZfIOtbKazUlHfEJgi6Nd_Js4Drn8yr4BOPTAux9ravbTpbu1G3yer-oPc5mlBOzmyWwiunaZpF1zQCSZxh5Rzas3TaiQsEjJnFpEXqNBJ7OR9GUiXTh_iPT1uJ8Ar3OsHGeStlE-U6EZYu6R3xXEfWszK_kyOSdsyJs1bBjNOZL_H1li5G_aDVlLaD0XAiq",
    },
  ];

  const filteredDestinations = destinations.filter((d) =>
    d.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="rounded-lg bg-white dark:bg-card-dark p-4 border border-border-light dark:border-border-dark">
            <h2 className="font-bold mb-4">Filter Your Search</h2>

            <div className="space-y-2">
              {["Dhaka", "Chittagong", "Cox's Bazar", "Sylhet"].map(
                (district) => (
                  <div
                    key={district}
                    className="px-3 py-2 rounded-md hover:bg-primary/10 cursor-pointer"
                  >
                    {district}
                  </div>
                )
              )}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <section className="lg:col-span-3 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black">
                Explore Amazing Destinations
              </h1>
              <p className="text-slate-500 dark:text-slate-400">
                Discover places to visit in Chittagong
              </p>
            </div>

            <input
              type="text"
              placeholder="Search destinations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-card-dark px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredDestinations.map((place, index) => (
              <Card key={index} {...place} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DestinationExplorer;
