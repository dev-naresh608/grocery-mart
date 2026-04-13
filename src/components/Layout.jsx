import React from "react";
import { Header, Footer } from "./index";
import { Outlet } from "react-router-dom";

function Layout({ productsList }) {
  

  return (
    <>
      <Header productsList={productsList} />
      <Outlet />
      <Footer />
    </>
  );
}

export default Layout;
