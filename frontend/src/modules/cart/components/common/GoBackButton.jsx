import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function GoBackButton({ children, navigation = "/", className = "" }) {
  const navigate = useNavigate();

  if(!navigation) return;
  return (
    <div>
      <button
        onClick={() => navigate(navigation)}
        className={`flex gap-0.5 items-center font-semibold text-sm text-blue-600 hover:text-green-600 ${className}`}
      >
        <ArrowLeft size={17} /> <span>{children}</span>
      </button>
    </div>
  );
}

export default GoBackButton;
