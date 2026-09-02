import React from "react";
import { useRouteError, isRouteErrorResponse } from "react-router-dom";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export function RouteErrorFallback() {
  const error = useRouteError();
  console.error("Router error captured:", error);

  let errorMessage = "An unexpected application error occurred.";
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorStatus = error.status;
    errorMessage = error.statusText || error.data?.message || errorMessage;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  const handleReload = () => {
    window.location.reload();
  };

  const handleHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 bg-gray-50/50">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-lg max-w-md w-full text-center space-y-4">
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto border border-red-100">
          <AlertTriangle size={32} />
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            {errorStatus === 404 ? "Page Not Found" : "Something went wrong"}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            {errorStatus === 404
              ? "The page you are looking for does not exist or has moved."
              : "We encountered an issue loading this section. You can reload or go back home."}
          </p>
        </div>

        {errorMessage && (
          <div className="text-left bg-gray-900 text-gray-200 p-3 rounded-xl text-[11px] font-mono overflow-x-auto max-h-32">
            {errorMessage}
          </div>
        )}

        <div className="flex items-center justify-center gap-2.5 pt-2">
          <button
            type="button"
            onClick={handleReload}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer border-none"
          >
            <RefreshCw size={14} />
            <span>Reload Page</span>
          </button>

          <button
            type="button"
            onClick={handleHome}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition cursor-pointer border-none"
          >
            <Home size={14} />
            <span>Home</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default RouteErrorFallback;
