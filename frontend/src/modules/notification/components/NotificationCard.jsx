import React from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Truck,
  Bell,
  Sparkles,
  Info,
  Check,
  RotateCcw,
  Trash2,
  ChevronRight,
  Clock,
} from "lucide-react";

// Helper to format relative time
export const formatRelativeTime = (dateInput) => {
  if (!dateInput) return "Just now";
  const date = new Date(dateInput);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return date.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
};

const getTypeConfig = (type) => {
  switch (type) {
    case "order":
      return {
        icon: Package,
        bgColor: "bg-emerald-50 text-emerald-600 border-emerald-100",
        badgeBg: "bg-emerald-100 text-emerald-800",
        label: "Order",
      };
    case "delivery":
      return {
        icon: Truck,
        bgColor: "bg-blue-50 text-blue-600 border-blue-100",
        badgeBg: "bg-blue-100 text-blue-800",
        label: "Delivery",
      };
    case "promotion":
      return {
        icon: Sparkles,
        bgColor: "bg-amber-50 text-amber-600 border-amber-100",
        badgeBg: "bg-amber-100 text-amber-800",
        label: "Offer",
      };
    case "system":
      return {
        icon: Info,
        bgColor: "bg-purple-50 text-purple-600 border-purple-100",
        badgeBg: "bg-purple-100 text-purple-800",
        label: "System",
      };
    default:
      return {
        icon: Bell,
        bgColor: "bg-gray-100 text-gray-600 border-gray-200",
        badgeBg: "bg-gray-100 text-gray-800",
        label: "Notification",
      };
  }
};

function NotificationCard({
  notification,
  onMarkAsRead,
  onMarkAsUnread,
  onDelete,
  onCloseDropdown,
}) {
  const { _id, id, title, message, type, link, isRead, createdAt } =
    notification;

  const notifId = _id || id;
  const config = getTypeConfig(type);
  const IconComponent = config.icon;

  const handleLinkClick = () => {
    if (!isRead && onMarkAsRead && notifId) {
      onMarkAsRead(notifId);
    }
    if (onCloseDropdown) {
      onCloseDropdown();
    }
  };

  return (
    <div
      className={`group relative flex items-start gap-3.5 p-4 rounded-2xl border transition-all duration-200 ${
        !isRead
          ? "bg-white border-green-200 shadow-sm hover:shadow-md hover:border-green-300"
          : "bg-gray-50/70 border-gray-100 hover:bg-white hover:border-gray-200"
      }`}
    >
      {/* Unread indicator dot */}
      {!isRead && (
        <span className="absolute top-4 left-2 w-2 h-2 rounded-full bg-green-600 ring-4 ring-green-100" />
      )}

      {/* Icon */}
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${config.bgColor}`}
      >
        <IconComponent size={18} strokeWidth={2} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
          <div className="flex items-center gap-2">
            {link ? (
              <Link
                to={link}
                onClick={handleLinkClick}
                className={`text-sm font-semibold truncate hover:text-green-700 transition-colors ${
                  !isRead ? "text-gray-900" : "text-gray-700"
                }`}
              >
                {title}
              </Link>
            ) : (
              <h4
                className={`text-sm font-semibold truncate ${
                  !isRead ? "text-gray-900" : "text-gray-700"
                }`}
              >
                {title}
              </h4>
            )}
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${config.badgeBg}`}
            >
              {config.label}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-gray-400 font-medium ml-auto">
            <Clock size={11} />
            <span>{formatRelativeTime(createdAt)}</span>
          </div>
        </div>

        <p className="text-xs text-gray-600 leading-relaxed break-words mb-3">
          {message}
        </p>

        {/* Card Footer Actions */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2">
            {link ? (
              <Link
                to={link}
                onClick={handleLinkClick}
                className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 hover:text-green-800 transition-colors"
              >
                View Details
                <ChevronRight size={13} />
              </Link>
            ) : null}
          </div>

          <div className="flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
            {!isRead && (
              <button
                type="button"
                onClick={() => onMarkAsRead && onMarkAsRead(notifId)}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-green-50 hover:text-green-700 hover:border-green-300 transition-colors cursor-pointer"
                title="Mark as read"
              >
                <Check size={13} />
                <span>Mark as read</span>
              </button>
            )}

            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(notifId)}
                className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete notification"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationCard;
