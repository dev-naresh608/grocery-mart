import React from "react";
import { NavLink } from "react-router-dom";
import { Bell, CheckCheck, X, Sparkles, ArrowRight } from "lucide-react";
import { useNotificationToggle } from "../hooks/useNotificationToggle";
import NotificationCard from "./NotificationCard";

function NotificationToggle({ isOpen, onToggle, onClose }) {
  const {
    unreadNotifications,
    unreadCount,
    loading,
    handleMarkAsRead,
    handleMarkAllAsRead,
  } = useNotificationToggle(isOpen);

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        type="button"
        onClick={onToggle}
        className="relative p-2 rounded-xl text-gray-700 hover:text-green-700 hover:bg-gray-100 transition-colors cursor-pointer outline-none border-none bg-transparent flex items-center justify-center"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-gray-700 hover:text-green-700 transition-colors" />

        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-red-600 rounded-full ring-2 ring-white animate-in zoom-in-50">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-[90vw] sm:w-[380px] max-w-[420px] bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150 font-sans">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100 bg-gray-50/70">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <span className="text-[11px] font-semibold text-green-800 bg-green-100 px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllAsRead}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-700 hover:text-green-800 hover:bg-green-50 px-2 py-1 rounded-lg transition-colors border-none bg-transparent cursor-pointer"
                  title="Mark all as read"
                >
                  <CheckCheck size={13} />
                  <span>Mark all read</span>
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200/60 rounded-lg transition-colors border-none bg-transparent cursor-pointer"
                aria-label="Close"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* List Content */}
          <div className="max-h-[360px] overflow-y-auto p-3 space-y-2.5">
            {loading ? (
              <div className="py-10 text-center text-xs text-gray-400 space-y-2">
                <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p>Loading notifications...</p>
              </div>
            ) : unreadNotifications.length > 0 ? (
              unreadNotifications.map((notification) => (
                <NotificationCard
                  key={notification._id || notification.id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                  onCloseDropdown={onClose}
                />
              ))
            ) : (
              <div className="py-10 px-4 text-center">
                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-2.5 text-green-600">
                  <Sparkles size={22} />
                </div>
                <h4 className="text-sm font-semibold text-gray-800">
                  All caught up!
                </h4>
                <p className="text-xs text-gray-500 mt-1 max-w-[240px] mx-auto">
                  You don't have any unread notifications right now.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 border-t border-gray-100 bg-gray-50/50">
            <NavLink
              to="/allnotifications"
              onClick={onClose}
              className="flex items-center justify-center gap-1.5 w-full py-2 px-3 text-xs font-semibold text-gray-700 hover:text-green-800 hover:bg-white rounded-xl border border-transparent hover:border-gray-200 transition-all shadow-none hover:shadow-sm"
            >
              <span>View All Notifications & Activity</span>
              <ArrowRight size={13} />
            </NavLink>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationToggle;
