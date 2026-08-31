import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { updateUser } from "@/modules/auth/store/authSlice";
import { handleAddAddressApi, handleUpdateAddressApi } from "../../index";
import { useModal } from "../../../components";

const initialFormData = {
  name: "",
  phone: "",
  city: "",
  street: "",
  state: "",
  pincode: "",
};

function AddressForm({ closeBtnAction, userId, setAddress }) {
  const dispatch = useDispatch();
  const { payload, closeModal } = useModal();
  
  const isInsideModal = !closeBtnAction;
  const actualUserId = userId || payload?.userId;
  const actualSetAddress = setAddress || payload?.setAddress;
  const handleClose = closeBtnAction ? () => closeBtnAction((prev) => !prev) : closeModal;

  // ==== STATE =======
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (payload?.address) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        name: payload.address.name || "",
        phone: payload.address.phone || "",
        city: payload.address.city || "",
        street: payload.address.street || "",
        state: payload.address.state || "",
        pincode: String(payload.address.pincode || ""),
      });
    } else {
      setFormData(initialFormData);
    }
  }, [payload?.address]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    //  ===== validation =====
    if (!formData.pincode || Number(formData.pincode) <= 0) {
      return toast.error("Invalid pincode number");
    }
    if (String(formData.pincode).length !== 6) {
      return toast.error("Pincode length must be 6");
    }

    if (!actualUserId && !payload?.address?._id) {
      return toast.error("No user id found");
    }

    const requestPayload = {
      name: formData.name,
      phone: formData.phone,
      street: formData.street,
      city: formData.city,
      state: formData.state,
      pincode: Number(formData.pincode),
    };

    try {
      let data;
      if (payload?.address?._id) {
        data = await handleUpdateAddressApi(payload.address._id, requestPayload);
      } else {
        data = await handleAddAddressApi(actualUserId, requestPayload);
      }

      if (!data || !data.success) {
        return toast.error(data?.message || "Failed to save address");
      }

      const savedAddr = data.address;
      if (actualSetAddress) {
        actualSetAddress(savedAddr);
      }
      dispatch(updateUser({ address: savedAddr }));

      toast.success(payload?.address?._id ? "Address updated successfully" : "Address added successfully");
      setFormData(initialFormData);
      if (handleClose) {
        handleClose();
      }
    } catch (error) {
      console.error("Address Submit Error:", error);
      toast.error("Failed to save address");
    }
  };

  const formContent = (
    <>
      <p className="font-bold text-center text-xl">
        {payload?.address?._id ? "Edit Address" : "Add Address"}
      </p>
      {!isInsideModal && (
        <div className="absolute top-0 right-2">
          <button onClick={handleClose}>✘</button>
        </div>
      )}
      <div>
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
          <div className="rounded-xl border border-gray-300 bg-[#eef0f4] px-4 py-2">
            <input
              type="text"
              name="name"
              placeholder="name"
              onChange={handleChange}
              value={formData?.name || ""}
              className="w-full bg-transparent outline-none text-gray-600 placeholder:text-gray-400 autofill:bg-transparent"
            />
          </div>
          <div className="rounded-xl border border-gray-300 bg-[#eef0f4] px-4 py-2">
            <input
              type="text"
              name="phone"
              value={formData?.phone || ""}
              placeholder="phone"
              onChange={handleChange}
              className="w-full bg-transparent outline-none text-gray-600 placeholder:text-gray-400 autofill:bg-transparent"
            />
          </div>
          <div className="rounded-xl border border-gray-300 bg-[#eef0f4] px-4 py-2">
            <input
              type="text"
              name="street"
              placeholder="street"
              onChange={handleChange}
              value={formData?.street || ""}
              className="w-full bg-transparent outline-none text-gray-600 placeholder:text-gray-400 autofill:bg-transparent"
            />
          </div>
          <div className="rounded-xl border border-gray-300 bg-[#eef0f4] px-4 py-2">
            <input
              type="text"
              name="city"
              placeholder="city"
              onChange={handleChange}
              value={formData?.city || ""}
              className="w-full bg-transparent outline-none text-gray-600 placeholder:text-gray-400 autofill:bg-transparent"
            />
          </div>
          <div className="rounded-xl border border-gray-300 bg-[#eef0f4] px-4 py-2">
            <input
              type="text"
              name="state"
              placeholder="state"
              onChange={handleChange}
              value={formData?.state || ""}
              className="w-full bg-transparent outline-none text-gray-600 placeholder:text-gray-400 autofill:bg-transparent"
            />
          </div>
          <div className="rounded-xl border border-gray-300 bg-[#eef0f4] px-4 py-2">
            <input
              type="number"
              name="pincode"
              placeholder="pincode"
              onChange={handleChange}
              value={formData?.pincode || ""}
              className="w-full bg-transparent outline-none text-gray-600 placeholder:text-gray-400 autofill:bg-transparent"
            />
          </div>

          <div className="flex justify-center items-center gap-3">
            <button
              type="submit"
              className="px-4 py-2 text-sm font-semibold text-green-600 rounded-lg bg-green-200 active:scale-95 transition-colors"
            >
              Add
            </button>
            <button
              type="reset"
              onClick={() => setFormData(initialFormData)}
              className="px-4 py-2 text-sm font-semibold text-red-600 rounded-lg bg-red-200 active:scale-95 transition-colors"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </>
  );

  if (isInsideModal) {
    return <div className="p-8 space-y-5 max-h-[85vh] overflow-y-auto custom-scrollbar">{formContent}</div>;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-gray-500/20 z-50">
      <div className="relative bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm md:max-w-sm lg:max-w-md space-y-5">
        {formContent}
      </div>
    </div>
  );
}

export default AddressForm;
