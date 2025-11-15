// import { Container } from "react-bootstrap";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../common/Header/Header";

import "./Layout.scss";
// import Rezormawatermark from "../../assets/icons/Rezormawatermark.svg";
import { useState } from "react";

const Layout = () => {

  var location  = useLocation();
  
  const [active, setActive] = useState<boolean | any>(false);
  const handleActive = () =>
    document.body.clientWidth < 1199 && setActive(!active);
  return (
    <>
      <div className={`layout`}>
        {/* {location.pathname !== '/' && (
        <Header handleActive={handleActive} active={active} />
        )} */}
        <>
          <Outlet />
        </>
        {/* <span className="waterMark">
          <img src={Rezormawatermark} alt="Water mark" />
        </span> */}
      </div>
    </>
  );
};

export default Layout;
