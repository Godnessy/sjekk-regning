import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import logo from "../Resources/images/logoTransp.png";

function Navbar({ logOut }) {
  return (
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <a class="navbar-brand" href="#">
        <img src={logo} alt="SjekkRegning.no" className="logo ms-4" />
      </a>
      {/* <Button className="" onClick={logOut}>
        Logg ut
      </Button> */}
    </nav>
  );
}

export default Navbar;
