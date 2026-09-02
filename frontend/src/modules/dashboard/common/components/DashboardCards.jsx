import React from "react";

function DashboardCards({ cards, stats }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <div
            key={index}
            className="cursor-pointer bg-white rounded-2xl p-3 sm:p-4 border border-gray-200/90 shadow-2xs hover:shadow-xs hover:scale-[1.01] transition-all duration-150 flex flex-col justify-between"
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <div
                className="flex items-center justify-center h-9 w-9 sm:h-12 sm:w-12 rounded-xl shrink-0 aspect-square shadow-2xs"
                style={{
                  backgroundColor: card.bg,
                  color: card.color,
                }}
              >
                <Icon size={18} className="sm:size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] sm:text-xs font-semibold text-gray-500 leading-tight truncate">
                  {card.title}
                </p>
                <h2 className="text-base sm:text-2xl font-black text-gray-900 mt-0.5 tracking-tight truncate">
                  {stats?.[card.valueKey] || 0}
                </h2>
              </div>
            </div>

            {card.info && (
              <p className="text-[10px] sm:text-xs text-gray-400 mt-1.5 sm:mt-2 truncate">
                {card.info}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default DashboardCards;
