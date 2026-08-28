import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "@/modules/auth/store/authSlice";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

import {
  DashboardCard,
  EmptyOrders,
  dashboardCardsConfig,
  OrdersTable,
  searchOrdersSvc,
  getAllOrdersSvc,
  sortOrderByDate,
} from "../index";

import { SearchBar } from "../../../index";
import { toast } from "react-toastify";

function Orders() {
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);

  const [allOrders, setAllOrders] = useState([]);
  const [activeCard, setActiveCard] = useState("total");
  const [searchValue, setSearchValue] = useState("");

  // Pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [paginationMeta, setPaginationMeta] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrderData = async () => {
      if (!currentUser?._id) return;
      try {
        setLoading(true);
        const { data } = await getAllOrdersSvc(
          currentUser._id,
          currentUser.role,
          page,
          limit,
          searchValue,
        );

        if (!data.success) {
          return toast.error(data.message || "Failed to fetch orders");
        }

        const ordersList = data.allOrders || data.orders || [];
        const sortedOrders = sortOrderByDate(ordersList, "desc");

        setAllOrders(sortedOrders);
        if (data.pagination) {
          setPaginationMeta(data.pagination);
          console.log(data.pagination);
        }
        dispatch(updateUser({ myOrders: ordersList }));
      } catch (err) {
        console.error("Fetch orders error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [currentUser?._id, currentUser?.role, page, limit, searchValue, dispatch]);

  const filteredOrders = useMemo(() => {
    let list = allOrders;

    if (activeCard === "active") {
      list = list.filter(
        (o) => o.order_status === "pending" || o.order_status === "preparing",
      );
    }

    return searchOrdersSvc(list, searchValue);
  }, [allOrders, activeCard, searchValue]);

  // Handle Search Input Change -> Reset to page 1
  const handleSearchChange = (val) => {
    setSearchValue(val);
    setPage(1);
  };

  // Handle Limit Change
  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setPage(1);
  };

  // ===================== EMPTY STATE =====================
  if (!loading && allOrders.length === 0 && !searchValue && page === 1) {
    return <EmptyOrders />;
  }

  // ===================== RENDER DASHBOARD CARDS =====================
  const dashboardCards = dashboardCardsConfig(
    currentUser,
    setActiveCard,
    allOrders,
  );

  const commonCss = "bg-white rounded-xl border border-[#E7E5E4] shadow-xs";

  return (
    <div className="space-y-4 font-sans">
      {/* ================= HEADER ================= */}
      <div className={`${commonCss} p-3`}>
        <div className="flex items-center gap-3 overflow-x-auto">
          {dashboardCards.map((card, i) => (
            <DashboardCard
              key={i}
              card={card}
              isActive={activeCard === card.id}
            />
          ))}
        </div>
      </div>

      <div className={`${commonCss} space-y-3 p-4`}>
        {/* ================= ORDER FILTER HEADER ================= */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full sm:w-auto flex-1">
            <SearchBar
              searchValue={searchValue}
              setSearchValue={handleSearchChange}
            />
          </div>

          {/* Items Per Page Selector */}
          <div className="flex items-center gap-2 text-xs text-[#78716C] self-end sm:self-auto shrink-0">
            <span>Per page:</span>
            <select
              value={limit}
              onChange={handleLimitChange}
              className="bg-[#F5F5F4] border border-[#E7E5E4] text-[#1C1917] font-semibold text-xs rounded-lg px-2 py-1.5 outline-none cursor-pointer"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {/* ================= LOADING STATE ================= */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-[#78716C] space-y-2">
            <Loader2 size={24} className="animate-spin text-[#6366F1]" />
            <p className="text-xs font-medium">Loading orders...</p>
          </div>
        ) : (
          /* ================= ORDER LIST TABLE ================= */
          <OrdersTable
            currentUserRole={currentUser?.role}
            allOrders={filteredOrders}
          />
        )}

        {/* ================= PAGINATION CONTROLS UI ================= */}
        {paginationMeta && paginationMeta.totalItems > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#E7E5E4] text-xs">
            {/* Range info */}
            <div className="text-[#78716C]">
              Showing{" "}
              <span className="font-semibold text-[#1C1917]">
                {paginationMeta.skip + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-[#1C1917]">
                {Math.min(
                  paginationMeta.skip + paginationMeta.limit,
                  paginationMeta.totalItems,
                )}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-[#1C1917]">
                {paginationMeta.totalItems}
              </span>{" "}
              orders
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-1.5">
              {/* Previous Page */}
              <button
                type="button"
                disabled={!paginationMeta.hasPrevPage || loading}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                className="px-3 py-1.5 rounded-lg border border-[#E7E5E4] bg-white text-[#1C1917] hover:bg-[#F5F5F4] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer font-semibold flex items-center gap-1"
              >
                <ChevronLeft size={14} /> Previous
              </button>

              {/* Number Buttons */}
              <div className="flex items-center gap-1">
                {Array.from(
                  { length: paginationMeta.totalPages },
                  (_, idx) => idx + 1,
                )
                  .filter(
                    (p) =>
                      p === 1 ||
                      p === paginationMeta.totalPages ||
                      Math.abs(p - paginationMeta.currentPage) <= 1,
                  )
                  .map((p, idx, arr) => {
                    const showEllipsis = idx > 0 && p - arr[idx - 1] > 1;
                    return (
                      <React.Fragment key={p}>
                        {showEllipsis && (
                          <span className="px-1 text-gray-400">...</span>
                        )}
                        <button
                          type="button"
                          disabled={loading}
                          onClick={() => setPage(p)}
                          className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                            paginationMeta.currentPage === p
                              ? "bg-[#6366F1] text-white border-[#6366F1] shadow-xs"
                              : "bg-white text-[#1C1917] border-[#E7E5E4] hover:bg-[#F5F5F4]"
                          }`}
                        >
                          {p}
                        </button>
                      </React.Fragment>
                    );
                  })}
              </div>

              {/* Next Page */}
              <button
                type="button"
                disabled={!paginationMeta.hasNextPage || loading}
                onClick={() => setPage((prev) => prev + 1)}
                className="px-3 py-1.5 rounded-lg border border-[#E7E5E4] bg-white text-[#1C1917] hover:bg-[#F5F5F4] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer font-semibold flex items-center gap-1"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;
