import React from "react";
import logo from "../Resources/images/logoTransp.png";
import prisMatch from "../Resources/images/pris-match.png";
import ReportError from "./ReportError";

function Navbar({ uploadFailedFile, file, handleCsvFile }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-light d-flex flex-row bg-light justify-content-left">
      <a className="navbar-brand" href="#">
        <img src={logo} alt="SjekkRegning.no" className="logo ms-4" />
      </a>
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
