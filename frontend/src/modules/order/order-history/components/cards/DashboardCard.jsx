import React from "react";

function DashboardCard({ card, isActive }) {
  const Icon = card.icon;

  return (
    <div
      onClick={card.onClick}
      className={card.onClick ? "cursor-pointer" : ""}
    >
      <div
        className={`flex items-center gap-3 rounded-xl p-4 bg-gray-100/60 transition-all duration-200
          ${isActive ? `${card.borderStyle} shadow-sm` : "border-b-[3px]"}`}
      >
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.cardStyle}`}
        >
          <Icon size={20} />
        </div>
        <div>
          <p className="text-xs tracking-wide text-gray-400">{card.text}</p>
          <p className="text-md font-semibold text-gray-700">{card.value}</p>
        </div>
      </div>
    </div>
  );
}

export default DashboardCard;
