const { Seller } = require("./seller.model");
export const createSellerSvc = async (userId, payload, session) => {
  const { phone, store_owner_name, store_name, store_type, store_address } =
    payload;
  const sellers = await Seller.create(
    [
      {
        user_id: userId,
        phone: phone,
        store_name: store_name,
        store_owner_name: store_owner_name,
        store_type: store_type,
        store_address: store_address,
      },
    ],
    { session },
  );
  return sellers[0];
};

export default Seller;
