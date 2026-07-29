import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../contexts/context";
import { useModal, MODAL_TYPES } from "../../../components";

export const useProfile = () => {
  const navigate = useNavigate();
  const { openModal } = useModal();
  const {
    currentUser,
    activeTab,
    setActiveTab,
    isLogin,
    setIsLogin,
    setCurrentUserRole,
  } = useContext(UserContext);

  const handleLogout = () => {
    openModal(MODAL_TYPES.CONFIRM, {
      title: "Logout Confirmation",
      message: "Are you sure you want to log out of your account?",
      confirmText: "Logout",
      cancelText: "Cancel",
      type: "danger",
      onConfirm: () => {
        setIsLogin(false);
        setCurrentUserRole("customer");
        navigate("/");
        window.location.reload();
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
