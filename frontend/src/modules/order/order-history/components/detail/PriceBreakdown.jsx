import { SectionCard, SectionLabel } from "@/components/common";

const PriceBreakdown = ({ price_detail }) => {
  if (price_detail) {
    const { subTotal, finalPrice, taxPrice, deliveryCharge } = price_detail;

    return (
      <SectionCard>
        <div>
          <SectionLabel>PRICE BREAKDOWN</SectionLabel>
          <div className="*:flex *:justify-between *:items-center [&_p>span:first-child]:text-gray-500 [&_p>span:last-child]:font-semibold [&_p>span:last-child]:text-[14px] pb-3 pt-2 space-y-1.5 border-b border-r-gray-500 text-sm">
            <p>
              <span>Subtotal</span>
              <span>₹{subTotal?.toFixed(2)}</span>
            </p>
            <p>
              <span>Shipping</span>
              {deliveryCharge ? (
                <span>₹{deliveryCharge}</span>
              ) : (
                <span className="text-green-600">FREE</span>
              )}
            </p>
            <p>
              <span>
                Tax <span className="text-[10px]">(2%)</span>
              </span>
              <span>₹{taxPrice}</span>
            </p>
          </div>
          <div className="*:flex *:justify-between *:items-center *:font-bold pt-2">
            <p>
              <span>Total</span>₹{finalPrice}
            </p>
          </div>
        </div>
      </SectionCard>
    );
  }
  return null;
};

export default PriceBreakdown;
