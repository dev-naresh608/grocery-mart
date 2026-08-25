import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Truck,
  Leaf,
  ShieldCheck,
  Star,
  ArrowRight,
  ShoppingBasket,
  Pill,
  Milk,
  Shirt,
  Sparkles,
} from "lucide-react";

import { useModal, MODAL_TYPES } from "..";
import { heroBannerImage } from "@/assets";

const TRUST_BADGES = [
  { icon: Truck, label: "30-min delivery" },
  { icon: Leaf, label: "Fresh & organic" },
  { icon: ShieldCheck, label: "10,000+ happy customers" },
];

const CATEGORY_CARDS = [
  { icon: ShoppingBasket, label: "Grocery", className: "top-2 left-0 sm:-left-6", delay: "0s" },
  { icon: Pill, label: "Pharmacy", className: "top-1/4 right-0 sm:-right-8", delay: "1.2s" },
  { icon: Milk, label: "Dairy", className: "bottom-28 left-0 sm:-left-8", delay: "0.6s" },
  { icon: Shirt, label: "Fashion", className: "bottom-10 right-2 sm:right-0", delay: "1.8s" },
];

function Hero() {
  const [, setSearchParams] = useSearchParams();
  const { openModal } = useModal();
  return (
    <section>
      <div className="relative overflow-hidden bg-gradient-to-br from-yellow-100 via-yellow-50 to-green-50 px-6 sm:px-10 lg:px-14 py-8 lg:py-10">
        {/* decorative backdrop */}
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-green-200/40 blur-2xl" />
        <div className="absolute -left-10 bottom-0 w-40 h-40 rounded-full bg-yellow-300/30 blur-2xl" />

        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* left content */}
          <div className="space-y-4 text-center lg:text-left">
            <span className="inline-flex mb-1.5 items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-green-700 bg-white/70 border border-green-200 rounded-full px-3 py-1.5">
              Shop beyond the ordinary. 
            </span>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.15] tracking-tight text-slate-900">
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                Everything
              </span>{" "}
              you need,
              <br />
              from stores{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                you trust.
              </span>
            </h1>

            <p className="text-gray-600 text-sm sm:text-base max-w-md mx-auto lg:mx-0">
              From everyday essentials to lifestyle shopping, discover trusted
              local stores all in one place.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-3">
              <Link
                to="/stores"
                className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-600/30 hover:-translate-y-0.5"
              >
                Explore Stores
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>

              <button
                type="button"
                onClick={() => {
                  setSearchParams({ role: "seller" });
                  openModal(MODAL_TYPES.SIGNUP);
                }}
                className="inline-flex w-full sm:w-auto items-center justify-center rounded-2xl border border-slate-200 bg-white/70 px-5 py-2.5 text-sm font-semibold text-slate-600 transition-all duration-300 hover:border-amber-400 hover:bg-amber-50 hover:text-amber-700 outline-none cursor-pointer"
              >
                Become a Seller
              </button>
            </div>

            {/* trust strip */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-2 pt-1">
              {TRUST_BADGES.map((badge) => {
                const IconComp = badge.icon;
                return (
                  <div
                    key={badge.label}
                    className="flex items-center gap-2 text-sm font-medium text-gray-700"
                  >
                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white text-green-700 shadow-sm shrink-0">
                      <IconComp className="w-3.5 h-3.5" />
                    </span>
                    {badge.label}
                  </div>
                );
              })}
            </div>
          </div>

          {/* right content */}
          <div className="relative flex justify-center lg:justify-end mt-4 lg:mt-0">
            <div className="relative w-full max-w-[280px] sm:max-w-sm md:max-w-md lg:max-w-lg">
              <img
                src={heroBannerImage}
                alt="Novexa shopper browsing trusted local stores"
                className="w-full h-auto object-contain drop-shadow-xl"
              />

              {/* floating category cards */}
              {CATEGORY_CARDS.map((card) => {
                const IconComp = card.icon;
                return (
                  <div
                    key={card.label}
                    style={{ animationDelay: card.delay }}
                    className={`animate-hero-float hidden sm:flex absolute items-center gap-1.5 bg-white/80 backdrop-blur-md rounded-xl shadow-lg px-3 py-2 ${card.className}`}
                  >
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 shrink-0">
                      <IconComp className="w-3 h-3" />
                    </span>
                    <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">
                      {card.label}
                    </span>
                  </div>
                );
              })}

              {/* floating rating card */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 sm:left-auto sm:right-2 sm:translate-x-0 flex items-center gap-2 bg-white rounded-2xl shadow-lg px-3 py-2 sm:px-3.5 sm:py-2.5">
                <div className="flex text-yellow-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-current" />
                  ))}
                </div>
                <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">
                  4.8 rated service
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes hero-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .animate-hero-float {
          animation: hero-float 3.5s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-hero-float {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}

export default Hero;