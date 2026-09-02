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

import { SearchBar } from "@/components";
import { toast } from "react-toastify";

function Orders() {
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);

  const [allOrders, setAllOrders] = useState([]);
  const [activeCard, setActiveCard] = useState("total");
  const [searchValue, setSearchValue] = useState("");

  // Pagination & Summary state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [paginationMeta, setPaginationMeta] = useState(null);
  const [summaryStats, setSummaryStats] = useState(null);
  const [loading, setLoading] = useState(true);

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
          searchValue
        );

        if (!data.success) {
          return toast.error(data.message || "Failed to fetch orders");
        }

        const ordersList = data.orders || data.allOrders || [];
        const sortedOrders = sortOrderByDate(ordersList, "desc");

        setAllOrders(sortedOrders);
        if (data.pagination) {
          setPaginationMeta(data.pagination);
        }
        if (data.summary) {
          setSummaryStats(data.summary);
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

  const handleSearchChange = (val) => {
    setSearchValue(val);
    setPage(1);
  };

  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setPage(1);
  };

  // Memoize dashboardCards at top level according to React Rules of Hooks
  const dashboardCards = useMemo(() => {
    return dashboardCardsConfig(
      currentUser,
      setActiveCard,
      allOrders,
      summaryStats
    );
  }, [currentUser, setActiveCard, allOrders, summaryStats]);

  // ===================== 1. LOADING STATE =====================
  // While fetching data, show a centered spinner with zero card flashing
  if (loading && allOrders.length === 0 && !searchValue) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400 space-y-3">
        <Loader2 size={32} className="animate-spin text-emerald-600" />
        <p className="text-sm font-medium text-gray-500">Loading orders...</p>
      </div>
    );
  }

  // ===================== 2. CLEAN EMPTY STATE =====================
  // If no orders exist in history, render pure empty state with no cards/search bars
  if (!loading && allOrders.length === 0 && !searchValue) {
    return (
      <div className="min-h-[65vh] flex items-center justify-center p-4">
        <EmptyOrders currentUserRole={currentUser?.role} />
      </div>
    );
  }

  // ===================== 3. FULL ORDER HISTORY LAYOUT =====================
  const commonCss = "bg-white rounded-2xl border border-gray-200/90 shadow-xs";

  return (
    <div className="space-y-4 font-sans max-w-7xl mx-auto">
      {/* ================= HEADER CARDS ================= */}
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
          <div className="flex items-center gap-2 text-xs text-gray-500 self-end sm:self-auto shrink-0">
            <span>Per page:</span>
            <select
              value={limit}
              onChange={handleLimitChange}
              className="bg-gray-50 border border-gray-200 text-gray-800 font-semibold text-xs rounded-xl px-2.5 py-1.5 outline-none cursor-pointer"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {/* ================= LOADING & CONTENT STATE ================= */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400 space-y-2">
            <Loader2 size={26} className="animate-spin text-emerald-600" />
            <p className="text-xs font-medium">Updating orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <EmptyOrders
            currentUserRole={currentUser?.role}
            isSearchResult={Boolean(searchValue)}
            searchValue={searchValue}
            onClearSearch={() => setSearchValue("")}
          />
        ) : (
          /* ================= ORDER LIST TABLE ================= */
          <OrdersTable
            currentUserRole={currentUser?.role}
            allOrders={filteredOrders}
          />
        )}

        {/* ================= PAGINATION CONTROLS UI ================= */}
        {paginationMeta && paginationMeta.totalItems > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-gray-100 text-xs">
            {/* Range info */}
            <div className="text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {paginationMeta.skip + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-gray-900">
                {Math.min(
                  paginationMeta.skip + paginationMeta.limit,
                  paginationMeta.totalItems
                )}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">
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
                className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer font-semibold flex items-center gap-1"
              >
                <ChevronLeft size={14} /> Previous
              </button>

              {/* Number Buttons */}
              <div className="flex items-center gap-1">
                {Array.from(
                  { length: paginationMeta.totalPages },
                  (_, idx) => idx + 1
                )
                  .filter(
                    (p) =>
                      p === 1 ||
                      p === paginationMeta.totalPages ||
                      Math.abs(p - paginationMeta.currentPage) <= 1
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
                              ? "bg-emerald-700 text-white border-emerald-700 shadow-xs"
                              : "bg-white text-gray-800 border-gray-200 hover:bg-gray-50"
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
                className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer font-semibold flex items-center gap-1"
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
