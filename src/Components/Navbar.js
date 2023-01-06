import React from "react";
import logo from "../Resources/images/logoTransp.png";
import prisMatch from "../Resources/images/pris-match.png";
import ReportError from "./ReportError";
import fb from "../Resources/images/fb.png";

function Navbar({ uploadFailedFile, file, handleCsvFile }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-light d-flex flex-row bg-light justify-content-left">
      <div className="navbar-brand d-flex flex-row" href="#">
        <img src={logo} alt="SjekkRegning.no" className="logo ms-4" />
        <div className="fb-logo-navbar-container">
          <a href="https://www.facebook.com/groups/561110268888888">
            <img src={fb} alt="FB-logo-navbar" />
          </a>
        </div>
      </div>
      <div className="report-div">
        {
          <ReportError
            uploadFailedFile={uploadFailedFile}
            file={file}
            handleCsvFile={handleCsvFile}
          ></ReportError>
        }
      </div>
    </nav>
  );
}

export default Navbar;
