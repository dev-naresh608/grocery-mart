import React, {useContext, useEffect} from "react";
import { OrderHistoryContext, UserContext } from "../../contexts/context";

function Payment() {
    const { setActiveTab} = useContext(UserContext);
  useEffect(() => setActiveTab("payments"), [])
  return (
    <>
      <div className="w-full h-full max-w-4xl mx-auto bg-white shadow-md rounded-2xl p-6 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-xl font-semibold">Payments</h2>
          <p className="text-sm text-gray-500">Manage your Payment details</p>
        </div>
        <div className="flex justify-center">
          <h2 className="text-3xl">COMING SOON...</h2>
        </div>
      </div>
    </>
  );
}

export default Payment;
