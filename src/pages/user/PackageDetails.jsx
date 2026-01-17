import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../components/Layout";
import api from "../../Helper/baseUrl.helper";

const PackageDetails = () => {
  const { id } = useParams();
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        const res = await api.get(`/packages/${id}`);
        setPackageData(res.data);
      } catch (err) {
        setError('Failed to load package details.');
      } finally {
        setLoading(false);
      }
    };

    fetchPackageDetails();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading package details...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;
  if (!packageData) return <p className="text-center mt-10">No package found.</p>;

  return (
    <Layout>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumbs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <a className="text-text-secondary dark:text-gray-400 text-sm font-medium hover:text-secondary" href="/">Home</a>
          <span className="text-text-secondary dark:text-gray-400">/</span>
          <a className="text-text-secondary dark:text-gray-400 text-sm font-medium hover:text-secondary" href="/destinations">Destinations</a>
          <span className="text-text-secondary dark:text-gray-400">/</span>
          <span className="text-text-primary dark:text-white text-sm font-medium">{packageData.title}</span>
        </div>

        {/* Header Image */}
        <div className="bg-cover bg-center flex flex-col justify-end overflow-hidden rounded-xl min-h-[400px] shadow-lg" style={{ backgroundImage: `linear-gradient(0deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 40%), url(${packageData.headerImage})` }}>
          <div className="flex flex-col p-6 md:p-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-yellow-400 !text-xl" style={{ fontVariationSettings: `'FILL' 1` }}>star</span>
              <span className="text-white font-bold">{packageData.rating}</span>
              <span className="text-gray-300 text-sm">({packageData.reviews} reviews)</span>
            </div>
            <p className="text-white tracking-tight text-3xl md:text-5xl font-bold leading-tight">{packageData.title}</p>
            <p className="text-gray-200 mt-2 text-base md:text-lg">{packageData.location} • {packageData.duration} Days / {packageData.nights} Nights</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12 mt-8 lg:mt-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="pb-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex gap-6 md:gap-8 overflow-x-auto -mb-px">
                <a className="flex flex-col items-center justify-center border-b-3 border-b-primary text-text-primary dark:text-white pb-3 pt-2" href="#">Overview</a>
                <a className="flex flex-col items-center justify-center border-b-3 border-b-transparent text-text-secondary dark:text-gray-400 pb-3 pt-2 hover:text-secondary hover:border-secondary transition-colors" href="#">Itinerary</a>
                <a className="flex flex-col items-center justify-center border-b-3 border-b-transparent text-text-secondary dark:text-gray-400 pb-3 pt-2 hover:text-secondary hover:border-secondary transition-colors" href="#">Inclusions</a>
                <a className="flex flex-col items-center justify-center border-b-3 border-b-transparent text-text-secondary dark:text-gray-400 pb-3 pt-2 hover:text-secondary hover:border-secondary transition-colors" href="#">Hotels & Transport</a>
                <a className="flex flex-col items-center justify-center border-b-3 border-b-transparent text-text-secondary dark:text-gray-400 pb-3 pt-2 hover:text-secondary hover:border-secondary transition-colors" href="#">Reviews</a>
              </div>
            </div>

            {/* Overview Content */}
            <div className="mt-8 space-y-8">
              <div>
                <h2 className="text-text-primary dark:text-white tracking-tight text-2xl font-bold leading-tight text-left pb-3">Discover the Island of Gods</h2>
                <p className="text-text-secondary dark:text-gray-300 leading-relaxed">{packageData.description}</p>
              </div>

              <div>
                <h3 className="text-text-primary dark:text-white tracking-tight text-xl font-bold leading-tight text-left pb-4">Package Highlights</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {packageData.highlights?.map((highlight, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-card-light dark:bg-card-dark rounded-xl shadow-sm">
                      <div className="flex-shrink-0 size-8 flex items-center justify-center bg-secondary/20 text-secondary rounded-full">
                        <span className="material-symbols-outlined !text-xl">{highlight.icon}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-text-primary dark:text-white">{highlight.title}</h4>
                        <p className="text-sm text-text-secondary dark:text-gray-400 mt-1">{highlight.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-text-primary dark:text-white tracking-tight text-xl font-bold leading-tight text-left pb-4">Image Gallery</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {packageData.gallery?.map((img, idx) => (
                    <div key={idx} className="bg-cover bg-center rounded-lg aspect-square" style={{ backgroundImage: `url(${img})` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Booking Card */}
          <aside className="lg:col-span-1 relative mt-10 lg:mt-0">
            <div className="sticky top-28 space-y-6">
              <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-md p-6">
                <div className="flex items-baseline mb-4">
                  <p className="text-text-secondary dark:text-gray-400 mr-1">From</p>
                  <p className="text-3xl font-bold text-text-primary dark:text-white">${packageData.price}</p>
                  <p className="text-text-secondary dark:text-gray-400 ml-1">/ person</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-text-secondary dark:text-gray-300 mb-1" htmlFor="date">Select Dates</label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="material-symbols-outlined text-text-secondary !text-xl">calendar_month</span>
                      </div>
                      <input className="form-input w-full rounded-lg border-gray-200 dark:border-gray-600 bg-background-light dark:bg-background-dark pl-10 h-12 text-text-primary dark:text-white" id="date" placeholder="Check-in - Check-out" type="text" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-text-secondary dark:text-gray-300 mb-1" htmlFor="travelers">Travelers</label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="material-symbols-outlined text-text-secondary !text-xl">group</span>
                      </div>
                      <select className="form-select w-full rounded-lg border-gray-200 dark:border-gray-600 bg-background-light dark:bg-background-dark pl-10 h-12 text-text-primary dark:text-white" id="travelers">
                        <option>2 Adults, 0 Children</option>
                        <option>1 Adult, 0 Children</option>
                        <option>2 Adults, 1 Child</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button className="w-full mt-6 flex items-center justify-center rounded-lg h-12 px-6 bg-gradient-to-r from-primary to-[#FF9A8B] text-white text-base font-bold shadow-lg hover:shadow-xl transition-shadow">
                  Book Now
                </button>

                <div className="flex justify-center gap-6 mt-4">
                  <button className="flex items-center gap-1.5 text-sm text-text-secondary dark:text-gray-400 hover:text-secondary">
                    <span className="material-symbols-outlined !text-lg">favorite_border</span> Save to Wishlist
                  </button>
                  <button className="flex items-center gap-1.5 text-sm text-text-secondary dark:text-gray-400 hover:text-secondary">
                    <span className="material-symbols-outlined !text-lg">share</span> Share
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </Layout>
  );
};

export default PackageDetails;
