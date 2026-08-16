// SEARCH
export const searchProductsSvc = (allProducts, searchValue) => {
  if (!searchValue?.trim()) {
    return allProducts;
  }

  const search = searchValue.toLowerCase().trim();

  return allProducts.filter((p) => {
    return (
      p._id?.toLowerCase().includes(search) ||
      p.product_name?.toLowerCase().includes(search) ||
      String(p.product_cost_price).includes(search) ||
      String(p.product_offer_price).includes(search) ||
      String(p.product_selling_price).includes(search) ||
      String(p.product_weight).includes(search) ||
      ("$" + String(p.product_cost_price)).includes(search) ||
      ("$" + String(p.product_offer_price)).includes(search) ||
      ("$" + String(p.product_selling_price)).includes(search) ||
      p.product_weight_type?.toLowerCase().includes(search)
    );
  });
};

// SORT
export const sortProductByDate = (
  allProducts,
  product = "desc",
) => {
  if (!allProducts || allProducts.length === 0) {
    return allProducts;
  }

  return [...allProducts].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return product === "desc" ? dateB - dateA : dateA - dateB;
  });
};

export const sortProductBySellingPrice = (allProducts, product = "desc") => {
  if (!allProducts || allProducts.length === 0) {
    return allProducts;
  }

  return [...allProducts].sort((a, b) => {
    const priceA = a.product_selling_price;
    const priceB = b.product_selling_price;

    return product === "desc" ? priceB - priceA : priceA - priceB;
  });
};

export const sortProductByCostPrice = (allProducts, product = "desc") => {
  if (!allProducts || allProducts.length === 0) {
    return allProducts;
  }

  return [...allProducts].sort((a, b) => {
    const priceA = a.product_cost_price;
    const priceB = b.product_cost_price;

    return product === "desc" ? priceB - priceA : priceA - priceB;
  });
};

export const sortProductByOfferPrice = (allProducts, product = "desc") => {
  if (!allProducts || allProducts.length === 0) {
    return allProducts;
  }

  return [...allProducts].sort((a, b) => {
    const priceA = a.product_offer_price;
    const priceB = b.product_offer_price;

    return product === "desc" ? priceB - priceA : priceA - priceB;
  });
};

export const sortProductByWeightType = (allProducts, product = "desc") => {
  if (!allProducts || allProducts.length === 0) {
    return allProducts;
  }

  return [...allProducts].sort((a, b) => {
    const priceA = a.product_weight_type;
    const priceB = b.product_weight_type;

    return product === "desc" ? priceB - priceA : priceA - priceB;
  });
};
