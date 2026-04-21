import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/context";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  defaultPP,
  PersonalInfo,
  Orders,
  Setting,
  Payments,
  Cart,
  MyProducts,
  Wishlist,
} from "../index";

function Profile() {
  const navigate = useNavigate();
  const {
    currentUser,
    activeTab,
    setActiveTab,
    isLogin,
    setIsLogin,
    setCurrentUserRole,
  } = useContext(UserContext);

  if (!isLogin) {
    return (
      <>
        <div className="min-h-[50vh] m-auto w-full sm:max-w-[80vw] mt-10 mb-10 bg-white shadow-md p-5  space-y-3 rounded-2xl">
          <h2 className="capatalize capitalize">Opps! You Have not login</h2>
          <p>
            Click here to{" "}
            <Link to="/login" className="font-semibold text-red-600">
              Login
            </Link>
          </p>
        </div>
      </>
    );
  }

  if (activeTab == null) {
    setActiveTab("personalinformation");
  }

  const sections = [
    {
      name: "Personal Info",
      icon: "👤",
      tabToActive: "personalinformation",
      to: "personalinformation",
    },

    {
      name: "Settings",
      icon: "⚙️",
      tabToActive: "setting",
      to: "setting",
    },
    {
      name: "Payments",
      icon: "💳",
      tabToActive: "payments",
      to: "payments",
    },
  ];

  return (
    <>
      <div className="min-h-[90vh] m-auto w-full bg-white shadow-md rounded-2xl p-6 sm:max-w-[95vw] sm:my-10 my-10 font-semibold grid sm:grid-cols-[40vh,1fr] space-x-5">
        {/* <div className="space-y-3 shadow-md rounded-2xl "> */}
        <div className="w-full max-w-4xl mx-auto bg-white shadow-md rounded-2xl p-2 space-y-6">
          <div className="text-center ">
            <div className="flex justify-center">
              <img
                className="h-32 w-32 rounded-[50%] border border-green-600"
                src={
                  currentUser.hasOwnProperty("imageUrl")
                    ? currentUser.imageUrl
                    : defaultPP
                }
                alt="profile picture"
              />
            </div>
            <div className="border-b border-black py-2">
              <h2 className="pb-2">
                {currentUser?.username || "Unauthorized User"}
              </h2>
            </div>
          </div>
          <div className="px-2">
            <ul className="">
              {sections.map((s, i) => (
                <li
                  onClick={() => setActiveTab(s.tabToActive)}
                  className="cursor-pointer hover:text-green-600"
                >
                  <NavLink
                    to={s.to}
                    className={({ isActive }) =>
                      isActive ? "text-green-600" : ""
                    }
                  >
                    {s.icon} {s.name}
                  </NavLink>
                </li>
              ))}

              {currentUser.role === "customer" ? (
                <>
                  <li
                    onClick={() => setActiveTab("cart")}
                    className="cursor-pointer hover:text-green-600"
                  >
                    <NavLink
                      to="cart"
                      className={({ isActive }) =>
                        isActive ? "text-green-600" : ""
                      }
                    >
                      🛒 Cart
                    </NavLink>
                  </li>
                  <li
                    onClick={() => setActiveTab("wishlist")}
                    className="cursor-pointer hover:text-green-600"
                  >
                    <NavLink
                      to="wishlist"
                      className={({ isActive }) =>
                        isActive ? "text-green-600" : ""
                      }
                    >
                      📜 Wishlist
                    </NavLink>
                  </li>
                  <li
                    onClick={() => setActiveTab("orders")}
                    className="cursor-pointer hover:text-green-600"
                  >
                    <NavLink
                      to="orderhistory"
                      className={({ isActive }) =>
                        isActive ? "text-green-600" : ""
                      }
                    >
                      📦 Orders
                    </NavLink>
                  </li>
                </>
              ) : (
                <></>
              )}

               <li
                onClick={() => {
                  setIsLogin(false);
                  navigate("/login");
                  location.reload();
                  setCurrentUserRole("customer");
                }}
                className="text-red-500 cursor-pointer"
              >
                🚪 Logout
              </li>
            </ul>
          </div>
        </div>

        <div>
          {activeTab === "personalinformation" && <PersonalInfo />}
          {activeTab === "payments" && <Payments />}
          {activeTab === "orders" && <Orders />}
          {activeTab === "setting" && <Setting />}
          {activeTab === "cart" && <Cart />}
          {activeTab === "wishlist" && <Wishlist />}
          {activeTab === "myproducts" && <MyProducts />}
        </div>
      </div>
    </>
  );
}

export default Profile;
