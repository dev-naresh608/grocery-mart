import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/context";
import defaultPP from "../../assets/pp.jpeg";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { PersonalInfo, Orders, Setting, Payments, Cart } from "../index";

function Profile() {
  const navigate = useNavigate();
  const {
    currentUser,
    activeTab,
    setActiveTab,
    isLogin,
    setIsLogin,
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
  if(activeTab == null){
    setActiveTab('personalinformation')
  }
  return (
    <>
      <div className="min-h-[90vh] m-auto w-full bg-white shadow-md rounded-2xl p-6 sm:max-w-[95vw] sm:my-10 my-10 font-semibold grid sm:grid-cols-[40vh,1fr] space-x-5">
        {/* <div className="space-y-3 shadow-md rounded-2xl "> */}
        <div className="w-full max-w-4xl mx-auto bg-white shadow-md rounded-2xl p-6 space-y-6">
          <div className="p-3 text-center ">
            <div className="flex justify-center">
              <img
                className="h-32 w-32 rounded-[50%]"
                src={defaultPP}
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
              <li
                onClick={() => setActiveTab("personalinformation")}
                className="cursor-pointer hover:text-green-600"
              >
                <NavLink
                  to="personalinformation"
                  className={({ isActive }) =>
                    isActive ? "text-green-600" : ""
                  }
                >
                  👤 Personal Info
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

              <li
                onClick={() => setActiveTab("payments")}
                className="cursor-pointer hover:text-green-600"
              >
                <NavLink
                  to="payments"
                  className={({ isActive }) =>
                    isActive ? "text-green-600" : ""
                  }
                >
                  💳 Payments
                </NavLink>
              </li>

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
                onClick={() => setActiveTab("setting")}
                className="cursor-pointer hover:text-green-600"
              >
                <NavLink
                  to="setting"
                  className={({ isActive }) =>
                    isActive ? "text-green-600" : ""
                  }
                >
                  ⚙️ Settings
                </NavLink>
              </li>

              <li
                onClick={() => {
                  setIsLogin(false);
                  navigate("/login");
                  location.reload();
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
        </div>
      </div>
    </>
  );
}

export default Profile;
