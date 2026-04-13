import React, { useContext, useEffect } from "react";
import { Catagory, Hero } from "../index";
import {UserContext} from "../../contexts/context"
function Home({productsList}) {
  const {setActiveTab} = useContext(UserContext)
  useEffect(()=>setActiveTab("personalinformation"),[])

  return (
    <>
      <Hero />
      <Catagory productsList={productsList} />
    </>
  );
}

export default Home;
