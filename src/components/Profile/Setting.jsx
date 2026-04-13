import React, {useContext, useEffect} from "react";
import { UserContext } from "../../contexts/context";

function Setting() {
  const { setActiveTab } = useContext(UserContext);
    useEffect(() => setActiveTab("setting"), [])

  return <>
  <h2>Setting Change pass...</h2>
  </>;
}

export default Setting;
