import React from "react";
import {
  WeightIcon,
  CheckCircleIcon,
  XCircleIcon,
  ImageOffIcon,
  TagIcon,
} from "lucide-react";

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount);
}

function ProductImage({ url, name }) {
  const [error, setError] = React.useState(false);

  if (error || !url) {
    return (
      <div className="w-[110px] h-[110px] flex-shrink-0 bg-gray-50 flex items-center justify-center">
        <ImageOffIcon size={28} className="text-gray-300" />
      </div>
    );
  }

  return (
    <img
      src={url}
      alt={name}
      onError={() => setError(true)}
      className="w-[110px] h-[110px] flex-shrink-0 object-cover"
    />
  );
}

function StockBadge({ inStock }) {
  return inStock ? (
    <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-green-50 text-green-800 rounded-full px-2.5 py-0.5">
      <CheckCircleIcon size={11} />
      In stock
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-red-50 text-red-800 rounded-full px-2.5 py-0.5">
      <XCircleIcon size={11} />
      Out of stock
    </span>
  );
}

function PriceDisplay({ price, offerPrice, isOfferAvailable }) {
  return (
    <div className="flex items-baseline gap-1.5 mt-auto">
      <span className="text-base font-semibold text-gray-900">
        {formatCurrency(isOfferAvailable ? offerPrice : price)}
      </span>
      {isOfferAvailable && (
        <>
          <span className="text-xs text-gray-400 line-through">
            {formatCurrency(price)}
          </span>
          <span className="text-[11px] font-medium bg-amber-50 text-amber-800 rounded-full px-2 py-0.5">
            Offer
          </span>
        </>
      )}
    </div>
  );
}

export function OrderItemCard({ item }) {
  const {
    _id,
    product_name,
    product_url,
    product_weight,
    product_weight_type,
    product_selling_price,
    product_offer_price,
    product_description,
    is_product_in_stock,
    is_offer_available,
  } = item;

  const weightLabel =
    product_weight_type && product_weight_type !== "none"
      ? `${product_weight} ${product_weight_type}`
      : `${product_weight}`;

  return (
    <div className="flex overflow-hidden bg-white border border-gray-100 rounded-xl">
      <ProductImage url={product_url} name={product_name} />

      <div className="flex flex-col flex-1 min-w-0 px-4 py-3.5 gap-1.5">
        {/* Name */}
        <p className="text-[15px] font-medium text-gray-900 truncate">
          {product_name}
        </p>

        {/* Description */}
        {product_description && (
          <p className="text-xs text-gray-500 truncate leading-relaxed">
            {product_description}
          </p>
        )}

        {/* Weight + stock */}
        <div className="flex items-center gap-2 flex-wrap">
          {product_weight > 0 && (
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <WeightIcon size={13} />
              {weightLabel}
            </span>
          )}
          <StockBadge inStock={is_product_in_stock} />
        </div>

        {/* Price */}
        <PriceDisplay
          price={product_selling_price}
          offerPrice={product_offer_price}
          isOfferAvailable={is_offer_available}
        />

        {/* ID */}
        <p className="text-[10px] font-mono text-gray-300 mt-0.5">{_id}</p>
      </div>
    </div>
  );
}

export function OrderItemList({ items = [] }) {

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <OrderItemCard key={item._id} item={item} />
      ))}
    </div>
  );
}