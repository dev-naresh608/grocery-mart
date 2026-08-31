import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "@/modules/auth/store/authSlice";
import { handleAddAddressApi, handleUpdateAddressApi } from "../../index";
import { detectUserLocationThunk } from "../store/addressThunk";
import { reverseGeocodeApi } from "@/services/DistanceCalculator";
import { useModal } from "../../../components";
import { MapPin, Loader2, Navigation } from "lucide-react";

const initialFormData = {
  name: "",
  phone: "",
  city: "",
  street: "",
  state: "",
  pincode: "",
  coordinates: null, // [longitude, latitude]
};

function AddressForm({ closeBtnAction, userId, setAddress }) {
  const dispatch = useDispatch();
  const { payload, closeModal } = useModal();
  const { isDetectingLocation } = useSelector((state) => state.address);

  const isInsideModal = !closeBtnAction;
  const actualUserId = userId || payload?.userId;
  const actualSetAddress = setAddress || payload?.setAddress;
  const handleClose = closeBtnAction
    ? () => closeBtnAction((prev) => !prev)
    : closeModal;

  // ==== STATE =======
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationStatusMessage, setLocationStatusMessage] = useState("");

  useEffect(() => {
    if (payload?.address) {
      const existingCoords = payload.address.location?.coordinates || null;
      setFormData({
        name: payload.address.name || "",
        phone: payload.address.phone || "",
        city: payload.address.city || "",
        street: payload.address.street || "",
        state: payload.address.state || "",
        pincode: String(payload.address.pincode || ""),
        coordinates: existingCoords,
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

  // Browser Geolocation Detection Flow
  const handleDetectLocation = async () => {
    setLocationStatusMessage("Detecting location and fetching address details...");
    try {
      const resultAction = await dispatch(detectUserLocationThunk()).unwrap();
      if (resultAction && resultAction.latitude && resultAction.longitude) {
        const { latitude, longitude } = resultAction;

        setFormData((prev) => ({
          ...prev,
          coordinates: [longitude, latitude],
        }));

        try {
          const geoRes = await reverseGeocodeApi(latitude, longitude);
          if (geoRes && geoRes.success) {
            setFormData((prev) => ({
              ...prev,
              coordinates: [longitude, latitude],
              street: geoRes.street || prev.street || "",
              city: geoRes.city || prev.city || "",
              state: geoRes.state || prev.state || "",
              pincode: geoRes.pincode ? String(geoRes.pincode).replace(/\D/g, "").slice(0, 6) : prev.pincode || "",
            }));
            setLocationStatusMessage("📍 Address auto-filled from current location!");
            toast.success("Current address detected & filled successfully!");
            return;
          }
        } catch {
          // Keep coordinates
        }

        setLocationStatusMessage("📍 Coordinates set via GPS!");
        toast.success("Location coordinates detected successfully!");
      }
    } catch (err) {
      const fallbackMsg =
        err?.message ||
        "Location permission was denied. Enter your address manually to continue.";
      setLocationStatusMessage(fallbackMsg);
      toast.info(fallbackMsg);
    }
  };

  const handleSubmit = async () => {
    //  ===== validation =====
    if (!formData.pincode || Number(formData.pincode) <= 0) {
      return toast.error("Invalid pincode number");
    }
    if (String(formData.pincode).length !== 6) {
      return toast.error("Pincode length must be 6 digits");
    }

    if (!actualUserId && !payload?.address?._id) {
      return toast.error("User ID not found");
    }

    if (!formData.street?.trim() || !formData.city?.trim() || !formData.state?.trim()) {
      return toast.error("Street, city, and state are required");
    }

    const requestPayload = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      street: formData.street.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      pincode: Number(formData.pincode),
    };

    if (Array.isArray(formData.coordinates) && formData.coordinates.length === 2) {
      requestPayload.coordinates = formData.coordinates;
    }

    setIsSubmitting(true);
    try {
      let data;
      if (payload?.address?._id) {
        data = await handleUpdateAddressApi(
          payload.address._id,
          requestPayload
        );
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

      toast.success(
        payload?.address?._id
          ? "Address updated successfully"
          : "Address added successfully"
      );
      setFormData(initialFormData);
      if (handleClose) {
        handleClose();
      }
    } catch (error) {
      console.error("Address Submit Error:", error);
      toast.error(error?.response?.data?.message || "Failed to save address");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formContent = (
    <>
      <div className="flex items-center justify-between">
        <p className="font-bold text-xl text-gray-800">
          {payload?.address?._id ? "Edit Address" : "Add Address"}
        </p>
        {!isInsideModal && (
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-lg p-1"
          >
            ✘
          </button>
        )}
      </div>

      {/* Geolocation Button & Status */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm text-emerald-800 font-medium">
            <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Fast Setup via GPS</span>
          </div>
          <button
            type="button"
            onClick={handleDetectLocation}
            disabled={isDetectingLocation || isSubmitting}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-semibold rounded-lg shadow-sm transition-all disabled:opacity-50"
          >
            {isDetectingLocation ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Detecting...</span>
              </>
            ) : (
              <>
                <Navigation className="w-3.5 h-3.5" />
                <span>Use Current Location</span>
              </>
            )}
          </button>
        </div>
        {locationStatusMessage && (
          <p className="text-xs mt-2 text-emerald-700">
            {locationStatusMessage}
          </p>
        )}
      </div>

      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-3.5"
        >
          <div className="rounded-xl border border-gray-300 bg-[#eef0f4] px-4 py-2.5">
            <input
              type="text"
              name="name"
              placeholder="Contact Name"
              onChange={handleChange}
              value={formData?.name || ""}
              className="w-full bg-transparent outline-none text-gray-700 placeholder:text-gray-400 text-sm"
            />
          </div>
          <div className="rounded-xl border border-gray-300 bg-[#eef0f4] px-4 py-2.5">
            <input
              type="text"
              name="phone"
              value={formData?.phone || ""}
              placeholder="Phone Number"
              onChange={handleChange}
              className="w-full bg-transparent outline-none text-gray-700 placeholder:text-gray-400 text-sm"
            />
          </div>
          <div className="rounded-xl border border-gray-300 bg-[#eef0f4] px-4 py-2.5">
            <input
              type="text"
              name="street"
              placeholder="Street / Flat / Area"
              required
              onChange={handleChange}
              value={formData?.street || ""}
              className="w-full bg-transparent outline-none text-gray-700 placeholder:text-gray-400 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="rounded-xl border border-gray-300 bg-[#eef0f4] px-4 py-2.5">
              <input
                type="text"
                name="city"
                placeholder="City"
                required
                onChange={handleChange}
                value={formData?.city || ""}
                className="w-full bg-transparent outline-none text-gray-700 placeholder:text-gray-400 text-sm"
              />
            </div>
            <div className="rounded-xl border border-gray-300 bg-[#eef0f4] px-4 py-2.5">
              <input
                type="text"
                name="state"
                placeholder="State"
                required
                onChange={handleChange}
                value={formData?.state || ""}
                className="w-full bg-transparent outline-none text-gray-700 placeholder:text-gray-400 text-sm"
              />
            </div>
          </div>
          <div className="rounded-xl border border-gray-300 bg-[#eef0f4] px-4 py-2.5">
            <input
              type="number"
              name="pincode"
              placeholder="6-digit Pincode"
              required
              onChange={handleChange}
              value={formData?.pincode || ""}
              className="w-full bg-transparent outline-none text-gray-700 placeholder:text-gray-400 text-sm"
            />
          </div>

          <div className="flex justify-end items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setFormData(initialFormData);
                setLocationStatusMessage("");
              }}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-gray-600 rounded-lg hover:bg-gray-100 active:scale-95 transition-colors disabled:opacity-50"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isDetectingLocation}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-95 transition-colors shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : payload?.address?._id ? (
                "Update Address"
              ) : (
                "Save Address"
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );

  if (isInsideModal) {
    return (
      <div className="p-6 space-y-4 max-h-[85vh] overflow-y-auto custom-scrollbar">
        {formContent}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-gray-500/20 z-50">
      <div className="relative bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm md:max-w-sm lg:max-w-md space-y-4">
        {formContent}
      </div>
    </div>
  );
}

export default AddressForm;
