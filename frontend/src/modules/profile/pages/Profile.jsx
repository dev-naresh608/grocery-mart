import React, { useEffect } from "react";
import { useProfile } from "../hooks";
import { PersonalInfo, Setting, Payments } from "../components";
import { Link, NavLink, useLocation } from "react-router-dom";
import { defaultPP } from "@/assets";
import { CreditCard, LogOut, Settings, User } from "lucide-react";

function Profile() {
  const location = useLocation();
  const {
    currentUser,
    activeTab,
    setActiveTab,
    isLogin,
    handleLogout,
  } = useProfile();

  // Sync activeTab with current URL pathname (supports back/forward browser buttons)
  useEffect(() => {
    const path = location.pathname;
    if (path.endsWith("/personalinformation") || path.endsWith("/profile")) {
      setActiveTab("personalinformation");
    } else if (path.endsWith("/payments")) {
      setActiveTab("payments");
    } else if (path.endsWith("/setting")) {
      setActiveTab("setting");
    }
  }, [location.pathname, setActiveTab]);

  if (!isLogin) {
    return (
      <div className="min-h-[50vh] m-auto w-full sm:max-w-[80vw] mt-10 mb-10 bg-white shadow-md p-5 space-y-3 rounded-2xl">
        <h2 className="capitalize">Opps! You Have not login</h2>
        <p>
          Click here to{" "}
          <Link to="/login" className="font-semibold text-red-600">
            Login
          </Link>
        </p>
      </div>
    );
  }

  if (activeTab == null) {
    setActiveTab("personalinformation");
  }

  const sections = [
    {
      name: "Personal Info",
      icon: <User size={20}/>,
      tabToActive: () => setActiveTab("personalinformation"),
      to: "personalinformation",
    },
    {
      name: "Payments",
      icon: <CreditCard size={20} />,
      tabToActive: () => setActiveTab("payments"),
      to: "payments",
    },
    {
      name: "Settings",
      icon: <Settings size={20}/>,
      tabToActive: () => setActiveTab("setting"),
      to: "setting",
    },
  ];

  return (
    <div className=" grid grid-cols-[40vh,1fr] min-h-[90vh] bg-white">
      <div className="w-full font-semibold max-w-4xl mx-auto p-2 space-y-6">
        <div className="text-center">
          <div className="flex justify-center">
            <img
              className="h-32 w-32 rounded-[50%] border border-green-600 object-cover"
              src={currentUser?.imageUrl || defaultPP}
              alt="profile picture"
            />
          </div>
          <div className="border-b border-black py-2 space-y-3">
            <h2>{currentUser?.username || "Unauthorized User"}</h2>
            <div className="space-x-2 text-xs pb-2">
              <span className="px-2 text-green-800 py-1 bg-green-200 rounded-2xl">
                Active
              </span>
              <span className="px-2 text-gray-800 py-1 bg-yellow-100 rounded-2xl">
                {currentUser?.role || ""}
              </span>
            </div>
          </div>
        </div>
        <div className="px-2">
          <ul className="space-y-2">
            {sections.map((s, i) => (
              <li
                key={i}
                onClick={s.tabToActive}
                className="cursor-pointer transition-colors duration-150 hover:text-green-600"
              >
                <NavLink
                  to={s.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 ${isActive ? "text-green-600" : ""}`
                  }
                >
                  {s.icon} {s.name}
                </NavLink>
              </li>
            ))}

            <li
              onClick={handleLogout}
              className="text-red-500 cursor-pointer flex items-center gap-2"
            >
              <LogOut size={20}/> Logout
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-white h-full border-l border-[#E7E5E4]">
        {activeTab === "personalinformation" && <PersonalInfo />}
        {activeTab === "payments" && <Payments />}
        {activeTab === "setting" && <Setting />}
      </div>
    </div>
  );
}

export default Profile;
