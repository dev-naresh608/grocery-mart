import { useSelector } from "react-redux";

export function useSellerDashboard() {
  const { user: currentUser } = useSelector((state) => state.auth);

  // Set Seller Stats
  const sellerStats = {
    totalOrders: currentUser?.myOrders?.length || "0",
    revenue: `₹${currentUser?.myRevanue?.length || "0"}`,
    products: currentUser?.productList?.length || "0",
    customers: currentUser?.myCustomers?.length || "0",
  };

  return {
    currentUser,
    sellerStats,
  };
}
