import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { ProductContext } from "../../contexts/context";
import ProductImageLoader from "../AllProducts/ProductImageLoader";

function Catagory() {
  const { productsList } = useContext(ProductContext);

  const [showCatagoriesAsScreen, setShowCatagoriesAsScreen] = useState([]);
  const [showAllCatagoryEnable, setShowAllCatagoryEnable] = useState(false);
  const [showCatBtnText, setShowCatBtnText] = useState("Show All");

  const [screenWidth, setScreenWidth] = useState(0);

  const html = document.documentElement;

  useEffect(() => {
      const width = Math.floor(html.clientWidth / 250);
      setScreenWidth(width)

    if (showAllCatagoryEnable) {
      setShowCatagoriesAsScreen(productsList);
      setShowCatBtnText("Show Less");
    } else {
      if (productsList?.length > 0) {
        setShowCatBtnText("Show All");
        setShowCatagoriesAsScreen(productsList.slice(0, screenWidth));
      }
    }
  }, [productsList, showAllCatagoryEnable, setScreenWidth, screenWidth]);

  return (
    <>
      <section className="pb-10 border w-[90vw] m-auto">
        <div className="grid sm:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5 text-center">
          {showCatagoriesAsScreen?.map((product, index) => (
            <Link
              to={`catagoryWiseProducts/${product.id}`}
              key={product.id}
              className={
                "rounded-2xl " +
                (index % 2 === 0 ? "bg-green-200" : "bg-yellow-200")
              }
            >
              <div className="flex items-center justify-center">
                {/* <img
                  src={product.src}
                  className="object-contain w-[120px] h-[120px]"
                  alt={product.name}
                /> */}
                <ProductImageLoader src={product.src} alt={product.name} />
              </div>
              <div className="flex justify-center mb-3">
                <p className="w-28">{product.name}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-right mt-5">
          <button
            onClick={() => setShowAllCatagoryEnable((prev) => !prev)}
            className="bg-gradient-to-r font-semibold from-green-600 to-green-300 px-3 py-1 rounded-2xl"
            to="/allproducts"
          >
            {showCatBtnText}
          </button>
        </div>
      </section>
    </>
  );
}

export default Catagory;
