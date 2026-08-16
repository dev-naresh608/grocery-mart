import React from "react";
import { generateAddressLine } from "../../../address/services/addressLine";

export default function AddressSelector({
  addressList,
  address,
  setAddress,
  setCurrentUser,
}) {
  const handleAddressChange = (e) => {
    const addressId = e.target.value;
    const selectedAddress = addressList.find((a) => a._id === addressId);
    if (selectedAddress) {
      setAddress(selectedAddress);
      setCurrentUser({ address: selectedAddress });
    }
  };

  const sortedAddressList = React.useMemo(() => {
    if (!addressList || !address) return addressList || [];
    const rest = addressList.filter((a) => a._id !== address._id);
    const selected = addressList.find((a) => a._id === address._id);
    return selected ? [selected, ...rest] : addressList;
  }, [addressList, address]);

  return (
    <select
      className="bg-gray-200/40 rounded-md border text-xs tracking-tight px-1 py-1.5 text-gray-700 w-full mt-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none cursor-pointer"
      onChange={handleAddressChange}
      value={address?._id || ""}
    >
      {sortedAddressList?.map((a, i) => (
        <option key={i} value={a._id}>
          {generateAddressLine(a)}
        </option>
      ))}
    </select>
  );
}
