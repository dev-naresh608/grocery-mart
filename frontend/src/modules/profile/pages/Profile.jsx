import React, { useEffect, useRef, useState } from "react";
import { useProfile } from "../hooks";
import { PersonalInfo, Setting } from "../components";
import { Payments } from "@/modules/payment";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  CreditCard,
  LogOut,
  Settings,
  User,
  Camera,
  Loader2,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { updateUser } from "@/modules/auth/store/authSlice";
import { toast } from "react-toastify";
import api from "@/configs/api";

function Profile() {
  const dispatch = useDispatch();
  const location = useLocation();
  const fileInputRef = useRef(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const { currentUser, activeTab, setActiveTab, isLogin, handleLogout } =
    useProfile();

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

  const handleAvatarClick = () => {
    if (fileInputRef.current && !uploadingImage) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation 1: Check if selected file is an image
    if (!file.type.startsWith("image/")) {
      if (e.target) e.target.value = "";
      return toast.error(
        "Please select a valid image file (PNG, JPG, JPEG, WEBP).",
      );
    }

    // Validation 2: Check file size (5MB limit)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      if (e.target) e.target.value = "";
      return toast.error(
        "File size exceeds 5MB limit. Please choose a smaller image.",
      );
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("userId", currentUser?._id || currentUser?.id);

    try {
      setUploadingImage(true);
      const { data } = await api.post("/profile/upload-picture", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!data.success) {
        return toast.error(data.message || "Failed to upload profile picture");
      }

      dispatch(
        updateUser({ imageUrl: data.imageUrl, profile_picture: data.imageUrl }),
      );
      toast.success("Profile picture updated successfully!");
    } catch (error) {
      console.error("Profile picture upload error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to upload image. Please try again.",
      );
    } finally {
      setUploadingImage(false);
      if (e.target) e.target.value = "";
    }
  };

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
      icon: <User size={20} />,
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
      icon: <Settings size={20} />,
      tabToActive: () => setActiveTab("setting"),
      to: "setting",
    },
  ];

  return (
    <div className="flex flex-col md:grid md:grid-cols-[280px,1fr] h-full overflow-hidden bg-white">
      {/* Left sidebar - Fixed */}
      <div className="w-full font-semibold max-w-4xl mx-auto p-4 space-y-6 md:border-r border-[#E7E5E4] shrink-0 bg-white">
        <div className="text-center">
          <div className="flex justify-center">
            <div
              className="relative cursor-pointer group"
              onClick={handleAvatarClick}
            >
              {currentUser?.imageUrl || currentUser?.profile_picture ? (
                <img
                  className="h-32 w-32 rounded-full border-2 border-orange-500 object-cover shadow-sm group-hover:opacity-90 transition-opacity"
                  src={currentUser.imageUrl || currentUser.profile_picture}
                  alt="profile picture"
                />
              ) : (
                <div className="h-32 w-32 rounded-full border-2 border-orange-400 bg-gradient-to-br from-orange-50 to-amber-100 text-orange-600 flex items-center justify-center shadow-sm group-hover:opacity-90 transition-opacity">
                  <User size={56} strokeWidth={1.75} />
                </div>
              )}
              {uploadingImage ? (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white">
                  <Loader2 size={24} className="animate-spin" />
                </div>
              ) : (
                <div
                  className="absolute bottom-0 right-0 bg-orange-500 text-white p-2 rounded-full shadow-md hover:bg-orange-600 transition-all border-2 border-white"
                  title="Change Profile Picture"
                >
                  <Camera size={15} />
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
          <div className="border-b border-gray-200 py-2 space-y-3 mt-3">
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
              <LogOut size={20} /> Logout
            </li>
          </ul>
        </div>
      </div>

      {/* Right panel - Scrollable */}
      <div className="bg-white h-full overflow-y-auto custom-scrollbar p-4">
        {activeTab === "personalinformation" && <PersonalInfo />}
        {activeTab === "payments" && <Payments />}
        {activeTab === "setting" && <Setting />}
      </div>
    </div>
  );
}

export default Profile;
