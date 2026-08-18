import React from "react";
import { BellOff, CheckCircle2, Search, Inbox } from "lucide-react";

function NotificationEmptyState({
  type = "default",
  title,
  message,
  actionLabel,
  onAction,
}) {
  const getIcon = () => {
    switch (type) {
      case "all-caught-up":
        return <CheckCircle2 size={32} className="text-green-600" />;
      case "search":
        return <Search size={32} className="text-gray-400" />;
      case "unread":
        return <CheckCircle2 size={32} className="text-green-600" />;
      default:
        return <BellOff size={32} className="text-gray-400" />;
    }
  };

  const getDefaultTitle = () => {
    switch (type) {
      case "all-caught-up":
        return "All Caught Up!";
      case "unread":
        return "No Unread Notifications";
      case "search":
        return "No Matching Notifications";
      default:
        return "No Notifications Yet";
    }
  };

  const getDefaultMessage = () => {
    switch (type) {
      case "all-caught-up":
        return "You have read all your notifications. New updates will show up here.";
      case "unread":
        return "You're all caught up with your latest updates and order status.";
      case "search":
        return "We couldn't find any notifications matching your search term.";
      default:
        return "When you place orders or receive updates, they will appear here.";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-2xl border border-dashed border-gray-200">
      <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-4 border border-gray-100 shadow-sm">
        {getIcon()}
      </div>
      <h3 className="text-base font-semibold text-gray-800">
        {title || getDefaultTitle()}
      </h3>
      <p className="text-xs text-gray-500 max-w-sm mt-1 mb-5 leading-relaxed">
        {message || getDefaultMessage()}
      </p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-green-700 hover:bg-green-800 rounded-xl shadow-sm transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default NotificationEmptyState;
