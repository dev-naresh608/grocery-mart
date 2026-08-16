import { SectionCard, SectionLabel } from "../../../../index";

const OrderItems = ({ order ,orderItems}) => {
  if (order) {
    const ProductImage = ({ url }) => {
      return (
        <div className="group h-14 w-14 flex items-center justify-center rounded-2xl border bg-gray-100">
          <img
            className="group-hover:scale-105 duration-150 w-10 h-10 object-contain"
            src={url}
            alt="order item"
          />
        </div>
      );
    };

    return (
      <SectionCard className="p-5">
        <div className="flex items-center text-sm gap-2 pb-2">
          <SectionLabel>Items</SectionLabel>
          <SectionLabel className="bg-gray-100 rounded-2xl text-gray-500 px-2">
            {orderItems.length} items
          </SectionLabel>
        </div>

        <div
          className="space-y-3 gap-3 max-h-48 overflow-x-hidden overflow-y-auto 
  [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:bg-gray-400
  [&::-webkit-scrollbar-thumb]:rounded-full"
        >
          {orderItems.map((product) => {
            const total = product.product_qty * product.product_selling_price;

            return (
              <div
                key={product._id}
                className="hover:bg-gray-100/80 cursor-pointer border bg-gray-100/40 rounded-2xl p-2 flex items-center gap-2"
              >
                <ProductImage url={product.product_url} />
                <div className="text-xs">
                  <h3 className="font-semibold capitalize">
                    {product.product_name}
                  </h3>
                  <p className="text-gray-500">
                    Weight:{" "}
                    {product.product_weight_type === "none"
                      ? product.product_weight
                      : `${product.product_weight}${product.product_weight_type}`}
                  </p>
                  <div>
                    <span className="font-semibold text-gray-500">
                      ${product.product_selling_price} x {product.product_qty} = $
                      {total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>
    );
  }
};


export default OrderItems