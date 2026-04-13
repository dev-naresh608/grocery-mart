import React, { useEffect, useState } from "react";
import { ProductContext } from "./context";
import { v4 as uuid } from "uuid";

import {
  fruitImgUrl,
  coldDrinkUrl,
  milkUrl,
  waferUrl,
  iceCreamUrl,
} from "../components/index";

import {
  Banana,
  Apple,
  Chiku,
  CocaCola,
  Fanta,
  Grape,
  IceCream,
  Milk,
  ButterMilk,
  RedBull,
  Sprite,
  Lays,
  MasalaMasti,
  AmulCone,
  ChocolateCone,
  AlooSev,
} from "../components/index";

function ProductContextProvider({ children }) {
  const [productsList, setProductsList] = useState([]);
  const intialProducts = [
    {
      name: "Fruits",
      src: fruitImgUrl,
      products: [
        { name: "Banana", price: 21, src: Banana },
        { name: "Apple", price: 36, src: Apple },
        { name: "Grapes", price: 40, src: Grape },
        { name: "Chiku", price: 10, src: Chiku },
      ],
    },
    {
      name: "Cold Drinks & Juices",
      src: coldDrinkUrl,
      products: [
        { name: "Fanta", price: 10, src: Fanta },
        { name: "Coca Cola", price: 15, src: CocaCola },
        { name: "Sprite", price: 10, src: Sprite },
        { name: "Red Bull", price: 50, src: RedBull },
        { name: "Fanta", price: 10, src: Fanta },
        { name: "Coca Cola", price: 15, src: CocaCola },
        { name: "Sprite", price: 10, src: Sprite },
        { name: "Red Bull", price: 50, src: RedBull },
      ],
    },
    {
      name: "Chips & Namkeen",
      src: waferUrl,
      products: [
        { name: "Lays", price: 2, src: Lays },
        { name: "Masala Masti", price: 2, src: MasalaMasti },
        { name: "Aloo Sev", price: 2, src: AlooSev },
      ],
    },
    {
      name: "Dairy Products",
      src: milkUrl,
      products: [
        { name: "Milk", price: 23, src: Milk },
        { name: "Butter Milk", price: 20, src: ButterMilk },
      ],
    },
    {
      name: "Ice Creams & More ",
      src: iceCreamUrl,
      products: [
        { name: "Amul Cone", price: 40, src: AmulCone },
        { name: "Chocolate Cone", price: 10, src: ChocolateCone },
      ],
    },
    {
      name: "Chips & Namkeen",
      src: waferUrl,
      products: [
        { name: "Lays", price: 2, src: Lays },
        { name: "Masala Masti", price: 2, src: MasalaMasti },
        { name: "Aloo Sev", price: 2, src: AlooSev },
      ],
    },
    {
      name: "Dairy Products",
      src: milkUrl,
      products: [
        { name: "Milk", price: 23, src: Milk },
        { name: "Butter Milk", price: 20, src: ButterMilk },
      ],
    },
    {
      name: "Ice Creams & More ",
      src: iceCreamUrl,
      products: [
        { name: "Amul Cone", price: 40, src: AmulCone },
        { name: "Chocklate Cone", price: 10, src: ChocolateCone },
      ],
    },
  ];

  const products = intialProducts
    ?.map((product) => ({
      id: uuid(),
      ...product,
    }))
    .map((product) => ({
      ...product,
      products: product.products.map((p) => ({
        ...p,
        id: uuid(),
      })),
    }));

  useEffect(() => {
    setProductsList(products);
  }, []);

  return (
    <ProductContext.Provider value={{ productsList, setProductsList }}>
      {children}
    </ProductContext.Provider>
  );
}

export default ProductContextProvider;
