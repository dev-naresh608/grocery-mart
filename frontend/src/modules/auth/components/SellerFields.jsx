import React, { useState } from "react";
import { Store, ChevronDown, Navigation, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";
import { reverseGeocodeApi } from "@/services/DistanceCalculator";

export default function SellerFields({
  formData,
  onChange,
  onSetCoordinates,
  categories,
}) {
  const [isDetecting, setIsDetecting] = useState(false);
  const [locationStatus, setLocationStatus] = useState("");

  const handleDetectLocation = () => {
    if (typeof window === "undefined" || !navigator?.geolocation) {
      toast.info("Geolocation is not supported by your browser. Please enter your store address manually.");
      return;
    }

    setIsDetecting(true);
    setLocationStatus("Detecting GPS and fetching street address...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        if (onSetCoordinates) {
          onSetCoordinates([longitude, latitude]);
        }

        try {
          const geoRes = await reverseGeocodeApi(latitude, longitude);
          if (geoRes && geoRes.success && geoRes.formattedAddress) {
            // Auto-fill store_address in formData
            const synthEvent = {
              target: {
                name: "store_address",
                value: geoRes.formattedAddress,
              },
            };
            onChange(synthEvent);
            setLocationStatus("📍 Address auto-filled from current location!");
            toast.success("Current address detected & filled successfully!");
          } else {
            // Fallback address text so required field is never empty
            const fallbackText = `Current Location (${latitude.toFixed(5)}, ${longitude.toFixed(5)})`;
            if (!formData.store_address?.trim()) {
              const synthEvent = {
                target: {
                  name: "store_address",
                  value: fallbackText,
                },
              };
              onChange(synthEvent);
            }
            setLocationStatus(`📍 GPS Set: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
            toast.success("GPS location set!");
          }
        } catch {
          const fallbackText = `Current Location (${latitude.toFixed(5)}, ${longitude.toFixed(5)})`;
          if (!formData.store_address?.trim()) {
            onChange({
              target: {
                name: "store_address",
                value: fallbackText,
              },
            });
          }
          setLocationStatus(`📍 GPS Set: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        } finally {
          setIsDetecting(false);
        }
      },
      (error) => {
        setIsDetecting(false);
        let msg = "Location permission was denied. Enter store address manually to continue.";
        if (error.code === 2) {
          msg = "Store location unavailable. Enter store address manually to continue.";
        } else if (error.code === 3) {
          msg = "Location request timed out. Enter store address manually to continue.";
        }
        setLocationStatus(msg);
        toast.info(msg);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const hasCoordinates =
    Array.isArray(formData?.coordinates) && formData.coordinates.length === 2;

  return (
    <div className="space-y-4">
      {/* STORE NAME */}
      <div>
        <p className="text-[#989da4] text-sm font-semibold">Store Name</p>

        <div className="flex items-center gap-3 rounded-xl border border-gray-300 bg-[#eef0f4] px-4 py-2">
          <Store className="text-gray-400" size={20} />

          <input
            required
            type="text"
            name="store_name"
            value={formData.store_name}
            placeholder="Enter store name..."
            onChange={onChange}
            className="w-full bg-transparent outline-none text-gray-600 placeholder:text-gray-400 text-sm"
          />
        </div>
      </div>

      {/* STORE CATEGORY */}
      <div>
        <p className="text-[#989da4] text-sm font-semibold">Store Category</p>

        <div className="flex items-center gap-3 rounded-xl border border-gray-300 bg-[#eef0f4] px-4 py-2">
          <ChevronDown className="text-gray-400" size={20} />

          <select
            name="store_type"
            value={formData.store_type}
            onChange={onChange}
            required
            className="w-full bg-transparent outline-none text-gray-600 text-sm"
          >
            <option value="">Select Category</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* STORE ADDRESS WITH GEOLOCATION AUTO-FILL */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-[#989da4] text-sm font-semibold">Store Address</p>

          <button
            type="button"
            onClick={handleDetectLocation}
            disabled={isDetecting}
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 transition-colors active:scale-95 disabled:opacity-50"
          >
            {isDetecting ? (
              <>
                <Loader2 size={13} className="animate-spin text-emerald-600" />
                <span>Fetching Address...</span>
              </>
            ) : hasCoordinates ? (
              <>
                <CheckCircle2 size={13} className="text-emerald-600" />
                <span>GPS & Address Set</span>
              </>
            ) : (
              <>
                <Navigation size={13} className="text-emerald-600" />
                <span>Use Current Location</span>
              </>
            )}
          </button>
        </div>

        <div className="rounded-xl border border-gray-300 bg-[#eef0f4] px-4 py-3">
          <textarea
            required
            name="store_address"
            value={formData.store_address}
            placeholder="Enter full store address (street, area, city, pincode)..."
            onChange={onChange}
            rows={3}
            className="w-full resize-none bg-transparent outline-none text-gray-600 placeholder:text-gray-400 text-sm"
          />
        </div>

        {locationStatus && (
          <p className="text-xs mt-1.5 text-emerald-700 font-medium">
            {locationStatus}
          </p>
        )}
      </div>
    </div>
  );
}