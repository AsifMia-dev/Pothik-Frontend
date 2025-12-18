import Footer from './Layout-componets/Footer.jsx';
import NavBar from './Layout-componets/NavBar.jsx';
import React from 'react';

const Layout = ({ children }) => {
  return (
    <>
      <NavBar />
        <main className="mx-auto">
          {children}
        </main>
      <Footer />
    </>
  );
};
export default Layout;
