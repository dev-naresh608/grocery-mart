import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "lucide-react";
import api from "../../../configs/api";
import { toast } from "react-toastify";
import {
  orderStatusConfig,
  OrderHeaderDetail,
  CustomerInfo,
  Address,
  PriceBreakdown,
  OrderItemsComponent,
  OrderIdInfo,
} from "../index";

function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [orderItems, setOrderItems] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      setLoading(true);
      try {
        const { data } = await api.get(
          `/order/detail/${orderId}`,
        );
        if (!data.success) {
          toast.error(data.message);
          return;
        }
        setOrder(data.result);
        setOrderItems(data.result?.order_items || []);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  // ================== STATUS CONFIG ====================
  const STATUS_CONFIG = orderStatusConfig();
  const cfg = order ? STATUS_CONFIG[order.order_status] : null;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-sm font-semibold text-gray-500">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm max-w-md mx-auto my-10">
        <h2 className="text-lg font-bold text-gray-800">Order Not Found</h2>
        <p className="text-sm text-gray-500 mt-1">We couldn't retrieve the details for this order.</p>
        <button
          type="button"
          onClick={() => navigate("/orders")}
          className="mt-5 px-5 py-2.5 bg-green-700 hover:bg-green-800 text-white rounded-2xl text-xs font-bold transition-all cursor-pointer border-none"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* ============= BACK TO ORDERS BUTTON ============== */}
      <div className="pb-2">
        <button
          onClick={() => navigate("/orders")}
          className="flex items-center gap-1 text-green-700 hover:text-green-800 font-semibold duration-100"
        >
          <ArrowLeftIcon size={18} strokeWidth={2.5} />
          <span className="text-sm">Back to Orders</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="md:col-span-12">
          {/* ============= ORDER - HEADER ============== */}
          <OrderHeaderDetail
            orderId={orderId}
            createdAt={order?.createdAt}
            cfg={cfg}
          />
        </div>

        <div className="md:col-span-4">
          {/* ================== CUSTOMER INFO COMPONENT ==================== */}
          <CustomerInfo order={order} />
        </div>
        <div className="md:col-span-4">
          {/* ================== ADDRESS COMPONENT ==================== */}
          <Address
            order_address={order?.order_address}
            store_address={order?.store_address}
            store_name={order?.store_name}
          />
        </div>
        <div className="md:col-span-4">
          {/* ================== ORDER PRICE BREAKDOWN COMPONENT ==================== */}
          <PriceBreakdown price_detail={order?.price_detail} />
        </div>
        <div className="md:col-span-8">
          {/* ================== ORDER ITEMS COMPONENT==================== */}
          <OrderItemsComponent order={order} orderItems={orderItems} />
        </div>
        <div className="md:col-span-4 ">
          {/* ================== ORDER ID'S COMPONENT ==================== */}
          <OrderIdInfo order={order} />
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;
