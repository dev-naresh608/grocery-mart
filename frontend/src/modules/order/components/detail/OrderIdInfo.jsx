import { SectionCard, SectionLabel } from "../../../../index";
import { toast } from "react-toastify";
import { CopyIcon } from "lucide-react";

const handleCopyId = (value) => {
  window.navigator.clipboard
    .writeText(value)
    .then(() => toast.success("id copied"))
    .catch((err) => {
      return toast.error(err.message);
    });
};

const InfoRow = ({ label, value }) => {
  return (
    <div>
      <p className="font-semibold">{label}</p>
      <p className="text-xs flex items-center gap-2">
        <span>{value}</span>
        <button onClick={() => handleCopyId(value)}>
          <CopyIcon size={12} />
        </button>
      </p>
    </div>
  );
};

const OrderIdInfo = ({ order }) => {
  if (!order) return null;

  const { _id: orderId, customer_id: customerId, store_id: storeId } = order;

  return (
    <SectionCard>
      <SectionLabel>order info</SectionLabel>
      <div className="text-sm text-gray-600 space-y-2">
        <InfoRow label="Order ID" value={orderId} />
        <InfoRow label="Customer ID" value={customerId} />
        <InfoRow label="Store ID" value={storeId} />
      </div>
    </SectionCard>
  );
};

export default OrderIdInfo;
