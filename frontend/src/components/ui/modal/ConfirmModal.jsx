import React from "react";
import { useModal } from "./useModal";
import { AlertTriangle, Info, CheckCircle2, HelpCircle } from "lucide-react";

function ConfirmModal() {
  const { payload, closeModal } = useModal();
  if (!payload) return null;

  const {
    title = "Are you sure?",
    message = "Do you really want to perform this action?",
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    type = "warning", // danger, warning, success, info
  } = payload;

  const handleConfirm = async () => {
    closeModal();
    if (onConfirm) {
      await onConfirm();
    }
  };

  const getThemeStyles = () => {
    switch (type) {
      case "danger":
        return {
          icon: <AlertTriangle className="text-red-500" size={24} />,
          button: "bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white",
          bg: "bg-red-50",
        };
      case "success":
        return {
          icon: <CheckCircle2 className="text-green-500" size={24} />,
          button: "bg-green-600 hover:bg-green-700 focus:ring-green-500 text-white",
          bg: "bg-green-50",
        };
      case "info":
        return {
          icon: <Info className="text-blue-500" size={24} />,
          button: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white",
          bg: "bg-blue-50",
        };
      case "warning":
      default:
        return {
          icon: <HelpCircle className="text-amber-500" size={24} />,
          button: "bg-amber-600 hover:bg-amber-700 focus:ring-amber-500 text-white",
          bg: "bg-amber-50",
        };
    }
  };

  const theme = getThemeStyles();

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-xl ${theme.bg}`}>
          {theme.icon}
        </div>
        <div className="flex-1 space-y-1">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500 leading-relaxed">{message}</p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={closeModal}
          className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition duration-150 active:scale-95"
        >
          {cancelText}
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          className={`px-4 py-2 text-sm font-semibold rounded-xl transition duration-150 active:scale-95 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${theme.button}`}
        >
          {confirmText}
        </button>
      </div>
    </div>
  );
}

export default ConfirmModal;
