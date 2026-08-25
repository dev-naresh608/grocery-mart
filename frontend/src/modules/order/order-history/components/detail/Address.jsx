import { SectionCard, SectionLabel } from "@/components/common";
import { Store, MapPin } from "lucide-react";

const Address = ({ order_address, store_address, store_name }) => {
  const { street, city, state, pincode } = order_address || {};
  const CONFIG = [
    {
      icon: MapPin,
      text: "Delivery address",
      value: street || city ? `${street || ""}, ${city || ""}, ${state || ""}, ${pincode || ""}` : (typeof order_address === 'string' ? order_address : "N/A"),
      iconStyle: "text-blue-400",
    },

    {
      icon: Store,
      text: "Store address",
      value: store_address,
      iconStyle: "text-gray-500",
    },
  ];

  return (
    <SectionCard>
      <div className="flex items-center justify-between">
        <SectionLabel>ADDRESS</SectionLabel>
        <SectionLabel className="flex items-center gap-2">
          <Store size={15} />
          {store_name}
        </SectionLabel>
      </div>
      <div>
        {CONFIG.map((c, i) => {
          const Icon = c.icon;
          return (
            <div key={i} className="flex gap-2 py-2 text-sm">
              <div className="py-1">
                <Icon size={14} className={c.iconStyle} />
              </div>

              <div className="space-y-1">
                <span className="text-gray-400">{c.text}</span>
                <p className="text-gray-600 text-xs">{c.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
};

export default Address;
