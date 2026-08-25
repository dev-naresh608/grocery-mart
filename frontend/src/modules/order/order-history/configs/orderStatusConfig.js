const orderStatusConfig = () => {
  return {
    pending: {
      label: "Pending",
      pillStyle: "bg-yellow-100 text-yellow-700",
    },
    preparing: {
      label: "Preparing",
      pillStyle: "bg-green-100 text-green-700",
    },
    completed: {
      label: "Completed",
      pillStyle: "bg-emerald-100 text-emerald-700",
    },
    delivered: {
      label: "Delivered",
      pillStyle: "bg-emerald-100 text-emerald-700",
    },
    rejected: {
      label: "Rejected",
      pillStyle: "bg-red-100 text-red-700",
    },
    cancelled: {
      label: "Cancelled",
      pillStyle: "bg-red-100 text-red-700",
    },
  };
};

export default orderStatusConfig;
