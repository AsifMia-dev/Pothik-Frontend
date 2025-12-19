import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";

const Layout = () => {
  return (
    <>
      <NavBar />
      <Outlet />   {/* THIS IS REQUIRED */}
      <Footer />
    </>
  );
};

export default Layout;
