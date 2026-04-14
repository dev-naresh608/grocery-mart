import React, { useContext } from "react";
import { Link } from "react-router-dom";
import heroBannerImg from "../../assets/fruit-basket.png";

import {Catagory, Home} from '../index'
function Hero() {

  return (
    <>
      {/* hero section  */}
      <section className="flex items-center">
        <div className="h-72 w-full bg-yellow-200 px-20 flex items-center justify-between">
          {/* left content  */}
          <div className="space-y-4 ">
            <div>
              <h1 className="font-normal text-2xl sm:text-5xl">
                <span className="text-green-500 font-semibold">Organic </span>
                Foods at your <span className="font-semibold">Doorsteps</span>
              </h1>
            </div>
            <div className="text-black ">
              <p>Enjoy Healthy Food</p>
            </div>
            <div className="w-ma">
              <Link 
              className="bg-gradient-to-r font-semibold from-green-600 to-green-300 px-3 py-1 rounded-2xl whitespace-nowrap" to="/allproducts">
                Start Shoping
              </Link>
            </div>
          </div>

          {/* right content  */}
          <div>
            <img src={heroBannerImg} alt="hero banner" />
          </div>
        </div>
      </section>
    </>
  );
}

export default Hero;