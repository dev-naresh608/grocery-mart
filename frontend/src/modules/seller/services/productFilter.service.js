// SEARCH
export const searchProductsSvc = (allProducts = [], searchValue = "") => {
  if (!allProducts || allProducts.length === 0) return [];
  if (!searchValue?.trim()) return allProducts;

  const search = searchValue.toLowerCase().trim();

  return allProducts.filter((p) => {
    const nameMatch = p.product_name?.toLowerCase().includes(search);
    const idMatch = p._id?.toLowerCase().includes(search);
    const descMatch = p.product_description?.toLowerCase().includes(search);
    const sellingPriceMatch = String(p.product_selling_price || "").includes(search);
    const costPriceMatch = String(p.product_cost_price || "").includes(search);
    const weightMatch = String(p.product_weight || "").includes(search);
    const weightTypeMatch = p.product_weight_type?.toLowerCase().includes(search);

    return (
      nameMatch ||
      idMatch ||
      descMatch ||
      sellingPriceMatch ||
      costPriceMatch ||
      weightMatch ||
      weightTypeMatch
    );
  });
};

// MULTI-CRITERIA FILTER
export const filterProductsSvc = (
  products = [],
  {
    searchValue = "",
    menuFilter = "all", // "all" | "in_menu" | "hidden"
    stockFilter = "all", // "all" | "in_stock" | "out_of_stock"
    weightTypeFilter = "all", // "all" | "g" | "kg" | "ml" | "ltr" | "none"
    offerFilter = "all", // "all" | "offers_only"
    sortBy = "newest", // "newest" | "oldest" | "price_low" | "price_high" | "name_asc" | "name_desc" | "margin_high"
  } = {}
) => {
  if (!products || products.length === 0) return [];

  // 1. Search
  let result = searchProductsSvc(products, searchValue);

  // 2. Menu Filter
  if (menuFilter === "in_menu") {
    result = result.filter((p) => p.show_in_menu !== false);
  } else if (menuFilter === "hidden") {
    result = result.filter((p) => p.show_in_menu === false);
  }

  // 3. Stock Filter
  if (stockFilter === "in_stock") {
    result = result.filter((p) => p.is_product_in_stock !== false);
  } else if (stockFilter === "out_of_stock") {
    result = result.filter((p) => p.is_product_in_stock === false);
  }

  // 4. Weight Type Filter
  if (weightTypeFilter && weightTypeFilter !== "all") {
    result = result.filter(
      (p) => p.product_weight_type?.toLowerCase() === weightTypeFilter.toLowerCase()
    );
  }

  // 5. Offer Filter
  if (offerFilter === "offers_only") {
    result = result.filter(
      (p) => p.is_offer_available === true && Number(p.product_offer_price) > 0
    );
  }

  // 6. Sorting
  return sortProductsSvc(result, sortBy);
};

// SORTING
export const sortProductsSvc = (products = [], sortBy = "newest") => {
  if (!products || products.length === 0) return [];

  const list = [...products];

  switch (sortBy) {
    case "newest":
      return list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    case "oldest":
      return list.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
    case "price_low":
      return list.sort(
        (a, b) => Number(a.product_selling_price || 0) - Number(b.product_selling_price || 0)
      );
    case "price_high":
      return list.sort(
        (a, b) => Number(b.product_selling_price || 0) - Number(a.product_selling_price || 0)
      );
    case "name_asc":
      return list.sort((a, b) =>
        (a.product_name || "").localeCompare(b.product_name || "", undefined, { sensitivity: "base" })
      );
    case "name_desc":
      return list.sort((a, b) =>
        (b.product_name || "").localeCompare(a.product_name || "", undefined, { sensitivity: "base" })
      );
    case "margin_high":
      return list.sort((a, b) => {
        const marginA = Number(a.product_selling_price || 0) - Number(a.product_cost_price || 0);
        const marginB = Number(b.product_selling_price || 0) - Number(b.product_cost_price || 0);
        return marginB - marginA;
      });
    default:
      return list;
  }
};

// STATS CALCULATION
export const calculateProductStats = (products = []) => {
  if (!products || products.length === 0) {
    return {
      total: 0,
      inMenu: 0,
      hidden: 0,
      inStock: 0,
      outOfStock: 0,
      hasOffers: 0,
      inMenuPercent: 0,
    };
  }

  const total = products.length;
  let inMenu = 0;
  let hidden = 0;
  let inStock = 0;
  let outOfStock = 0;
  let hasOffers = 0;

  products.forEach((p) => {
    if (p.show_in_menu !== false) {
      inMenu += 1;
    } else {
      hidden += 1;
    }

    if (p.is_product_in_stock !== false) {
      inStock += 1;
    } else {
      outOfStock += 1;
    }

    if (p.is_offer_available === true && Number(p.product_offer_price) > 0) {
      hasOffers += 1;
    }
  });

  const inMenuPercent = total > 0 ? Math.round((inMenu / total) * 100) : 0;

  return {
    total,
    inMenu,
    hidden,
    inStock,
    outOfStock,
    hasOffers,
    inMenuPercent,
  };
};

// EXPORT TO CSV
export const exportProductsToCsv = (products = []) => {
  if (!products || products.length === 0) return;

  const headers = [
    "Product ID",
    "Product Name",
    "Selling Price (INR)",
    "Cost Price (INR)",
    "Offer Price (INR)",
    "Profit Margin (INR)",
    "Weight",
    "UOM",
    "Stock Status",
    "Show in Menu",
    "Created Date",
  ];

  const rows = products.map((p) => {
    const profit = Number(p.product_selling_price || 0) - Number(p.product_cost_price || 0);
    return [
      `"${p._id || ""}"`,
      `"${(p.product_name || "").replace(/"/g, '""')}"`,
      p.product_selling_price || 0,
      p.product_cost_price || 0,
      p.product_offer_price || 0,
      profit,
      p.product_weight || 0,
      `"${p.product_weight_type || "none"}"`,
      p.is_product_in_stock !== false ? "In Stock" : "Out of Stock",
      p.show_in_menu !== false ? "Visible in Menu" : "Hidden",
      `"${p.createdAt ? new Date(p.createdAt).toLocaleDateString() : ""}"`,
    ];
  });

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `products_export_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
