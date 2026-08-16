import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/modules/auth/store/authThunk";
import { useModal, MODAL_TYPES } from "../../../components";

export const useProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { openModal } = useModal();
  const { user: currentUser, isAuthenticated: isLogin } = useSelector(
    (state) => state.auth
  );
  const [activeTab, setActiveTab] = useState("personalinformation");

  const handleLogout = () => {
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

  return {
    currentUser,
    activeTab,
    setActiveTab,
    isLogin,
    handleLogout,
  };
};
