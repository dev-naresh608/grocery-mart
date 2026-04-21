import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { ProductContext } from "../../contexts/context";
import ProductImageLoader from "../AllProducts/ProductImageLoader";
import GradientButton from "../GradientButton";

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
       <div>
           <GradientButton componentType="text" className="w-max mb-3 ">Catagories</GradientButton>
       </div>
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
              <div className="flex items-center justify-center group">
                {/* <img
                  src={product.src}
                  className="object-contain w-[120px] h-[120px]"
                  alt={product.name}
                /> */}
                <ProductImageLoader src={product.src} alt={product.name} />
              </div>
              <div className="flex justify-center mb-3">
                <p className="w-28 font-semibold text-sm">{product.name}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-right mt-5">
          <GradientButton componentType="button" to="/allproducts"
            onClick={() => setShowAllCatagoryEnable((prev) => !prev)}
          >
            {showCatBtnText}
          </GradientButton>
        </div>
      </section>

      
    </>
  );
}

export default Catagory;
