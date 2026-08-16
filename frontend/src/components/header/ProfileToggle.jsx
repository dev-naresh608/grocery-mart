import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/modules/auth/store/authThunk";
import { defaultPP } from "@/assets";
import { MiniProfileContainer, useModal, MODAL_TYPES } from "..";
import { Home, LogOut, User } from "lucide-react";

function ProfileToggle() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { openModal } = useModal();
  const { user: currentUser } = useSelector((state) => state.auth);

  const [isProfileClicked, setIsProfileClicked] = useState(false);

  // Base shared styles for navigation links
  const commonStyle =
    "flex items-center px-2 py-1 gap-1 font-semibold my-1 hover:bg-gray-100 rounded transition-colors duration-150";

  const menuItems = [
    {
      label: "Home",
      to: "dashboard",
      icon: <Home size={17} strokeWidth={2.5} />,
      onClick: () => setIsProfileClicked(false),
    },
    {
      label: "Profile",
      to: "profile",
      icon: <User size={17} strokeWidth={2.5} />,
      onClick: () => setIsProfileClicked(false),
    },
  ];

  const handleLogout = () => {
    setIsProfileClicked(false);
    openModal(MODAL_TYPES.CONFIRM, {
      title: "Logout Confirmation",
      message: "Are you sure you want to log out of your account?",
      confirmText: "Logout",
      cancelText: "Cancel",
      type: "danger",
      onConfirm: async () => {
        await dispatch(logout());
        navigate("/");
      },
    });
  };

  return (
    <>
      <div className="relative z-[100]">
        <button
          onClick={() => {
            setIsProfileClicked((prev) => !prev);
          }}
          className="block"
        >
          <div className="flex items-center justify-center overflow-hidden rounded-full h-7 w-7 border border-green-800">
            <img
              loading="lazy"
              className="active:h-6 active:w-6 object-cover h-full w-full"
              src={currentUser?.imageUrl || defaultPP}
              alt="profile picture"
            />
          </div>
        </button>

        {/* Dropdown Menu Container */}
        <div
          className={`absolute right-0 min-w-[200px] md:w-[20vw] lg:w-[20vw] shadow-md bg-white rounded-xl z-50 ${
            isProfileClicked ? "block" : "hidden"
          }`}
        >
          <div className="absolute right-2 top-2">
            <button
              onClick={() => {
                setIsProfileClicked(false);
              }}
              className="text-gray-400 hover:text-gray-600 font-bold"
            >
              ✘
            </button>
          </div>

          <ul>
            {/* User Info Section */}
            <li className="p-2 border-b border-gray-100">
              <MiniProfileContainer />
            </li>

            {/* Navigation Links Loop */}
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.to}
                  onClick={item.onClick}
                  className={commonStyle}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}

            {/* Logout Button*/}
            <li className="w-full">
              <button
                type="button"
                onClick={handleLogout}
                className={`${commonStyle} text-red-600 hover:bg-red-50 w-full text-left border-none bg-transparent cursor-pointer outline-none flex items-center`}
              >
                <LogOut size={17} strokeWidth={2.5} className="mr-1" />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default ProfileToggle;
