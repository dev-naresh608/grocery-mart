import {
  AddressContextProvider,
  CartProductContextProvider,
  OrderHistoryContextProvider,
  ProductContextProvider,
  UserContextProvider,
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
} from "./components/index";

import {
  BrowserRouter,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";

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
        </Route>
        <Route path="cart" element={<Cart />}></Route>
        <Route path="addressform" element={<AddressForm />}></Route>
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
                <RouterProvider router={router} />
              </OrderHistoryContextProvider>
            </AddressContextProvider>
          </ProductContextProvider>
        </CartProductContextProvider>
      </UserContextProvider>
    </>
  );
}
export default App;
