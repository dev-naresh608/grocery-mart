import React from "react";
import { Header, Footer } from ".";
import { Outlet, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ModalProvider } from "./ui/modal";
import { CartDrawer } from "@/modules/cart";
import ScrollToTop from "./common/ScrollToTop";
import { ErrorBoundary } from "./common";

function Layout() {
  const location = useLocation();

  return (
    <ModalProvider>
      <ScrollToTop />
      <div className="flex flex-col h-screen overflow-hidden">
        <Header />
        <div className="flex-1 overflow-hidden">
          <ErrorBoundary resetKey={location.pathname}>
            <Outlet />
          </ErrorBoundary>
        </div>
      </div>
      <ErrorBoundary resetKey={location.pathname}>
        <CartDrawer />
      </ErrorBoundary>
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
