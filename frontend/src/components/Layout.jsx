import React from "react";
import { Header, Footer } from ".";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ModalProvider } from "./ui/modal";
import { CartDrawer } from "@/modules/cart";

function Layout() {

  return (
    <ModalProvider>
      <div className="flex flex-col h-screen overflow-hidden">
        <Header />
        <div className="flex-1 overflow-hidden">
          <Outlet />
        </div>
      </div>
      <CartDrawer />
        <ToastContainer
          position="top-right"
          autoClose={500}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />

    </ModalProvider>
  );
}

export default Layout;
