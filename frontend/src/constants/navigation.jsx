import React from "react";
import {
  Heart,
  ShoppingCart,
  Smile,
  HelpCircle,
  Store,
  Bike,
  Tags,
  ScrollText,
  Package,
  CopyPlus,
  Bell,
} from "lucide-react";

export const leftPanelItems = [
  {
    children: "Dashboard",
    to: "/dashboard",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        id="widgets"
        className="group-hover:fill-white fill-current"
      >
        <path fill="none" d="M0 0h24v24H0V0z"></path>
        <path d="M13 14v6c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-6c0-.55-.45-1-1-1h-6c-.55 0-1 .45-1 1zm-9 7h6c.55 0 1-.45 1-1v-6c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1zM3 4v6c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1zm12.95-1.6L11.7 6.64c-.39.39-.39 1.02 0 1.41l4.25 4.25c.39.39 1.02.39 1.41 0l4.25-4.25c.39-.39.39-1.02 0-1.41L17.37 2.4c-.39-.39-1.03-.39-1.42 0z"></path>
      </svg>
    ),
    showToCustomer: true,
    showToSeller: true,
    showToAdmin: false,
    showToDriver: true,
  },
  {
    children: "Notifications",
    to: "/allnotifications",
    svg: <Bell size={18} />,
    showToCustomer: true,
    showToSeller: true,
    showToAdmin: false,
    showToDriver: true,
  },

  {
    children: "Stores",
    to: "/stores",
    svg: <Store size={18} />,
    showToCustomer: true,
    showToSeller: true,
    showToAdmin: false,
    showToDriver: false,
  },
  {
    children: "Favourite Stores",
    to: "/wishlist",
    svg: <Heart size={18} />,
    showToCustomer: true,
    showToSeller: false,
    showToAdmin: false,
    showToDriver: false,
  },
  {
    children: "Cart",
    to: "/cart",
    svg: <ShoppingCart size={18} />,
    showToCustomer: true,
    showToSeller: false,
    showToAdmin: false,
    showToDriver: false,
  },
  {
    children: "Current Orders",
    to: "/active-orders",
    svg: <Bike size={20} />,
    showToCustomer: true,
    showToSeller: true,
    showToAdmin: false,
    showToDriver: true,
  },
  // for seller
  {
    children: "Add Products",
    to: "/addproducts",
    svg: <CopyPlus size={18} />,
    showToCustomer: false,
    showToSeller: true,
    showToAdmin: false,
    showToDriver: false,
  },
  {
    children: "Product List",
    to: "/product-list",
    svg: <ScrollText size={18} />,
    showToCustomer: false,
    showToSeller: true,
    showToAdmin: false,
    showToDriver: false,
  },
  {
    children: "Orders",
    to: "/orders",
    svg: <Package size={18} />,
    showToCustomer: true,
    showToSeller: true,
    showToAdmin: false,
    showToDriver: true,
  },
  // for driver
  {
    children: " Delivery History",
    to: "/deliveryHistory",
    svg: "⟲",
    showToCustomer: false,
    showToSeller: false,
    showToAdmin: false,
    showToDriver: true,
  },
  {
    children: "Earnings",
    to: "/earnings",
    svg: "💰",
    showToCustomer: false,
    showToSeller: false,
    showToAdmin: false,
    showToDriver: true,
  },
  {
    children: "Vehicle Details",
    to: "/vehicleDetails",
    svg: "🚗",
    showToCustomer: false,
    showToSeller: false,
    showToAdmin: false,
    showToDriver: true,
  },
];

export const secondLeftPanelItems = [
  {
    children: "Feedback",
    to: "/dashboard",
    svg: Smile,
    showToCustomer: true,
    showToSeller: true,
    showToAdmin: false,
    showToDriver: false,
  },
  {
    children: "Help",
    to: "/",
    svg: HelpCircle,
    showToCustomer: true,
    showToSeller: true,
    showToDriver: true,
    showToAdmin: false,
  },
];
