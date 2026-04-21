import {
  AddressContextProvider,
  CartProductContextProvider,
  OrderHistoryContextProvider,
  ProductContextProvider,
  UserContextProvider,
  WishlistContextProvider,
} from "./contexts/context";

import {
  AllProducts,
  CatagoryWiseProducts,
  Layout,
  Profile,
  PersonalInfo,
  Setting,
  Payments,
  Orders,
  Cart,
  Home,
  Login,
  Signup,
  SearchProduct,
  AddressForm,
  MyProducts,
  AddProduct,
  Wishlist,
} from "./components/index";

import {
  BrowserRouter,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ProductList from "./components/Cart/ProductList";
import SellerOrders from "./components/Profile/Seller/SellerOrders";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>

        <Route path="" element={<Home />}></Route>

        <Route path="allproducts" element={<AllProducts />}></Route>
        <Route path="profile" element={<Profile />}>
          <Route path="personalinformation" element={<PersonalInfo />}></Route>
          <Route path="orderhistory" element={<PersonalInfo />}></Route>
          <Route path="payments" element={<PersonalInfo />}></Route>
          <Route path="setting" element={<Setting />}></Route>
          <Route path="cart" element={<Cart />}></Route>
          <Route path="wishlist" element={<Wishlist />}></Route>
          <Route path="myproducts" element={<MyProducts />}></Route>
        </Route>
        <Route path="cart" element={<Cart />}></Route>
        <Route path="addressform" element={<AddressForm />}></Route>
        <Route path="seller/addproducts" element={<AddProduct />}></Route>
        <Route path="seller/product-list" element={<MyProducts />}></Route>
        <Route path="seller/orders" element={<SellerOrders />}></Route>
        <Route
          path="catagoryWiseProducts/:catagoryId"
          element={<CatagoryWiseProducts />}
        />
        <Route
          path="/allproducts/searchproduct/:searchValue"
          element={<SearchProduct />}
        />
      </Route>,
    ),
  );

  return (
    <>
      <UserContextProvider>
        <CartProductContextProvider>
          <ProductContextProvider>
            <AddressContextProvider>
              <OrderHistoryContextProvider>
                <WishlistContextProvider>
                  <RouterProvider router={router} />
                </WishlistContextProvider>
              </OrderHistoryContextProvider>
            </AddressContextProvider>
          </ProductContextProvider>
        </CartProductContextProvider>
      </UserContextProvider>
    </>
  );
}
export default App;
