import { Store, Package, CheckCircle2, XCircle } from "lucide-react";

const dashboardCardsConfig = (
  currentUser,
  setActiveCard,
  setAllOrders,
  allOrders,
) => {
  const completedOrders =
    allOrders.filter(
      (o) => o.order_status === "completed" || o.order_status === "delivered",
    ) || [];

  const cancelledOrders =
    allOrders.filter(
      (o) => o.order_status === "rejected" || o.order_status === "cancelled",
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
      text: "TOTAL HISTORY",
      value: allOrders.length || 0,

      onClick: () => {
        setActiveCard("total");
        setAllOrders(allOrders || []);
      },
      cardStyle: "bg-orange-100 text-orange-500 border border-orange-200",
      borderStyle: "border-b-[3px] border-orange-400",
    },

    {
      id: "completed",
      icon: CheckCircle2,
      text: "COMPLETED",
      value: completedOrders.length,

      onClick: () => {
        setActiveCard("completed");
        setAllOrders(completedOrders);
      },

      cardStyle: "bg-emerald-100 text-emerald-600 border border-emerald-200",
      borderStyle: "border-b-[3px] border-emerald-500",
    },

    {
      id: "cancelled",
      icon: XCircle,
      text: "CANCELLED / REJECTED",
      value: cancelledOrders.length,

      onClick: () => {
        setActiveCard("cancelled");
        setAllOrders(cancelledOrders);
      },

      cardStyle: "bg-red-100 text-red-600 border border-red-200",
      borderStyle: "border-b-[3px] border-red-500",
    },
  ];
};

export default dashboardCardsConfig;
