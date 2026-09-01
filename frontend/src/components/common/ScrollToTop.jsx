import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // 1. Scroll window and document elements
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.documentElement.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.body.scrollTo({ top: 0, left: 0, behavior: "instant" });

    // 2. Scroll all overflow scroll containers (e.g. Home, Dashboard, Public Views)
    const scrollContainers = document.querySelectorAll(
      ".overflow-y-auto, .custom-scrollbar, main, #root"
    );
    scrollContainers.forEach((el) => {
      el.scrollTop = 0;
    });
  }, [pathname, search]);

  return null;
}
