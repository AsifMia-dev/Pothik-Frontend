import Footer from './Layout-componets/Footer.jsx';
import NavBar from './Layout-componets/NavBar.jsx';
import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />

      {/* main content grows to fill available space */}
      <main className="flex-1 mx-auto w-full">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
