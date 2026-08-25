import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "lucide-react";
import api from "@/configs/api";
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

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      try {
        const { data } = await api.get(
          `/order/detail/${orderId}`,
        );
        if (!data.success) {
          return toast.error(data.message);
        }
        setOrder(data.result);
        setOrderItems(data.result.order_items);
      } catch (error) {
        return toast.error(error.message);
      }
    };
    fetchOrder();
  }, [orderId]);

  // ================== STATUS CONFIG ====================
  const STATUS_CONFIG = orderStatusConfig();
  const cfg = STATUS_CONFIG[order?.order_status];

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
