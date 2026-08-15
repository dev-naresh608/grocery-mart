import Address from "./address.model.js";

export const findAddressSvc = async (userId) => {
  const addressList = await Address.find({ user_id: userId });
  return addressList;
};

export const addAddressSvc = async (userId, payload) => {
  const { name, phone, street, city, state, pincode } = payload;

  const address = await Address.create({
    user_id: userId,
    name: name,
    phone: phone,
    street: street,
    city: city,
    state: state,
    pincode: pincode,
  });

  return address;
};

export const deleteAddressSvc = async (addressId) => {
  return await Address.findByIdAndDelete(addressId);
};

export const updateAddressSvc = async (addressId, payload) => {
  return await Address.findByIdAndUpdate(addressId, payload, { new: true });
};
