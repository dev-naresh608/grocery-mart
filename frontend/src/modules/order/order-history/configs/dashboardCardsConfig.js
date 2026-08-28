import { Store, Package, CheckCircle2, XCircle } from "lucide-react";

const dashboardCardsConfig = (
  currentUser,
  setActiveCard,
  allOrders = [],
  summaryStats = null
) => {
  const totalVal = summaryStats ? summaryStats.total : allOrders.length || 0;
  const completedVal = summaryStats
    ? summaryStats.completed
    : allOrders.filter(
        (o) => o.order_status === "completed" || o.order_status === "delivered"
      ).length;
  const cancelledVal = summaryStats
    ? summaryStats.cancelled
    : allOrders.filter(
        (o) => o.order_status === "rejected" || o.order_status === "cancelled"
      ).length;

  return [
    {
      icon: Store,
      text: "VIEWING AS",
      value:
        currentUser?.role
          ? currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)
          : "User",
      cardStyle: "bg-blue-100 text-blue-500 border border-blue-200",
    },

    {
      id: "total",
      icon: Package,
      text: "TOTAL HISTORY",
      value: totalVal,
      onClick: () => {
        setActiveCard("total");
      },
      cardStyle:
        "bg-orange-100 text-orange-500 border border-orange-200 cursor-pointer",
      borderStyle: "border-b-[3px] border-orange-400",
    },

    {
      id: "completed",
      icon: CheckCircle2,
      text: "COMPLETED",
      value: completedVal,
      onClick: () => {
        setActiveCard("completed");
      },
      cardStyle:
        "bg-emerald-100 text-emerald-600 border border-emerald-200 cursor-pointer",
      borderStyle: "border-b-[3px] border-emerald-500",
    },

    {
      id: "cancelled",
      icon: XCircle,
      text: "CANCELLED / REJECTED",
      value: cancelledVal,
      onClick: () => {
        setActiveCard("cancelled");
      },
      cardStyle:
        "bg-red-100 text-red-600 border border-red-200 cursor-pointer",
      borderStyle: "border-b-[3px] border-red-500",
    },
  ];
};

export default dashboardCardsConfig;
