import React from "react";
import { Header, Footer } from "./index";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

function Layout({ productsList }) {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-1">
          <Outlet />
        </div>
        <Footer />
      </div>

    </>
  );
}

export default Layout;
