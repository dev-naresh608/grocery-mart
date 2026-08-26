import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "@/modules/auth/store/authSlice";

import {
  DashboardCard,
  EmptyOrders,
  dashboardCardsConfig,
  OrdersTable,
  searchOrdersSvc,
  getAllOrdersSvc,
  sortOrderByDate,
} from "../index";

import { SearchBar } from "@/components";
import { toast } from "react-toastify";

function Orders() {
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);

  const [allOrders, setAllOrders] = useState([]);
  const [activeCard, setActiveCard] = useState("total");
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const fetchOrderData = async () => {
      if (!currentUser?._id) return;
      const { data } = await getAllOrdersSvc(currentUser._id, currentUser.role);
      if (!data.success) {
        return toast.error(data.message);
      }
      const sortedOrders = sortOrderByDate(data.allOrders, "desc");
      setAllOrders(sortedOrders);
      dispatch(updateUser({ myOrders: data.allOrders }));
    };

    fetchOrderData();
  }, [currentUser?._id, currentUser?.role, dispatch]);

  const filteredOrders = useMemo(() => {
    let list = allOrders;

    if (activeCard === "completed") {
      list = list.filter(
        (o) => o.order_status === "completed" || o.order_status === "delivered"
      );
    } else if (activeCard === "cancelled") {
      list = list.filter(
        (o) => o.order_status === "rejected" || o.order_status === "cancelled"
      );
    }

    return searchOrdersSvc(list, searchValue);
  }, [allOrders, activeCard, searchValue]);

  // ===================== EMPTY STATE =====================
  if (allOrders.length === 0) {
    return <EmptyOrders />;
  }

  // ===================== RENDER DASHBOARD CARDS =====================
  const dashboardCards = dashboardCardsConfig(
    currentUser,
    setActiveCard,
    allOrders,
  );

  // ===================== CSS =====================
  const commonCss = "bg-white rounded-xl border shadow-md";

  return (
    <div className="space-y-4">
      {/* ================= HEADER ================= */}
      <div className={`${commonCss} p-3`}>
        <div className="flex items-center gap-3">
          {dashboardCards.map((card, i) => (
            <DashboardCard
              key={i}
              card={card}
              isActive={activeCard === card.id}
            />
          ))}
        </div>
      </div>

      <div className={`${commonCss} space-y-2 p-3`}>
        {/* ================= ORDER FILTER HEADER ================= */}
        <SearchBar
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />

        {/* ================= ORDER LIST TABLE ================= */}
        <OrdersTable
          currentUserRole={currentUser?.role}
          allOrders={filteredOrders}
        />
      </div>
    </div>
  );
}

export default Orders;
