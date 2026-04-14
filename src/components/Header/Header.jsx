import React, { useContext, useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import { CartProductContext, UserContext } from "../../contexts/context";
import {defaultPP} from "../index";


function Header() {
  const { isLogin, currentUser, setActiveTab } = useContext(UserContext);

  const { cartItems } = useContext(CartProductContext);
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");

  function onSearchProduct(searchInputBoxValue) {
    if (searchInputBoxValue?.length > 0) {
      setSearchValue(searchInputBoxValue);
      navigate(`/allproducts/searchproduct/${searchInputBoxValue}`);
    } else {
      setSearchValue("");
      navigate(`/`);
    }
  }

  return (
    <div className="flex justify-between items-center py-3 px-10">
      <div>
        <Link to="/">
          <span className="text-green-700 font-bold text-3xl">GroceryMart</span>
        </Link>
      </div>
      {/* right nav  */}
      <div className="flex items-center gap-5">
        <div>
          <ul className="flex gap-5 font-semibold">
            <li className="sm:block hidden">
              <NavLink
                className={({ isActive }) =>
                  `${isActive ? "text-green-700" : "text-black"}`
                }
                to="/"
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                className={({ isActive }) =>
                  `${isActive ? "text-green-700" : "text-black"}`
                }
                to="/allproducts"
              >
                All Products
              </NavLink>
            </li>
          </ul>
        </div>

        <div className="flex items-center gap-5">
          <div className="sm:flex hidden border-black border h-6 rounded-xl pl-2 items-center">
            <input
              className="outline-none h-6 bg-transparent px-1"
              type="text"
              value={searchValue}
              placeholder="Search Products..."
              onChange={(e) => onSearchProduct(e.target.value)}
            />
            <div className="border-l border-black">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="gray"
              >
                <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
              </svg>
            </div>
          </div>

          {isLogin ? (
            <>
              <div>
                <Link to="/cart">
                  <div className="relative">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-shopping-cart w-6 h-6"
                      data-fg-d5jy27="1.12:1.4176:/src/app/components/Header.tsx:51:15:2195:36:e:ShoppingCart::::::BPYc"
                    >
                      <circle cx="8" cy="21" r="1"></circle>
                      <circle cx="19" cy="21" r="1"></circle>
                      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
                    </svg>
                    <div className="flex items-center justify-center bg-green-600 rounded-[50%] h-3.5 w-3.5 absolute bottom-3.5 left-4">
                      <p className="text-[14px] font-semibold">{cartItems?.length || 0}</p>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="border border-green-800 h-7 w-7 overflow-clip rounded-[50%]">
                <Link to="profile"
                onClick={() => setActiveTab("personalinformation")}
                >
                  <img
                  loading="lazy"
                  className="object-cover h-full w-full rounded-[50%]"
                    src={
                      currentUser.hasOwnProperty("imageUrl")
                        ? currentUser.imageUrl
                        : defaultPP
                    }
                    alt=""
                  />
                </Link>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-gradient-to-r font-semibold from-green-600 to-green-300 px-3 py-1 rounded-2xl"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
