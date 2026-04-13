import { useState } from "react";
import { AddressContext } from "./context";

function AddressContextProvider({ children }) {
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  return (
    <AddressContext.Provider value={{address, setAddress}}>{children}</AddressContext.Provider>
  );
}
export default AddressContextProvider;