import React, { useState } from "react";
import { Hero, Footer, BlogSection } from "../../components";
import { bottom_banner } from "@/assets";
import Category from "./Category";
import { useSelector } from "react-redux";
import { leftPanelItems } from "@/constants/navigation";
import { Menu, X, Truck, Leaf, Coins, ShieldCheck } from "lucide-react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useNotificationToggle } from "@/modules/notification";

function Home() {
  const location = useLocation();
  const { user: currentUser, isAuthenticated: isLogin } = useSelector(
    (state) => state.auth
  );
  const guestCart = useSelector((state) => state.cart.guestCart || []);
  const { unreadCount } = useNotificationToggle();

  const cartItems = isLogin ? (currentUser?.myCart || []) : guestCart;
  const userRole = currentUser?.role || "customer";
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);

  // If user is NOT logged in: Do NOT show left panel sidebar!
  if (!isLogin) {
    if (location.pathname === "/") {
      const items = [
        {
          text: "Fastest Delivery",
          text_info: "Groceries delivered in under 30 minutes.",
          icon: <Truck size={24} />,
        },
        {
          text: "Freshness Guaranteed",
          text_info: "Fresh produce straight from the source.",
          icon: <Leaf size={24} />,
        },
        {
          text: "Affordable Prices",
          text_info: "Quality groceries at unbeatable prices.",
          icon: <Coins size={24} />,
        },
        {
          text: "Trusted by Thousands",
          text_info: "Loved by 10,000+ happy customers.",
          icon: <ShieldCheck size={24} />,
        },
      ];
      return (
        <div className="min-h-screen flex flex-col bg-white">
          <Hero />
          <Category />
          <BlogSection />
          <section className="p-5 py-10 bg-gray-50/80">
            <div className="sm:flex sm:gap-10 space-y-10 bg-blue-200 rounded-2xl p-5 sm:items-center">
              {/* left  */}
              <div className="w-auto sm:w-[60vw] md:w-[80vw]">
                <img src={bottom_banner} alt="bottom banner image" />
              </div>
              {/* right  */}
              <div className="w-full">
                <div>
                  <div className="text-green-700 text-4xl font-semibold mb-5">
                    <p>Why We Are the Best?</p>
                  </div>
                  {items.map((item, i) => {
                    return (
                      <div key={i} className="flex items-center gap-3  my-2">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-green-700 border border-green-100 shadow-sm flex-shrink-0">
                          {item.icon}
                        </div>
                        <div>
                          <p className="font-semibold text-2xl sm:text-xl md:text-xl text-[#364153]">
                            {item.text}
                          </p>
                          <p className="text-[#9c9aa4] md:text-md sm:text-sm">
                            {item.text_info}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
          <Footer />
        </div>
      );
    }

    // For public routes (/stores, /cart, /product/:id, etc.) when NOT logged in:
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
          <Outlet />
        </main>
        <Footer />
      </div>
    );
  }

  // If user IS logged in: Render Dashboard / Sidebar panel layout!
  return (
    <>
      <div>
        <div className="flex h-[calc(100vh-65px)] overflow-hidden">
          {/* left panel */}
          <div className="relative bg-white h-full shrink-0 pt-3 overflow-y-auto border-r border-gray-100">
            <div>
              <div className="p-3 space-y-1">
                {/* for customer  */}
                {userRole === "customer" &&
                  leftPanelItems
                    .filter((item) => item.showToCustomer)
                    .map((item, i) => (
                      <NavLink
                        key={i}
                        to={item.to}
                        className={({ isActive }) => {
                          return `relative hover:scale-105 duration-150 flex gap-2.5 text-sm items-center font-semibold w-full px-2 py-1.5 rounded-md hover:bg-green-800 hover:text-white hover:shadow-md group whitespace-nowrap ${isActive ? "bg-green-800 text-white shadow-md" : "bg-none text-green-800"}`;
                        }}
                      >
                        <div className="relative flex items-center justify-center">
                          {item.svg}
                          {item.to === "/cart" && cartItems?.length > 0 && (
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-green-500 ring-2 ring-white" />
                          )}
                          {item.to === "/allnotifications" && unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-white animate-pulse" />
                          )}
                        </div>
                        {isLeftPanelOpen && <span>{item.children}</span>}
                      </NavLink>
                    ))}

                {/* for seller  */}
                {userRole === "seller" &&
                  leftPanelItems
                    .filter((item) => item.showToSeller)
                    .map((item, i) => (
                      <NavLink
                        key={i}
                        to={item.to}
                        className={({ isActive }) => {
                          return `relative flex gap-2.5 text-sm items-center font-semibold w-full px-2 py-1.5 rounded-md hover:bg-green-800 hover:text-white hover:shadow-md group whitespace-nowrap ${isActive ? "bg-green-800 text-white shadow-md" : "bg-none text-green-800/80"}`;
                        }}
                      >
                        <div className="relative flex items-center justify-center">
                          {item.svg}
                          {item.to === "/allnotifications" && unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-white animate-pulse" />
                          )}
                        </div>
                        {isLeftPanelOpen && <span>{item.children}</span>}
                      </NavLink>
                    ))}

                {/* for driver  */}
                {userRole === "driver" &&
                  leftPanelItems
                    .filter((item) => item.showToDriver)
                    .map((item, i) => (
                      <NavLink
                        key={i}
                        to={item.to}
                        className={({ isActive }) => {
                          return `relative flex gap-2.5 text-sm items-center font-semibold w-full px-2 py-1.5 rounded-md hover:bg-green-800 hover:text-white hover:shadow-md group whitespace-nowrap ${isActive ? "bg-green-800 text-white shadow-md" : "bg-none text-green-800/80"}`;
                        }}
                      >
                        <div className="relative flex items-center justify-center">
                          {item.svg}
                          {item.to === "/allnotifications" && unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-white animate-pulse" />
                          )}
                        </div>
                        {isLeftPanelOpen && <span>{item.children}</span>}
                      </NavLink>
                    ))}
              </div>

              <div className="absolute z-50 right-0 top-0">
                <button onClick={() => setIsLeftPanelOpen((prev) => !prev)}>
                  {isLeftPanelOpen ? "✘" : <Menu size={15} />}
                </button>
              </div>
            </div>
          </div>

          {/* right panel  */}
          <div
            className="flex-1 bg-gray-100 p-4 sm:p-6 overflow-y-auto
              [&::-webkit-scrollbar]:w-2
              [&::-webkit-scrollbar-track]:transparent
              [&::-webkit-scrollbar-thumb]:bg-gray-300
              [&::-webkit-scrollbar-thumb]:rounded-full"
          >
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;