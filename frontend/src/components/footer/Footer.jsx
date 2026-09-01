import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Mail, Phone, MapPin, ArrowRight, CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";

import { novexa_logo } from "@/assets";
import { useModal, MODAL_TYPES } from "@/components";

function Footer() {
  const { isAuthenticated: isLogin } = useSelector((state) => state.auth);
  const { openModal } = useModal();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe(e) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    setSubscribed(true);
    setEmail("");
    toast.success("Thank you for subscribing to Novexa alerts!");
  }

  // Footer is only shown on the public/guest storefront, not inside
  // the logged-in dashboards which have their own full sidebar layout.
  if (isLogin) return null;

  return (
    <footer className="bg-[#0F1C15] text-gray-300">
      {/* Newsletter strip */}
      <div className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-white text-xl sm:text-2xl font-semibold">
              Get fresh deals in your inbox
            </p>
            <p className="text-sm text-gray-400 mt-1">
              One email a week — restock alerts and seasonal picks, no spam.
            </p>
          </div>

          {subscribed ? (
            <div className="flex items-center gap-2 text-sm font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 w-full md:w-auto">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              You're subscribed — welcome to Novexa deals!
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex w-full md:w-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="flex-1 md:w-72 bg-white/5 border border-white/10 rounded-l-xl px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-emerald-500 transition-colors"
              />
              <button
                type="submit"
                className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold px-4 sm:px-5 rounded-r-xl transition-colors cursor-pointer"
              >
                <span className="hidden sm:inline">Subscribe</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Main links */}
      <div className="max-w-6xl mx-auto px-6 sm:px-10 py-12 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand column */}
        <div className="col-span-2">
          <Link to="/" className="inline-flex items-center">
            <img
              className="h-8 brightness-0 invert opacity-90"
              src={novexa_logo}
              alt="Novexa logo"
            />
          </Link>
          <p className="text-sm text-gray-400 my-2.5 max-w-xs leading-relaxed">
            From everyday essentials to fresh farm produce, discover and order from trusted local stores all in one place.
          </p>
          <ul className="space-y-2.5 text-sm text-gray-400 mt-4">
            <li className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Bengaluru, Karnataka, India</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
              <a
                href="tel:+910123456789"
                className="hover:text-white transition-colors"
              >
                +91 01234 56789
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
              <a
                href="mailto:novexa@outlook.com"
                className="hover:text-white transition-colors"
              >
                novexa@outlook.com
              </a>
            </li>
          </ul>
        </div>

        {/* Explore Column */}
        <div>
          <h3 className="text-xs font-bold text-white tracking-widest uppercase mb-4">
            Explore
          </h3>
          <ul className="space-y-2.5">
            <li>
              <Link
                to="/stores"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Browse Stores
              </Link>
            </li>
            <li>
              <Link
                to="/cart"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Shopping Cart
              </Link>
            </li>
            <li>
              <Link
                to="/orders"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Track Orders
              </Link>
            </li>
            <li>
              <Link
                to="/wishlist"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Favourite Stores
              </Link>
            </li>
          </ul>
        </div>

        {/* Partner Column */}
        <div>
          <h3 className="text-xs font-bold text-white tracking-widest uppercase mb-4">
            Partner
          </h3>
          <ul className="space-y-2.5">
            <li>
              <button
                type="button"
                onClick={() => openModal(MODAL_TYPES.SIGNUP, { role: "seller" })}
                className="text-sm text-gray-400 hover:text-white transition-colors text-left cursor-pointer border-none bg-transparent p-0"
              >
                Become a Seller
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => openModal(MODAL_TYPES.SIGNUP, { role: "driver" })}
                className="text-sm text-gray-400 hover:text-white transition-colors text-left cursor-pointer border-none bg-transparent p-0"
              >
                Join as Driver
              </button>
            </li>
            <li>
              <Link
                to="/dashboard"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Store Dashboard
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal & Help Column */}
        <div>
          <h3 className="text-xs font-bold text-white tracking-widest uppercase mb-4">
            Legal & Support
          </h3>
          <ul className="space-y-2.5">
            <li>
              <Link
                to="/privacy-policy"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                to="/terms-and-conditions"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
            </li>
            <li>
              <Link
                to="/refund-policy"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Refund Policy
              </Link>
            </li>
            <li>
              <Link
                to="/help-support"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Help & Support
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 py-5 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Novexa. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {[
              { abbr: "f", label: "Facebook" },
              { abbr: "ig", label: "Instagram" },
              { abbr: "x", label: "Twitter / X" },
              { abbr: "in", label: "LinkedIn" },
            ].map(({ abbr, label }) => (
              <a
                key={label}
                href="#"
                onClick={(e) => e.preventDefault()}
                aria-label={label}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-xs font-semibold text-gray-400 hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer"
              >
                {abbr}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
