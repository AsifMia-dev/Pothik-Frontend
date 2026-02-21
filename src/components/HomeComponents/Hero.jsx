import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import api from "../../Helper/baseUrl.helper";

function Hero() {
  const [destinations, setDestinations] = useState([]);
  const [spots, setSpots] = useState([]);
  const [transports, setTransports] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState("");

  // Fetch Destinations
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await api.get("/destination/destinations");
        setDestinations(res.data?.destinations || []);
      } catch (error) {
        console.error("Failed to fetch destinations:", error);
      }
    };
    fetchDestinations();
  }, []);

  // Fetch Transports
  useEffect(() => {
    const fetchTransports = async () => {
      try {
        const res = await api.get("/transport/transports");
        const TransportData = res.data?.transports || [];
        const TransportInfo = TransportData.map(({ User, ...rest }) => rest);
        console.log(TransportInfo);
        setTransports(TransportInfo);
      } catch (error) {
        console.error("Failed to fetch transports:", error);
      }
    };
    fetchTransports();
  }, []);

  // Fetch Hotels
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await api.get("/hotel/hotels");
        setHotels(res.data?.hotels || []);
        console.log(res.data?.hotels)
      } catch (error) {
        console.error("Failed to fetch hotels:", error);
      }
    };
    fetchHotels();
  }, []);

  // Fetch Spots when Destination changes
  useEffect(() => {
    if (!selectedDestination) return;

    const fetchSpots = async () => {
      try {
        const res = await api.get(
          `/destination/destinations/${selectedDestination}/spots`
        );
        setSpots(res.data?.spots || []);
        console.log(res.data?.spots);
      } catch (error) {
        console.error("Failed to fetch spots:", error);
      }
    };

    fetchSpots();
  }, [selectedDestination]);

  return (
     <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuB5BIX2yeq6Qvb68B08qnvlwOko1zIJnEey375A-tVxHalvpOnDIvtDMHw0ZSn6KZZpM8WjbzyiymYByo4qWlJNjUaSHWht0fXvykPMh48VLMph27NElGxmUjz3pZmUxxW2kBd7MB2Xs7_eX3XcIyRAw2pryr01n-y6fKPfxVsLFX7Btk-ow79nqzGw77sCV2Ur2fgwgaxO6ICeFzEfOUi3lXhjH9jt81khiaz0JMR7xMje3B-HDM2aDte8KGm7TWb_vuFtu4WXarm4")`,
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 text-center text-white px-6 max-w-3xl">
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
          Your next adventure,
          <br />
          <span className="text-teal-400">reimagined.</span>
        </h1>

        {/* CTA Button */}
        <button
          className="
            mt-10
            inline-flex items-center gap-3
            bg-gradient-to-r from-teal-500 to-blue-600
            text-white
            text-lg font-semibold
            px-12 py-4
            rounded-2xl
            shadow-xl
            transition-all duration-300 ease-in-out
            hover:-translate-y-1
            hover:shadow-2xl
            hover:cursor-pointer
            active:scale-95
          "
        >
          Start Custom Planning
          <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 "/>
        </button>

        <p className="mt-6 text-sm tracking-widest text-gray-200 uppercase">
          Powered by Pothik
        </p>

      </div>
    </section>

  );
}

export default Hero;
