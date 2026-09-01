import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  LayoutGrid,
  Store,
  ShoppingCart,
  Bike,
  Package,
  ScrollText,
  PlusCircle,
  Coins,
  Car,
  Heart,
} from "lucide-react";

export default function MobileBottomNav() {
  const { user: currentUser, isAuthenticated: isLogin } = useSelector(
    (state) => state.auth
  );
  const guestCart = useSelector((state) => state.cart.guestCart || []);
  const cartItems = isLogin ? currentUser?.myCart || [] : guestCart;
  const cartCount = cartItems?.length || 0;
  const userRole = currentUser?.role || "customer";

  if (!isLogin) return null;

  const getNavItems = () => {
    if (userRole === "seller") {
      return [
        { label: "Dashboard", to: "/dashboard", icon: LayoutGrid },
        { label: "Menu", to: "/product-list", icon: ScrollText },
        { label: "Add", to: "/addproducts", icon: PlusCircle, isHighlight: true },
        { label: "Current", to: "/active-orders", icon: Bike },
        { label: "Orders", to: "/orders", icon: Package },
      ];
    }

    if (userRole === "driver") {
      return [
        { label: "Dashboard", to: "/dashboard", icon: LayoutGrid },
        { label: "Active", to: "/active-orders", icon: Bike },
        { label: "Earnings", to: "/earnings", icon: Coins },
        { label: "Vehicle", to: "/vehicleDetails", icon: Car },
        { label: "History", to: "/orders", icon: Package },
      ];
    }

    // Default: Customer
    return [
      { label: "Dashboard", to: "/dashboard", icon: LayoutGrid },
      { label: "Stores", to: "/stores", icon: Store },
      { label: "Current", to: "/active-orders", icon: Bike },
      {
        label: "Cart",
        to: "/cart",
        icon: ShoppingCart,
        badge: cartCount > 0 ? cartCount : null,
      },
      { label: "Orders", to: "/orders", icon: Package },
    ];
  };

  const navItems = getNavItems();

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-gray-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1.5 flex items-center justify-around safe-area-pb"
    >
      {navItems.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 active:scale-90 select-none ${
                isActive
                  ? "text-emerald-800 font-bold"
                  : "text-gray-500 hover:text-gray-800 font-medium"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={`relative flex items-center justify-center p-1 rounded-xl transition-all duration-200 ${
                    item.isHighlight
                      ? "bg-emerald-700 text-white shadow-sm shadow-emerald-700/30 -mt-2 p-2 rounded-2xl"
                      : isActive
                      ? "bg-emerald-50 text-emerald-800 shadow-2xs"
                      : "text-gray-500"
                  }`}
                >
                  <Icon
                    size={item.isHighlight ? 20 : 19}
                    strokeWidth={isActive ? 2.5 : 2}
                  />

                  {/* Badge */}
                  {item.badge && (
                    <span className="absolute -top-1 -right-1.5 bg-emerald-600 text-white text-[9px] font-extrabold min-w-[16px] h-[16px] flex items-center justify-center rounded-full px-0.5 ring-2 ring-white">
                      {item.badge}
                    </span>
                  )}
                </div>

                <span
                  className={`text-[10px] tracking-tight transition-all duration-200 ${
                    item.isHighlight
                      ? "font-bold text-emerald-800 mt-0.5"
                      : isActive
                      ? "font-bold text-emerald-800 scale-105"
                      : "text-gray-500"
                  }`}
                >
                  {item.label}
                </span>

                {/* Active Indicator Dot */}
                {isActive && !item.isHighlight && (
                  <span className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-emerald-700" />
                )}
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
