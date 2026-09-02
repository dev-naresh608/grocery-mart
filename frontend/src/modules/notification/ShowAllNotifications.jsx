import React from "react";
import {
  Bell,
  CheckCheck,
  Trash2,
  RefreshCw,
  Search,
  CheckCircle2,
  Package,
  Inbox,
  Filter,
} from "lucide-react";
import { useAllNotifications } from "./hooks/useAllNotifications";
import {
  NotificationCard,
  NotificationPagination,
  NotificationEmptyState,
} from "./components";

function ShowAllNotifications() {
  const {
    notifications,
    loading,
    filter,
    categoryType,
    searchTerm,
    page,
    limit,
    totalPages,
    total,
    unreadCount,
    readCount,
    totalAll,
    setPage,
    handleFilterChange,
    handleCategoryChange,
    handleSearchChange,
    handleMarkAsRead,
    handleMarkAsUnread,
    handleMarkAllAsRead,
    handleDeleteNotification,
    handleClearRead,
    refresh,
  } = useAllNotifications(8);

  const filterTabs = [
    { id: "all", label: "All", count: totalAll },
    { id: "unread", label: "Unread", count: unreadCount },
    { id: "read", label: "Read", count: readCount },
  ];

  const categoryTabs = [
    { id: "all", label: "All Types" },
    { id: "order", label: "Orders" },
    { id: "delivery", label: "Deliveries" },
    { id: "system", label: "System" },
    { id: "promotion", label: "Offers" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 font-sans">
      {/* ── Page Header ── */}
      <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-green-50 text-green-700 flex items-center justify-center border border-green-100 shadow-sm">
                <Bell size={20} strokeWidth={2.2} />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                Notifications & Activity
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Stay updated with your latest orders, deliveries, and system
              announcements.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={refresh}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-colors disabled:opacity-50"
              title="Refresh notifications"
            >
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
              <span>Refresh</span>
            </button>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-green-700 hover:bg-green-800 rounded-xl shadow-sm transition-colors"
              >
                <CheckCheck size={14} />
                <span>Mark All Read</span>
              </button>
            )}

            {readCount > 0 && (
              <button
                type="button"
                onClick={handleClearRead}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200/60 rounded-xl transition-colors"
                title="Clear all read notifications"
              >
                <Trash2 size={13} />
                <span>Clear Read</span>
              </button>
            )}
          </div>
        </div>

        {/* ── Stats Summary Bar ── */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-6 pt-6 border-t border-gray-100">
          <div className="bg-gray-50/80 rounded-2xl p-3 sm:p-4 border border-gray-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-700 flex-shrink-0">
              <Inbox size={16} />
            </div>
            <div>
              <p className="text-[11px] font-medium text-gray-500">Total</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
                {totalAll}
              </p>
            </div>
          </div>

          <div className="bg-green-50/60 rounded-2xl p-3 sm:p-4 border border-green-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white border border-green-200 flex items-center justify-center text-green-700 flex-shrink-0">
              <Bell size={16} />
            </div>
            <div>
              <p className="text-[11px] font-medium text-green-800">Unread</p>
              <p className="text-lg sm:text-xl font-bold text-green-800 leading-tight">
                {unreadCount}
              </p>
            </div>
          </div>

          <div className="bg-blue-50/60 rounded-2xl p-3 sm:p-4 border border-blue-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white border border-blue-200 flex items-center justify-center text-blue-700 flex-shrink-0">
              <CheckCircle2 size={16} />
            </div>
            <div>
              <p className="text-[11px] font-medium text-blue-800">Read</p>
              <p className="text-lg sm:text-xl font-bold text-blue-800 leading-tight">
                {readCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Toolbar: Search & Filter Tabs ── */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Status Tabs (All / Unread / Read) */}
          <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-xl overflow-x-auto">
            {filterTabs.map((tab) => {
              const isActive = filter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleFilterChange(tab.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isActive
                          ? "bg-gray-100 text-gray-800"
                          : "bg-gray-200/80 text-gray-600"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[220px] max-w-xs flex-1">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-green-600 outline-none transition-colors"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1 text-xs text-gray-400 font-medium mr-1">
            <Filter size={12} />
            <span>Type:</span>
          </div>
          {categoryTabs.map((cat) => {
            const isSelected = categoryType === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${
                  isSelected
                    ? "bg-green-700 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Notification List ── */}
      <div className="space-y-3">
        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <div className="w-8 h-8 border-3 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-gray-500">
              Loading your notifications...
            </p>
          </div>
        ) : notifications.length > 0 ? (
          <>
            <div className="space-y-3">
              {notifications.map((notification) => (
                <NotificationCard
                  key={notification._id || notification.id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                  onMarkAsUnread={handleMarkAsUnread}
                  onDelete={handleDeleteNotification}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="bg-white rounded-2xl border border-gray-200 px-4 mt-4 shadow-sm">
              <NotificationPagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={total}
                itemsPerPage={limit}
                onPageChange={setPage}
              />
            </div>
          </>
        ) : (
          <NotificationEmptyState
            type={
              searchTerm ? "search" : filter === "unread" ? "unread" : "default"
            }
            onAction={
              searchTerm
                ? () => handleSearchChange("")
                : filter !== "all"
                  ? () => handleFilterChange("all")
                  : undefined
            }
            actionLabel={
              searchTerm
                ? "Clear Search"
                : filter !== "all"
                  ? "View All Notifications"
                  : undefined
            }
          />
        )}
      </div>
    </div>
  );
}

export default ShowAllNotifications;
