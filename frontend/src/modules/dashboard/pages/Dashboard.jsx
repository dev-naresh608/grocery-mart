import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CustomerDashboard } from "../customer";
import { SellerDashboard } from "../seller";
import { DriverDashboard } from "../driver";

function Dashboard() {
  const navigate = useNavigate();
  const { user: currentUser, isAuthenticated: isLogin } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (!isLogin) {
      navigate("/", { replace: true });
    }
  }, [isLogin, navigate]);

  if (!isLogin) {
    return null;
  }

  if (currentUser?.role === "customer") {
    return <CustomerDashboard />;
  }
  if (currentUser?.role === "seller") {
    return <SellerDashboard />;
  }
  if (currentUser?.role === "driver") {
    return <DriverDashboard />;
  }
  if (currentUser?.role === "admin") {
    return <h2>Admin Dashboard</h2>;
  }
  return null;
}

export default Dashboard;
