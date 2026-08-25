const tableHeaderConfig = (role) => {
  const ROLE_CONFIG_STATS = {
    customer: {
      colLabel: "Store",
      fromKey: "store_name",
      subKey: "store_address",
    },

    seller: {
      colLabel: "Customer",
      fromKey: "customer_name",
      subKey: "customer_phone",
    },

    driver: {
      colLabel: "Store / Route",
      fromKey: "store_name",
      subKey: "store_address",
    },
  };

  return ROLE_CONFIG_STATS[role];
};

export default tableHeaderConfig;
