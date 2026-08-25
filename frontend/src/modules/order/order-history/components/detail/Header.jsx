import { SectionCard } from "@/components/common";
import { formatDate } from "../../utils";

function OrderHeaderDetail({ orderId, createdAt, cfg }) {
  return (
    <SectionCard>
      <div className="flex justify-between">
        <div className="font-semibold text-gray-600 tracking-tight">
          <p>Order #{orderId?.slice(0, 6).toLowerCase()}</p>
          <div className="text-gray-400 text-xs">
            {createdAt && <p>{formatDate(createdAt)}</p>}
          </div>
        </div>
        <div
          className={`rounded-2xl py-1 px-2.5 text-sm flex h-max w-max items-center gap-2 font-semibold ${cfg?.pillStyle}`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full block bg-yellow-600`}
          ></span>
          <span> {cfg?.label}</span>
        </div>
      </div>
    </SectionCard>
  );
}

export default OrderHeaderDetail;
