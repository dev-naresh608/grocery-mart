import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { createPortal } from "react-dom";
import { useSelector, useDispatch } from "react-redux";
import { novexa_logo } from "@/assets";
import { ProfileToggle } from "@/modules/profile";
import { NotificationToggle } from "@/modules/notification";
import { useModal, MODAL_TYPES } from "@/components";
import { openCartDrawer } from "@/modules/cart/store/cartSlice";
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  Store,
  Car,
} from "lucide-react";

function JoinUsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [, setSearchParams] = useSearchParams();
  const { openModal } = useModal();

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-green-700 transition-colors"
      >
        Join Us
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-10">
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              setSearchParams({ role: "seller" });
              openModal(MODAL_TYPES.SIGNUP);
            }}
            className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-700 transition-colors border-none bg-transparent cursor-pointer outline-none font-semibold"
          >
            <Store className="w-4 h-4" />
            Become a Seller
          </button>
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              setSearchParams({ role: "driver" });
              openModal(MODAL_TYPES.SIGNUP);
            }}
            className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-700 transition-colors border-none bg-transparent cursor-pointer outline-none font-semibold"
          >
            <Car className="w-4 h-4" />
            Join as Driver
          </button>
        </div>
      )}
    </div>
  );
}

function Header() {
  const dispatch = useDispatch();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const rightNavRef = useRef(null);
  const { isAuthenticated: isLogin, user: currentUser } = useSelector((state) => state.auth);
  const cartItems = currentUser?.myCart || [];
  const navigate = useNavigate();
  const { openModal } = useModal();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchValFromUrl = searchParams.get("search") || "";

  const [searchValue, setSearchValue] = useState(searchValFromUrl);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileJoinOpen, setIsMobileJoinOpen] = useState(false);

  const cartCount = cartItems?.length || 0;

  useEffect(() => {
    function handleClickOutside(e) {
      if (rightNavRef.current && !rightNavRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    }

    if (activeDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [activeDropdown]);

  useEffect(() => {
    setSearchValue(searchValFromUrl);
  }, [searchValFromUrl]);

  function handleSearch(e) {
    e.preventDefault();
    const trimmed = searchValue.trim();
    if (trimmed.length > 0) {
      navigate(`/stores?search=${trimmed}`);
    } else {
      navigate("/stores");
    }
    setIsMobileMenuOpen(false);
  }

  const navLinkClass = ({ isActive }) =>
    `transition-colors ${
      isActive ? "text-green-700" : "text-gray-700 hover:text-green-700"
    }`;

  if (!isLogin) {
    return (
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="flex items-center justify-between gap-3 py-3 px-4 sm:px-6 lg:px-10">
          {/* Left: Logo */}
          <div className="flex items-center gap-4 shrink-0">
            <Link to="/" className="flex items-center">
              <img className="h-9" src={novexa_logo} alt="Novexa logo" />
            </Link>
          </div>

          {/* Center: Search (desktop) */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-xl mx-2"
          >
            <div className="flex items-center w-full h-11 border border-gray-200 bg-gray-50 focus-within:bg-white focus-within:border-green-400 rounded-2xl px-4 gap-2 transition-colors">
              <input
                className="flex-1 outline-none h-full bg-transparent text-sm placeholder:text-gray-400"
                type="text"
                value={searchValue}
                placeholder="Search stores by name..."
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <button
                type="submit"
                aria-label="Search"
                className="text-gray-400 hover:text-green-700 transition-colors border-none bg-transparent cursor-pointer outline-none"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* Right: Nav + Cart + Auth (desktop) */}
          <div className="hidden md:flex items-center gap-6 shrink-0">
            <ul className="flex items-center gap-5 font-semibold text-sm">
              <li>
                <NavLink className={navLinkClass} to="/stores">
                  STORES
                </NavLink>
              </li>
            </ul>

            <JoinUsDropdown />

            {/* Cart Drawer Toggle */}
            <button
              type="button"
              onClick={() => dispatch(openCartDrawer())}
              className="relative p-2 rounded-xl text-gray-700 hover:text-green-700 hover:bg-gray-100/70 transition-all cursor-pointer border-none bg-transparent outline-none"
              aria-label="Open cart"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-600 text-white text-[10px] font-extrabold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1 shadow-sm shadow-green-600/30">
                  {cartCount}
                </span>
              )}
            </button>

            <div>
              <button
                type="button"
                onClick={() => openModal(MODAL_TYPES.LOGIN)}
                className="text-sm font-semibold text-gray-700 border border-gray-200 rounded-2xl px-4 py-2 hover:border-green-400 hover:text-green-700 transition-colors outline-none cursor-pointer"
              >
                Login
              </button>
            </div>
          </div>

          {/* Right: Cart + Hamburger (mobile) */}
          <div className="flex md:hidden items-center gap-4">
            <button
              type="button"
              onClick={() => dispatch(openCartDrawer())}
              className="relative p-2 text-gray-700 border-none bg-transparent cursor-pointer outline-none"
              aria-label="Open cart"
            >
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-600 text-white text-[10px] font-extrabold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1 shadow-sm shadow-green-600/30">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setIsMobileMenuOpen(true)}
              className="border-none bg-transparent cursor-pointer outline-none"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {createPortal(
          <div
            className={`fixed inset-0 z-[100] md:hidden transition-opacity duration-300 ${
              isMobileMenuOpen
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Panel */}
            <div
              className={`absolute top-0 right-0 h-full w-[82%] max-w-xs bg-white shadow-xl flex flex-col transition-transform duration-300 ${
                isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <img className="h-8" src={novexa_logo} alt="Novexa logo" />
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="border-none bg-transparent cursor-pointer outline-none"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              <div className="px-5 py-4 flex flex-col gap-6 overflow-y-auto">
                <form onSubmit={handleSearch}>
                  <div className="flex items-center h-11 border border-gray-200 bg-gray-50 focus-within:border-green-400 rounded-2xl px-4 gap-2">
                    <input
                      className="flex-1 outline-none h-full bg-transparent text-sm placeholder:text-gray-400"
                      type="text"
                      value={searchValue}
                      placeholder="Search stores by name..."
                      onChange={(e) => setSearchValue(e.target.value)}
                    />
                    <button
                      type="submit"
                      aria-label="Search"
                      className="text-gray-400 border-none bg-transparent cursor-pointer outline-none"
                    >
                      <Search className="w-5 h-5" />
                    </button>
                  </div>
                </form>

                <ul className="flex flex-col gap-4 font-semibold text-sm">
                  <li>
                    <NavLink
                      className={navLinkClass}
                      to="/stores"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      STORES
                    </NavLink>
                  </li>

                  <li>
                    <button
                      type="button"
                      onClick={() => setIsMobileJoinOpen((prev) => !prev)}
                      className="flex items-center justify-between w-full text-gray-700 border-none bg-transparent cursor-pointer outline-none"
                    >
                      Join Us
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          isMobileJoinOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isMobileJoinOpen && (
                      <div className="flex flex-col gap-3 mt-3 pl-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            setSearchParams({ role: "seller" });
                            openModal(MODAL_TYPES.SIGNUP);
                          }}
                          className="flex items-center gap-2 text-gray-600 font-semibold hover:text-green-700 transition-colors border-none bg-transparent cursor-pointer outline-none w-full text-left"
                        >
                          <Store className="w-4 h-4" />
                          Become a Seller
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            setSearchParams({ role: "driver" });
                            openModal(MODAL_TYPES.SIGNUP);
                          }}
                          className="flex items-center gap-2 text-gray-600 font-semibold hover:text-green-700 transition-colors border-none bg-transparent cursor-pointer outline-none w-full text-left"
                        >
                          <Car className="w-4 h-4" />
                          Join as Driver
                        </button>
                      </div>
                    )}
                  </li>
                </ul>

                <div className="flex flex-col gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      openModal(MODAL_TYPES.LOGIN);
                    }}
                    className="text-center text-sm font-semibold text-gray-700 border border-gray-200 rounded-2xl px-4 py-2.5 hover:border-green-400 hover:text-green-700 transition-colors outline-none cursor-pointer"
                  >
                    Login
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 flex bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm justify-between items-center py-3 px-4 sm:px-10">
      <div>
        <Link to="/dashboard">
          <span className="text-green-700 font-bold text-3xl">
            <img className="h-8" src={novexa_logo} alt="logo image" />
          </span>
        </Link>
      </div>

      {/* right nav */}
      <div ref={rightNavRef} className="flex gap-3 items-center">
        {/* Cart Toggle */}
        <button
          type="button"
          onClick={() => dispatch(openCartDrawer())}
          className="relative p-2 rounded-xl text-gray-700 hover:text-green-700 hover:bg-gray-100/70 transition-all cursor-pointer border-none bg-transparent outline-none"
          aria-label="Open cart"
        >
          <ShoppingCart className="w-6 h-6" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-green-600 text-white text-[10px] font-extrabold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1 shadow-sm shadow-green-600/30">
              {cartCount}
            </span>
          )}
        </button>
        {/* Notification */}
        <NotificationToggle 
          isOpen={activeDropdown === "notification"}
          onToggle={() => setActiveDropdown(prev => prev === "notification" ? null : "notification")}
          onClose={() => setActiveDropdown(null)}
        />
        {/* profile */}
        <ProfileToggle 
          isOpen={activeDropdown === "profile"}
          onToggle={() => setActiveDropdown(prev => prev === "profile" ? null : "profile")}
          onClose={() => setActiveDropdown(null)}
        />
      </div>
    </header>
  );
}

export default Header;
