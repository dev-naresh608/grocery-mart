import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { updateUser } from "@/modules/auth/store/authSlice";
import { toast } from "react-toastify";
import {
  Plus,
  RefreshCw,
  Search,
  X,
  LayoutGrid,
  List,
  Eye,
  EyeOff,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Package,
  SlidersHorizontal,
  RotateCcw,
} from "lucide-react";

import {
  EmptyProducts,
  getAllProductsApi,
  toggleProductMenuStatusApi,
  deleteProductApi,
  ProductTable,
  ProductGridView,
  filterProductsSvc,
} from "../index";
import { useModal, MODAL_TYPES } from "@/components";

function ProductListPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { openModal } = useModal();
  const { user: currentUser } = useSelector((state) => state.auth);

  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [menuToggleLoadingId, setMenuToggleLoadingId] = useState(null);

  // Single Source of Truth Filter States
  const [searchValue, setSearchValue] = useState("");
  const [menuFilter, setMenuFilter] = useState("all"); // "all", "in_menu", "hidden"
  const [stockFilter, setStockFilter] = useState("all"); // "all", "in_stock", "out_of_stock"
  const [offerFilter, setOfferFilter] = useState("all"); // "all", "offers_only"
  const [weightTypeFilter, setWeightTypeFilter] = useState("all"); // "all", "g", "kg", "ml", "ltr", "none"
  const [sortBy, setSortBy] = useState("newest"); // "newest", "oldest", "price_low", "price_high", "margin_high", "name_asc", "name_desc"
  const [viewMode, setViewMode] = useState("table"); // "table" | "grid"

  // Multi-selection states for bulk actions
  const [selectedIds, setSelectedIds] = useState([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const sellerId = currentUser?.store_id || currentUser?._id;

  // ================= FETCH ALL PRODUCTS =================
  const fetchProducts = useCallback(
    async (isRefresh = false) => {
      if (!sellerId) return;
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const data = await getAllProductsApi(sellerId);
        if (!data || !data.success) {
          if (data?.message) toast.error(data.message);
          setAllProducts([]);
          return;
        }

        const products = data.result || data.products || [];
        setAllProducts(products);
        dispatch(updateUser({ productList: products }));

        if (isRefresh) {
          toast.success("Products refreshed!");
        }
      } catch (err) {
        toast.error(err.message || "Failed to fetch products");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [sellerId, dispatch]
  );

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ================= COMBINED FILTER & SORT =================
  const filteredProducts = useMemo(() => {
    return filterProductsSvc(allProducts, {
      searchValue,
      menuFilter,
      stockFilter,
      weightTypeFilter,
      offerFilter,
      sortBy,
    });
  }, [
    allProducts,
    searchValue,
    menuFilter,
    stockFilter,
    weightTypeFilter,
    offerFilter,
    sortBy,
  ]);

  // Reset to page 1 & clear selections when filters change
  useEffect(() => {
    setCurrentPage(1);
    setSelectedIds([]);
  }, [searchValue, menuFilter, stockFilter, offerFilter, weightTypeFilter, sortBy]);

  // ================= PAGINATION SLICING =================
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  // ================= TOGGLE MENU STATUS (OPTIMISTIC) =================
  const handleToggleMenuStatus = async (productId, newStatus) => {
    const previousProducts = [...allProducts];

    // Optimistic update
    setAllProducts((prev) =>
      prev.map((p) => (p._id === productId ? { ...p, show_in_menu: newStatus } : p))
    );
    setMenuToggleLoadingId(productId);

    try {
      const response = await toggleProductMenuStatusApi(
        productId,
        currentUser?._id,
        newStatus
      );

      if (response && response.success) {
        toast.success(
          newStatus
            ? "Product is now visible in store menu!"
            : "Product hidden from store menu"
        );
      } else {
        throw new Error(response?.message || "Failed to update menu status");
      }
    } catch (error) {
      // Rollback
      setAllProducts(previousProducts);
      toast.error(error.message || "Failed to update menu status");
    } finally {
      setMenuToggleLoadingId(null);
    }
  };

  // ================= SINGLE DELETE PRODUCT =================
  const handleDeleteProduct = (productId, productName) => {
    openModal(MODAL_TYPES.CONFIRM, {
      title: "Delete Product?",
      message: `Are you sure you want to delete "${
        productName || "this product"
      }"? This will permanently remove it from your inventory.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      type: "danger",
      onConfirm: async () => {
        try {
          const res = await deleteProductApi(productId, currentUser?._id);
          if (res && res.success) {
            setAllProducts((prev) => prev.filter((p) => p._id !== productId));
            setSelectedIds((prev) => prev.filter((id) => id !== productId));
            toast.success("Product deleted successfully");
          } else {
            toast.error(res?.message || "Failed to delete product");
          }
        } catch (error) {
          toast.error(error.message || "Failed to delete product");
        }
      },
    });
  };

  // ================= MULTI-SELECT HANDLERS =================
  const handleToggleSelect = (productId) => {
    setSelectedIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map((p) => p._id));
    }
  };

  // ================= BULK ACTIONS =================
  const handleBulkMenuVisibility = async (status) => {
    if (selectedIds.length === 0) return;
    const targetIds = [...selectedIds];

    // Optimistic update
    setAllProducts((prev) =>
      prev.map((p) =>
        targetIds.includes(p._id) ? { ...p, show_in_menu: status } : p
      )
    );

    try {
      await Promise.all(
        targetIds.map((id) =>
          toggleProductMenuStatusApi(id, currentUser?._id, status)
        )
      );
      toast.success(
        status
          ? `${targetIds.length} products listed in store menu!`
          : `${targetIds.length} products hidden from store menu!`
      );
      setSelectedIds([]);
    } catch (err) {
      toast.error("Some updates could not be completed. Refreshing list...");
      fetchProducts();
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;

    openModal(MODAL_TYPES.CONFIRM, {
      title: `Delete ${selectedIds.length} Products?`,
      message: `Are you sure you want to permanently delete these ${selectedIds.length} selected products? This action cannot be undone.`,
      confirmText: "Delete Selected",
      cancelText: "Cancel",
      type: "danger",
      onConfirm: async () => {
        try {
          await Promise.all(
            selectedIds.map((id) => deleteProductApi(id, currentUser?._id))
          );
          setAllProducts((prev) =>
            prev.filter((p) => !selectedIds.includes(p._id))
          );
          toast.success(`${selectedIds.length} products deleted successfully`);
          setSelectedIds([]);
        } catch (err) {
          toast.error("Failed to delete some products. Refreshing...");
          fetchProducts();
        }
      },
    });
  };

  // ================= RESET ALL FILTERS =================
  const handleResetFilters = () => {
    setSearchValue("");
    setMenuFilter("all");
    setStockFilter("all");
    setOfferFilter("all");
    setWeightTypeFilter("all");
    setSortBy("newest");
    setSelectedIds([]);
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchValue.trim() !== "" ||
    menuFilter !== "all" ||
    stockFilter !== "all" ||
    offerFilter !== "all" ||
    weightTypeFilter !== "all" ||
    sortBy !== "newest";

  // ================= LOADING STATE =================
  if (loading && allProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
        <div className="w-9 h-9 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-semibold text-gray-500">Loading products inventory...</p>
      </div>
    );
  }

  // ================= EMPTY STATE (NO PRODUCTS) =================
  if (!loading && allProducts.length === 0) {
    return <EmptyProducts />;
  }

  return (
    <div className="space-y-3.5 font-sans max-w-7xl mx-auto px-1 sm:px-2 py-1">
      {/* ================= 1. PAGE HEADER (ONE-LINE CLEAN LAYOUT) ================= */}
      <div className="bg-white rounded-2xl border border-gray-200/90 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3.5">
          {/* Left: Title & Subtitle */}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-0.5">
              <Link
                to="/dashboard"
                className="hover:text-emerald-700 transition-colors"
              >
                Dashboard
              </Link>
              <span>/</span>
              <span className="text-emerald-700 font-bold">Products</span>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight whitespace-nowrap">
                Products Inventory
              </h1>
              <span className="px-2 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-200/80 whitespace-nowrap">
                {allProducts.length} Items
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5 font-medium whitespace-normal sm:whitespace-nowrap truncate">
              Manage product pricing, stock availability, and store menu visibility.
            </p>
          </div>

          {/* Right: Actions Header Buttons */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
            {/* Refresh */}
            <button
              type="button"
              onClick={() => fetchProducts(true)}
              disabled={refreshing}
              className="p-2 sm:px-3 sm:py-2 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 active:scale-95 transition-all shadow-xs cursor-pointer flex items-center gap-1.5 text-xs font-bold whitespace-nowrap"
              title="Refresh Products"
            >
              <RefreshCw
                size={14}
                className={refreshing ? "animate-spin text-emerald-600" : ""}
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            {/* + Add Product */}
            <button
              type="button"
              onClick={() => navigate("/addproducts")}
              className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-700/20 hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer shrink-0 whitespace-nowrap"
            >
              <Plus size={16} strokeWidth={2.5} />
              <span>Add Product</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================= 2. FILTER, SEARCH & CONTROLS ================= */}
      <div className="bg-white rounded-2xl border border-gray-200/90 p-3.5 sm:p-4 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
          {/* Live Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search by product name, ID, price..."
              className="w-full pl-9 pr-9 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs sm:text-sm font-medium text-gray-800 placeholder-gray-400 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />
            {searchValue && (
              <button
                type="button"
                onClick={() => setSearchValue("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full cursor-pointer"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Filter Dropdowns & Controls */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 sm:pb-0 shrink-0">
            {/* Menu Visibility Filter */}
            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 whitespace-nowrap">
              <Eye size={13} className="text-gray-500" />
              <select
                value={menuFilter}
                onChange={(e) => setMenuFilter(e.target.value)}
                className="bg-transparent text-xs font-bold text-gray-700 outline-none cursor-pointer"
              >
                <option value="all">All Menu Status</option>
                <option value="in_menu">Listed in Menu</option>
                <option value="hidden">Hidden from Menu</option>
              </select>
            </div>

            {/* Stock Status Filter */}
            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 whitespace-nowrap">
              <Package size={13} className="text-gray-500" />
              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                className="bg-transparent text-xs font-bold text-gray-700 outline-none cursor-pointer"
              >
                <option value="all">All Stock</option>
                <option value="in_stock">In Stock</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 whitespace-nowrap">
              <SlidersHorizontal size={13} className="text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs font-bold text-gray-700 outline-none cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="margin_high">Highest Margin</option>
                <option value="name_asc">Name: A to Z</option>
                <option value="name_desc">Name: Z to A</option>
              </select>
            </div>

            {/* View Mode Toggle (Table / Grid) */}
            <div className="flex items-center p-0.5 bg-gray-100 rounded-xl border border-gray-200/80 shrink-0">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === "table"
                    ? "bg-white text-emerald-700 shadow-xs font-bold"
                    : "text-gray-500 hover:text-gray-800"
                }`}
                title="Table View"
              >
                <List size={15} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-white text-emerald-700 shadow-xs font-bold"
                    : "text-gray-500 hover:text-gray-800"
                }`}
                title="Grid Cards View"
              >
                <LayoutGrid size={15} />
              </button>
            </div>

            {/* Reset Filters button */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer border border-rose-200 shrink-0 whitespace-nowrap"
                title="Reset all search and filters"
              >
                <RotateCcw size={12} />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* ================= 4. BULK ACTIONS FLOATING / INLINE BAR ================= */}
        {selectedIds.length > 0 && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-700 text-white text-xs font-bold flex items-center justify-center">
                {selectedIds.length}
              </span>
              <span className="text-xs font-bold text-emerald-900">
                Products Selected
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Bulk Show in Menu */}
              <button
                type="button"
                onClick={() => handleBulkMenuVisibility(true)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer whitespace-nowrap"
              >
                <Eye size={12} />
                <span>Show in Menu</span>
              </button>

              {/* Bulk Hide from Menu */}
              <button
                type="button"
                onClick={() => handleBulkMenuVisibility(false)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer whitespace-nowrap"
              >
                <EyeOff size={12} />
                <span>Hide from Menu</span>
              </button>

              {/* Bulk Delete */}
              <button
                type="button"
                onClick={handleBulkDelete}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer whitespace-nowrap"
              >
                <Trash2 size={12} />
                <span>Delete Selected</span>
              </button>

              {/* Deselect */}
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="px-2.5 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-600 hover:text-gray-800 text-xs font-semibold cursor-pointer whitespace-nowrap"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* ================= 5. PRODUCT LIST CONTENT (TABLE OR GRID) ================= */}
        {filteredProducts.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <Package size={36} className="text-gray-300 mb-2.5" />
            <h3 className="text-sm font-bold text-gray-700">
              No products found matching your filters
            </h3>
            <p className="text-xs text-gray-400 max-w-xs mt-1">
              Try changing your search term or clearing active filters.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-3.5 px-3.5 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        ) : viewMode === "table" ? (
          <ProductTable
            allProducts={paginatedProducts}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
            onSelectAll={handleSelectAll}
            onToggleMenuStatus={handleToggleMenuStatus}
            onDeleteProduct={handleDeleteProduct}
            menuToggleLoadingId={menuToggleLoadingId}
          />
        ) : (
          <ProductGridView
            products={paginatedProducts}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
            onToggleMenuStatus={handleToggleMenuStatus}
            onDeleteProduct={handleDeleteProduct}
            menuToggleLoadingId={menuToggleLoadingId}
          />
        )}

        {/* ================= 6. PAGINATION CONTROLS ================= */}
        {totalItems > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-gray-100 text-xs font-medium">
            {/* Range info & Per page */}
            <div className="flex items-center gap-3 text-gray-500 flex-wrap justify-center sm:justify-start">
              <span>
                Showing{" "}
                <span className="font-bold text-gray-800">
                  {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}
                </span>{" "}
                to{" "}
                <span className="font-bold text-gray-800">
                  {Math.min(currentPage * itemsPerPage, totalItems)}
                </span>{" "}
                of{" "}
                <span className="font-bold text-gray-800">{totalItems}</span>{" "}
                products
              </span>

              {/* Per page selector */}
              <div className="flex items-center gap-1.5 pl-3 border-l border-gray-200">
                <span>Per page:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 font-bold text-gray-800 outline-none cursor-pointer"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <ChevronLeft size={13} /> Prev
              </button>

              {/* Page numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, idx) => idx + 1)
                  .filter(
                    (p) =>
                      p === 1 ||
                      p === totalPages ||
                      Math.abs(p - currentPage) <= 1
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
                          onClick={() => setCurrentPage(p)}
                          className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                            currentPage === p
                              ? "bg-emerald-700 text-white border-emerald-700 shadow-xs"
                              : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          {p}
                        </button>
                      </React.Fragment>
                    );
                  })}
              </div>

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                Next <ChevronRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductListPage;
