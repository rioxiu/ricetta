import React from "react";
import Footer from "./footer";
import Navbar from "./navbar";

export const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className="">{children}</div>
      <Footer />
    </>
  );
};
