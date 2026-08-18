import React from "react";

const commonCss =
  "cursor-pointer bg-white rounded-2xl p-3 border shadow-sm hover:scale-105 duration-150";

const iconCss = "flex items-center justify-center h-12 w-12 rounded-xl";

function DashboardCards({ cards, stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <div key={index} className={commonCss}>
            <div className="flex items-center gap-3">
              <div
                className={iconCss}
                style={{
                  backgroundColor: card.bg,
                  color: card.color,
                }}
              >
                <Icon />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">{card.title}</p>

                <h2 className="text-2xl font-bold mt-2">
                  {stats?.[card.valueKey] || 0}
                </h2>

                <p className="text-xs text-gray-400 mt-1">{card.info}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default DashboardCards;
