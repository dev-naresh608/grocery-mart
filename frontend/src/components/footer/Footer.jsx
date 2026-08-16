import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Mail, Phone, MapPin, ArrowRight, CheckCircle2 } from "lucide-react";

import { novexa_logo } from "@/assets";

const FOOTER_LINKS = {
  Shop: [
    { label: "All Products", to: "/allproducts" },
    { label: "Stores", to: "/stores" },
    { label: "My Cart", to: "/cart" },
    { label: "Track Order", to: "/orders" },
  ],
  Company: [
    { label: "About Novexa", to: "/about" },
    { label: "Careers", to: "/careers" },
    { label: "Blog", to: "/blog" },
    { label: "Become a Seller", to: "/signup?role=seller" },
    { label: "Join as a Driver", to: "/signup?role=driver" },
  ],
  Support: [
    { label: "Help Center", to: "/help" },
    { label: "Contact Us", to: "/contact" },
    { label: "Privacy Policy", to: "/privacy" },
    { label: "Terms of Service", to: "/terms" },
    { label: "Refund Policy", to: "/refunds" },
  ],
};

const SOCIAL_LINKS = [
  { abbr: "f", href: "#", label: "Facebook" },
  { abbr: "ig", href: "#", label: "Instagram" },
  { abbr: "x", href: "#", label: "Twitter / X" },
  { abbr: "in", href: "#", label: "LinkedIn" },
];

function FooterColumn({ title, links }) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-white tracking-widest uppercase mb-4">
        {title}
      </h3>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              to={link.to}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Footer() {
  const { isAuthenticated: isLogin } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe(e) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    setSubscribed(true);
    setEmail("");
  }

  // Footer is only shown on the public/guest storefront, not inside
  // the logged-in dashboards which have their own layout.
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
            <div className="flex items-center gap-2 text-sm font-medium text-green-400 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3 w-full md:w-auto">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              You're subscribed — check your inbox to confirm.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex w-full md:w-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="flex-1 md:w-72 bg-white/5 border border-white/10 rounded-l-xl px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-green-500 transition-colors"
              />
              <button
                type="submit"
                className="flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-500 text-white text-sm font-semibold px-4 sm:px-5 rounded-r-xl transition-colors"
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
          <p className="text-sm text-gray-400 my-1.5 max-w-xs leading-relaxed">
            From everyday essentials to lifestyle shopping, discover trusted
            local stores all in one place.
          </p>
          <ul className="space-y-2.5 text-sm text-gray-400">
            <li className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-green-500 shrink-0" />
              Bengaluru, Karnataka, India
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-green-500 shrink-0" />
              <a
                href="tel:+910123456789"
                className="hover:text-white transition-colors"
              >
                +91 01234 56789
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-green-500 shrink-0" />
              <a
                href="mailto:novexa@outlook.com"
                className="hover:text-white transition-colors"
              >
                novexa@outlook.com
              </a>
            </li>
          </ul>
        </div>

        <FooterColumn title="Shop" links={FOOTER_LINKS.Shop} />
        <FooterColumn title="Company" links={FOOTER_LINKS.Company} />
        <FooterColumn title="Support" links={FOOTER_LINKS.Support} />
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 py-5 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Novexa. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map(({ abbr, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-xs font-semibold text-gray-400 hover:bg-green-600 hover:text-white transition-colors"
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
