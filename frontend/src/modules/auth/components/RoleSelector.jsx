import React from "react";
import { User, Car, Store } from "lucide-react";

const ROLES = [
  { key: "customer", label: "Customer", icon: User },
  { key: "driver", label: "Driver", icon: Car },
  { key: "seller", label: "Seller", icon: Store },
];

const ROLE_STYLES = {
  customer: {
    active: "bg-green-700 text-white border-green-800 shadow-md scale-105",
    inactive: "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200 hover:text-gray-700",
  },
  driver: {
    active: "bg-amber-600 text-white border-amber-700 shadow-md scale-105",
    inactive: "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200 hover:text-gray-700",
  },
  seller: {
    active: "bg-indigo-700 text-white border-indigo-800 shadow-md scale-105",
    inactive: "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200 hover:text-gray-700",
  },
};

export default function RoleSelector({ currentRole, onChange }) {
  return (
    <div className="space-y-1.5">
      <p className="text-[#989da4] text-xs font-semibold uppercase tracking-wider">I am a...</p>

      <div className="flex gap-2 items-center font-semibold text-xs">
        {ROLES.map((roleItem) => {
          const key = roleItem.key;
          const label = roleItem.label;
          const Icon = roleItem.icon;
          const isActive = currentRole === key;
          const styles = ROLE_STYLES[key];
          
          return (
            <div
              key={key}
              className={`rounded-xl flex-1 border transition-all duration-300 transform ${
                isActive ? styles.active : styles.inactive
              }`}
            >
              <button
                type="button"
                className="flex w-full justify-center items-center gap-1.5 py-2.5 px-3 focus:outline-none"
                onClick={() => onChange(key)}
              >
                <Icon size={15} />
                <span>{label}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
