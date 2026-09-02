import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { updateUser } from "@/modules/auth/store/authSlice";
import { handleAddAddressApi, handleUpdateAddressApi } from "../../index";
import { useModal } from "../../../components";
import { Loader2 } from "lucide-react";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    let processedValue = value;
    if (name === "phone") {
      processedValue = value.replace(/\D/g, "").slice(0, 10);
    }
    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    //  ===== validation =====
    if (!formData.name || !formData.name.trim()) {
      return toast.error("Name is required");
    }

    if (!formData.phone || formData.phone.length !== 10) {
      return toast.error("Phone number must be exactly 10 digits");
    }

    if (!formData.street || !formData.street.trim()) {
      return toast.error("Street address is required");
    }

    if (!formData.city || !formData.city.trim()) {
      return toast.error("City is required");
    }

    if (!formData.state || !formData.state.trim()) {
      return toast.error("State is required");
    }

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
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      street: formData.street.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      pincode: Number(formData.pincode),
    };

    setIsSubmitting(true);
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
    } finally {
      setIsSubmitting(false);
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
              placeholder="Full name"
              onChange={handleChange}
              value={formData?.name || ""}
              className="w-full bg-transparent outline-none text-gray-600 placeholder:text-gray-400 autofill:bg-transparent"
              required
            />
          </div>
          <div className="rounded-xl border border-gray-300 bg-[#eef0f4] px-4 py-2">
            <input
              type="tel"
              name="phone"
              value={formData?.phone || ""}
              placeholder="10-digit phone number"
              maxLength={10}
              onChange={handleChange}
              className="w-full bg-transparent outline-none text-gray-600 placeholder:text-gray-400 autofill:bg-transparent"
              required
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
              disabled={isSubmitting}
              className="px-5 py-2 text-sm font-semibold text-green-700 rounded-lg bg-green-200 hover:bg-green-300 active:scale-95 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer border-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{payload?.address?._id ? "Update" : "Add"}</span>
              )}
            </button>
            <button
              type="reset"
              disabled={isSubmitting}
              onClick={() => setFormData(initialFormData)}
              className="px-4 py-2 text-sm font-semibold text-red-600 rounded-lg bg-red-100 hover:bg-red-200 active:scale-95 transition-colors cursor-pointer border-none disabled:opacity-50"
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
