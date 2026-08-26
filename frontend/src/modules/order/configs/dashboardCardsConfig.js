import { Store, Package, Clock } from "lucide-react";

const dashboardCardsConfig = (
  currentUser,
  setActiveCard,
  allOrders = [],
) => {
  // ===================== STATUS FILTER =====================
  const activeOrders =
    allOrders.filter(
      (o) => o.order_status === "pending" || o.order_status === "preparing",
    ) || [];

  return [
    {
      icon: Store,
      text: "VIEWING AS",
      value:
        currentUser?.role?.charAt(0).toUpperCase() +
        currentUser?.role?.slice(1),

      cardStyle: "bg-blue-100 text-blue-500 border border-blue-200",
    },

    {
      id: "total",
      icon: Package,
      text: "TOTAL ORDERS",
      value: allOrders.length || 0,

      onClick: () => {
        setActiveCard("total");
      },
      cardStyle: "bg-orange-100 text-orange-500 border border-orange-200 cursor-pointer",
      borderStyle: "border-b-[3px] border-orange-400",
    },

    {
      id: "active",
      icon: Clock,
      text: "ACTIVE ORDERS",
      value: activeOrders.length,

      onClick: () => {
        setActiveCard("active");
      },

      cardStyle: "bg-teal-100 text-teal-500 border border-teal-200 cursor-pointer",

      borderStyle: "border-b-[3px] border-teal-400",
    },
  ];
};

export default dashboardCardsConfig;
