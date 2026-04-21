import React, { useContext, useEffect } from "react";
import {
  Catagory,
  Hero,
  truckImgUrl,
  coinImgUrl,
  trustImgUrl,
  leafImgUrl,
  bottomBannerImageH,
  bottomBannerImageV,
  bottomBanner,
} from "../index";
import { UserContext } from "../../contexts/context";

function Home({ productsList }) {
  const items = [
    {
      text: "Fastest Delivery",
      text_info: "Groceries delivered in under 30 minutes.",
      src: truckImgUrl,
    },
    {
      text: "Freshness Guaranteed",
      text_info: "Fresh produce straight from the source.",
      src: leafImgUrl,
    },
    {
      text: "Affordable Prices",
      text_info: "Quality groceries at unbeatable prices.",
      src: coinImgUrl,
    },
    {
      text: "Trusted by Thousands",
      text_info: "Loved by 10,000+ happy customers.",
      src: trustImgUrl,
    },
  ];
  const { setActiveTab } = useContext(UserContext);
  useEffect(() => setActiveTab("personalinformation"), []);

  return (
    <>
      <Hero />
      <Catagory productsList={productsList} />
      <section className="p-5 py-10">
        <div className="sm:flex sm:gap-10 space-y-10 bg-blue-200 rounded-2xl p-5 sm:items-center">
        {/* left  */}
          <div className="w-auto sm:w-[60vw] md:w-[80vw]">

            <img
              src={bottomBanner}
              alt="bottom banner image"
            />
          </div>
          {/* right  */}
          <div className="w-full">
            <div>
              <div className="text-green-700 text-4xl font-semibold mb-5">
                <p>Why We Are the Best?</p>
              </div>
              {items.map((item, i) => {
                return (
                  <div key={i} className="flex items-center gap-3  my-2">
                    <div className="w-10 h-10">
                      <img className="h-max w-max" src={item.src} alt="" />
                    </div>
                    <div>
                      <p className="font-semibold text-2xl sm:text-xl md:text-xl text-[#364153]">
                        {item.text}
                      </p>
                      <p className="text-[#9c9aa4] md:text-md sm:text-sm">{item.text_info}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
