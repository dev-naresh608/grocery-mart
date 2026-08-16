import Customer from "./customer.model.js";
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
