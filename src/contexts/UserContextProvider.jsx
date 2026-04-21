import React, { useState } from "react";
import UserContext from "./UserContext";

function UserContextProvider({ children }) {
  const [currentUser, setCurrentUser] = useState({
    username: "",
    email: "",
    password: "",
    id: "",
  });
  const [currentUserRole, setCurrentUserRole] = useState("customer");
    const data = () => {
    return (
      JSON.parse(localStorage.getItem("localUserData")) || {
        username: "",
        email: "",
        password: "",
        role: "",
        id: "",
      }
    );
  };

  const [userData, setUserData] = useState(data);
  const [activeTab, setActiveTab] = useState(null);
  const [isLogin, setIsLogin] = useState(false);

  return (
    <UserContext.Provider
      value={{
        userData,
        setUserData,
        currentUser,
        setCurrentUser,
        currentUserRole,
        setCurrentUserRole,
        activeTab,
        setActiveTab,
        isLogin,
        setIsLogin,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export default UserContextProvider;
