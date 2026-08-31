import React, { useState } from "react";
import { Store, ChevronDown, Navigation, Loader2, CheckCircle2, MapPin } from "lucide-react";
import { toast } from "react-toastify";
import { reverseGeocodeApi } from "@/services/DistanceCalculator";

export default function SellerFields({
  formData,
  onChange,
  onSetCoordinates,
  categories,
}) {
  const [isDetecting, setIsDetecting] = useState(false);
  const [locationBadge, setLocationBadge] = useState("");

  const handleDetectLocation = () => {
    if (typeof window === "undefined" || !navigator?.geolocation) {
      toast.info("Geolocation is not supported by your browser. Please enter your store address manually.");
      return;
    }

    setIsDetecting(true);
    setLocationBadge("Detecting GPS coordinates...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        if (onSetCoordinates) {
          onSetCoordinates([longitude, latitude]);
        }

        setLocationBadge(`📍 GPS Location Attached (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);

        // Attempt reverse geocoding to suggest address text only if address field is empty
        try {
          const geoRes = await reverseGeocodeApi(latitude, longitude);
          if (geoRes && geoRes.success && geoRes.formattedAddress) {
            // Only auto-fill if user hasn't already typed their address
            if (!formData.store_address || formData.store_address.startsWith("Current Location")) {
              const synthEvent = {
                target: {
                  name: "store_address",
                  value: geoRes.formattedAddress,
                },
              };
              onChange(synthEvent);
              toast.success("Current address auto-filled! You can edit or add shop/room details.");
            } else {
              toast.success("GPS coordinates attached to your store address!");
            }
          } else {
            toast.success("GPS coordinates attached! Please enter your store street address below.");
          }
        } catch {
          toast.success("GPS coordinates attached! Please enter your store street address below.");
        } finally {
          setIsDetecting(false);
        }
      },
      (error) => {
        setIsDetecting(false);
        let msg = "Location permission was denied. Please enter your store address manually.";
        if (error.code === 2) {
          msg = "GPS location unavailable. Please enter your store address manually.";
        } else if (error.code === 3) {
          msg = "GPS request timed out. Please enter your store address manually.";
        }
        setLocationBadge("");
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

      {/* STORE ADDRESS WITH GPS ATTACH BUTTON */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <MapPin size={15} className="text-emerald-600" />
            <p className="text-[#989da4] text-sm font-semibold">Store Address</p>
          </div>

          <button
            type="button"
            onClick={handleDetectLocation}
            disabled={isDetecting}
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 transition-colors active:scale-95 disabled:opacity-50"
          >
            {isDetecting ? (
              <>
                <Loader2 size={13} className="animate-spin text-emerald-600" />
                <span>Locating...</span>
              </>
            ) : hasCoordinates ? (
              <>
                <CheckCircle2 size={13} className="text-emerald-600" />
                <span>GPS Attached</span>
              </>
            ) : (
              <>
                <Navigation size={13} className="text-emerald-600" />
                <span>Attach Current Location</span>
              </>
            )}
          </button>
        </div>

        <div className="rounded-xl border border-gray-300 bg-[#eef0f4] px-4 py-3">
          <textarea
            required
            name="store_address"
            value={formData.store_address}
            placeholder="Enter store postal address (e.g., Shop 4, Main Street, Indiranagar, Bengaluru, 560038)..."
            onChange={onChange}
            rows={3}
            className="w-full resize-none bg-transparent outline-none text-gray-600 placeholder:text-gray-400 text-sm"
          />
        </div>

        {locationBadge && (
          <p className="text-xs mt-1.5 text-emerald-700 font-medium">
            {locationBadge}
          </p>
        )}
      </div>
    </div>
  );
}