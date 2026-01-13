import React from 'react';

function Hero() {
  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="@container">
        <div className="p-0 sm:p-4">
          <div
            className="flex min-h-[520px] flex-col gap-6 bg-cover bg-center bg-no-repeat rounded-xl sm:gap-8 items-center justify-center p-4 text-center"
            style={{
              backgroundImage:
                'linear-gradient(rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.5) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuB5BIX2yeq6Qvb68B08qnvlwOko1zIJnEey375A-tVxHalvpOnDIvtDMHw0ZSn6KZZpM8WjbzyiymYByo4qWlJNjUaSHWht0fXvykPMh48VLMph27NElGxmUjz3pZmUxxW2kBd7MB2Xs7_eX3XcIyRAw2pryr01n-y6fKPfxVsLFX7Btk-ow79nqzGw77sCV2Ur2fgwgaxO6ICeFzEfOUi3lXhjH9jt81khiaz0JMR7xMje3B-HDM2aDte8KGm7TWb_vuFtu4WXarm4")',
            }}
          >
            <div className="flex flex-col gap-2">
              <h1 className="text-white text-4xl font-black leading-tight tracking-tight sm:text-6xl">
                Discover Your Next Adventure
              </h1>
              <p className="text-white/90 text-base font-normal leading-normal sm:text-lg">
                Curated travel packages for the modern explorer
              </p>
            </div>
            <div className="w-full max-w-2xl mt-4">
              <div className="bg-white/90 dark:bg-gray-900/90 p-2 rounded-xl backdrop-blur-sm shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <input
                    className="form-input w-full rounded-lg border-gray-300 bg-white   placeholder:text-gray-500"
                    placeholder="Destination"
                    type="text"
                  />
                  <input
                    className="form-input w-full rounded-lg border-gray-300 bg-white   placeholder:text-gray-500"
                    type="date"
                  />
                  <button className="w-full flex items-center justify-center rounded-lg h-12 px-5 bg-orange-500 text-white text-base font-bold hover:opacity-90 transition-opacity hover:cursor-pointer">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <span className="truncate">Search</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
export default Hero