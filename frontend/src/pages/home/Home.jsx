import React, { useState } from "react";
import { Hero, Footer, BlogSection } from "../../components";

import { bottom_banner } from "@/assets";

import { useSelector } from "react-redux";
import { leftPanelItems } from "@/constants/navigation";
import { Menu, X, Truck, Leaf, Coins, ShieldCheck } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
function Home() {
  const { user: currentUser, isAuthenticated: isLogin } = useSelector(
    (state) => state.auth
  );

  const cartItems = currentUser?.myCart || [];
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);

  if (!isLogin) {
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
      <>
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
      </>
    );
  }

  return (
    <>
      <div>
        <div className="flex h-[90vh]">
          {/* left panel */}
          <div className="relative bg-white h-full pt-3">
            <div>
              {/* <div className="p-3 space-y-1 border-b border-green-300"> */}
              <div className="p-3 space-y-1">
                {/* for customer  */}
                {currentUser?.role === "customer" &&
                  leftPanelItems
                    .filter((item) => item.showToCustomer)
                    .map((item, i) => (
                      <NavLink
                        key={i}
                        to={item.to}
                        // onClick={item.handleOnClick}
                        className={({ isActive }) => {
                          return `relative hover:scale-105 duration-150 flex gap-2 text-sm items-center font-semibold w-full px-2 py-1.5 rounded-md hover:bg-green-800 hover:text-white hover:shadow-md group whitespace-nowrap ${isActive ? "bg-green-800 text-white shadow-md" : "bg-none text-green-800"}`;
                        }}
                      >
                        {item.svg}
                        {!isLeftPanelOpen && item.to === "/cart" && (
                          <div className="absolute top-0 right-0.5 text-xs">
                            <div className="">{cartItems?.length || ""}</div>
                          </div>
                        )}
                        {isLeftPanelOpen && (
                          <span className="flex items-center">
                            {item.children}
                            {item.to === "/cart" && (
                              <div>
                                <div>
                                  <span>{"⠀- ⠀"}</span>
                                  {cartItems?.length || "0"}
                                </div>
                              </div>
                            )}
                          </span>
                        )}
                      </NavLink>
                    ))}

                {/* for seller  */}
                {currentUser?.role === "seller" &&
                  leftPanelItems
                    .filter((item) => item.showToSeller)
                    .map((item, i) => (
                      <NavLink
                        key={i}
                        to={item.to}
                        // onClick={item.handleOnClick}
                        className={({ isActive }) => {
                          return `flex gap-2 text-sm items-center font-semibold w-full  px-2 py-1.5 rounded-md hover:bg-green-800 hover:text-white hover:shadow-md group whitespace-nowrap ${isActive ? "bg-green-800 text-white shadow-md" : "bg-none text-green-800/80"}`;
                        }}
                      >
                        {item.svg}
                        {isLeftPanelOpen && <span>{item.children}</span>}
                      </NavLink>
                    ))}

                {/* for driver  */}
                {currentUser?.role === "driver" &&
                  leftPanelItems
                    .filter((item) => item.showToDriver)
                    .map((item, i) => (
                      <NavLink
                        key={i}
                        to={item.to}
                        // onClick={item.handleOnClick}
                        className={({ isActive }) => {
                          return `flex gap-2 text-sm items-center font-semibold w-full  px-2 py-1.5 rounded-md hover:bg-green-800 hover:text-white hover:shadow-md group whitespace-nowrap ${isActive ? "bg-green-800 text-white shadow-md" : "bg-none text-green-800/80"}`;
                        }}
                      >
                        {item.svg}
                        {isLeftPanelOpen && <span>{item.children}</span>}
                      </NavLink>
                    ))}
              </div>

              {/* For both */}
              {/* <div className="p-3 space-y-1">
                {secondLeftPanelItems.map((item, i) => (
                  <NavLink
                    key={i}
                    to={item.to}
                    // onClick={item.handleOnClick}
                    className={({ isActive }) => {
                      return `flex gap-2 text-sm items-center font-semibold w-full px-2 py-1.5 rounded-md hover:bg-green-800 
                      hover:text-white  hover:shadow-md group whitespace-nowrap ${isActive ? "bg-green-800 text-white shadow-md" : "bg-none text-gray-500"}`;
                    }}
                  >
                    {<item.svg className="fill-gray-500 text-white" />}
                    {isLeftPanelOpen && <span>{item.children}</span>}
                  </NavLink>
                ))}
              </div> */}
              <div className="absolute z-50 right-0 top-0">
                <button onClick={() => setIsLeftPanelOpen((prev) => !prev)}>
                  {isLeftPanelOpen ? "✘" : <Menu size={15} />}
                </button>
              </div>
            </div>
          </div>
          {/* right panel  */}
          <div
            className="w-full  h-full bg-gray-100 p-4   
          [&::-webkit-scrollbar]:w-2
          overflow-y-auto
  [&::-webkit-scrollbar-track]:transparent
  [&::-webkit-scrollbar-thumb]:transparent
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