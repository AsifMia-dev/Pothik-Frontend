import NavBar from "./Layout-componets/NavBar";
import Footer from "./Layout-componets/Footer";

const Layout = ({children}) => {
  return (
    <>
      <NavBar />
        {children}
      <Footer />
    </>
  );
};

export default Layout;
