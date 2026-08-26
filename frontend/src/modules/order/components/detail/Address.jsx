import { SectionCard, SectionLabel } from "@/components/common";
import { Store, MapPin } from "lucide-react";

const formatAddressStr = (addr) => {
  if (!addr) return "N/A";
  if (typeof addr === "string") return addr;
  if (typeof addr === "object") {
    const { street, city, state, pincode, fullAddress, addressLine, address } = addr;
    if (fullAddress) return fullAddress;
    if (addressLine) return addressLine;
    if (address) return typeof address === "string" ? address : formatAddressStr(address);
    const parts = [street, city, state, pincode].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "N/A";
  }
  return String(addr);
};

const Address = ({ order_address, store_address, store_name }) => {
  const deliveryAddrStr = formatAddressStr(order_address);
  const storeAddrStr = formatAddressStr(store_address);

  const CONFIG = [
    {
      icon: MapPin,
      text: "Delivery address",
      value: deliveryAddrStr,
      iconStyle: "text-blue-400",
    },

    {
      icon: Store,
      text: "Store address",
      value: storeAddrStr,
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
