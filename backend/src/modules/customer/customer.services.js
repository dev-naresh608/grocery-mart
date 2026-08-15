const { Customer } = require("./customer.model");
export const createCustomerSvc = async (userId, session) => {
  const customers = await Customer.create(
    [
      {
        user_id: userId,
      },
    ],
    { session },
  );

  return customers[0];
};

export default Customer;
