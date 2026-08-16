import React from "react";
import { CreditCard, Clock } from "lucide-react";

function Payment() {
  return (
    <div className="bg-white h-full p-6 font-sans space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-[#1C1917]">Payments</h2>
        <p className="text-xs text-[#A8A29E] mt-0.5">Manage your payment details</p>
      </div>

      {/* Coming soon */}
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#F5F5F4] flex items-center justify-center mx-auto mb-4">
          <CreditCard size={28} className="text-[#A8A29E]" strokeWidth={1.5} />
        </div>
        <h3 className="text-base font-semibold text-[#1C1917]">Coming Soon</h3>
        <p className="text-sm text-[#78716C] mt-1.5 max-w-xs">
          Payment management is under development. You'll be able to manage cards
          and view transaction history here.
        </p>
        <div className="flex items-center gap-1.5 mt-5 text-xs font-medium text-[#A8A29E] bg-[#F5F5F4] px-3 py-1.5 rounded-full">
          <Clock size={12} strokeWidth={2} />
          In development
        </div>
      </div>
    </div>
  );
}

export default Payment;
