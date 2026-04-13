import React from "react";
import { footerBannerUrl, shopingCartWithGroceryItems } from "../index";

function Footer() {
  return (
    <>
      <section className="sm:pb-[50vh] relative bg-yellow-200 p-10">
        <div className="relative">
          {/* upper  */}
          <div className="sm:flex hidden justify-center relative z-20">
            <div className="flex overflow-clip justify-between rounded-2xl bg-gray-100 w-[50vw]">
              {/* left  */}
              <div className="flex-col space-y-2 p-10 text-green-700 font-semibold">
                <div>
                  <p className="text-2xl">Get Start</p>
                </div>
                <div>
                  <h2>Become a Shopper</h2>
                </div>
                <div>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Totam, fuga!
                  </p>
                </div>
                <div className="bg-green-500 text-black w-max rounded-xl px-2 p-1 text-sm">
                  <a
                    href="https://play.google.com/store/apps/details?id=com.grofers.customerapp&hl=en_IN"
                    target="_blank"
                  >
                    Download The App
                  </a>
                </div>
              </div>

              {/* right  */}
              <div className="w-14">
                <img className="h-full w-full" src={footerBannerUrl} alt="" />
              </div>
            </div>
          </div>

          {/* lower  */}
          <div className="bg-[#efd565] sm:absolute rounded-2xl top-40 w-full">
            <div className="flex items-center justify-center space-x-10 p-5 sm:pt-24 pb-10 px-6 ">
              <div className=" h-36 w-36">
                <img src={shopingCartWithGroceryItems} alt="" />
              </div>
              <div className="flex items-start space-x-7">
                {/* <!-- About --> */}
                <div>
                  <h2 className="font-semibold text-lg mb-4 text-[#1F2937]">
                    About
                  </h2>
                  <ul className="space-y-2 text-sm text-gray-800">
                    <li>
                      <a
                        href="#"
                        className="text-gray-600 hover:text-green-600"
                      >
                        About Company
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-600 hover:text-green-600"
                      >
                        Carrers
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-600 hover:text-green-600"
                      >
                        Blog
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-600 hover:text-green-800"
                      >
                        Privacy Policy
                      </a>
                    </li>
                  </ul>
                </div>

                {/* <!-- Catagories --> */}
                <div>
                  <h2 className="font-semibold text-lg mb-4">Customer</h2>
                  <ul className="space-y-2 text-sm text-gray-800">
                    <li>
                      <a
                        href="#"
                        className="text-gray-600 hover:text-green-600"
                      >
                        Fruits & Vegetables
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-600 hover:text-green-600"
                      >
                        Dairy & Bakery
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-600 hover:text-green-600"
                      >
                        Snacks & Beverages
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-600 hover:text-green-600"
                      >
                        Personal Care
                      </a>
                    </li>
                  </ul>
                </div>

                {/* <!-- Contact --> */}
                <div>
                  <h2 className="font-semibold text-lg mb-4">Contact</h2>
                  <ul className="space-y-2 text-sm text-gray-800">
                    <li>
                      <a
                        href="#"
                        className="text-gray-600 hover:text-green-600"
                      >
                        Email
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-600 hover:text-green-600"
                      >
                        Phone Number
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-600 hover:text-green-600"
                      >
                        Address
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-600 hover:text-green-600"
                      >
                        Support Hours
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="sm:flex hidden flex-col items-start space-y-4">
                {/* <!-- Social Icons --> */}
                <div className="flex space-x-3">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-black text-white text-sm">
                    f
                  </div>
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-black text-white text-sm">
                    t
                  </div>
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-black text-white text-sm">
                    in
                  </div>
                </div>

                {/* <!-- Email Input --> */}
                <input
                  type="email"
                  placeholder="Email"
                  className="w-64 px-4 py-2 rounded-md bg-white text-gray-700 outline-none"
                />

                {/* <!-- Subscribe Button --> */}
                <button className="w-64 py-2 rounded-full bg-yellow-400 text-white font-semibold hover:bg-yellow-500 transition">
                  SUBSCRIBE
                </button>
              </div>
            </div>
            {/* copyright footer  */}
            <div className="flex items-center justify-between px-20 bg-gray-100 h-10 text-green-700 font-semibold rounded-b-2xl">
              <span>@2026 GroceryMart</span>
              <span>grocerymart@outlook.com</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Footer;
