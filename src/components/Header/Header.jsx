import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import { CartProductContext, UserContext } from "../../contexts/context";

function Header() {
  const { isLogin } = useContext(UserContext);

  const { cartLength } = useContext(CartProductContext);
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");

  function onSearchProduct(searchInputBoxValue) {
    // setSearchValue(searchInputBoxValue);
    if (searchInputBoxValue?.length > 0) {
      setSearchValue(searchInputBoxValue);
      navigate(`/allproducts/searchproduct/${searchInputBoxValue}`);
    } else {
      setSearchValue("");
      navigate(`/`);
    }
  }
  // console.log(searchValue);
  // console.log('CART LENGTH: ',cartLength);

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
                      <p className="text-[14px] font-semibold">{cartLength}</p>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="border border-black rounded-[50%] p-0.5">
                <Link to="profile">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="26px"
                    viewBox="0 -960 960 960"
                    width="26px"
                    fill=""
                  >
                    <path d="M367-527q-47-47-47-113t47-113q47-47 113-47t113 47q47 47 47 113t-47 113q-47 47-113 47t-113-47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm296.5-343.5Q560-607 560-640t-23.5-56.5Q513-720 480-720t-56.5 23.5Q400-673 400-640t23.5 56.5Q447-560 480-560t56.5-23.5ZM480-640Zm0 400Z" />
                  </svg>
                </Link>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="bg-gradient-to-r font-semibold from-green-600 to-green-300 px-3 py-1 rounded-2xl">
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
