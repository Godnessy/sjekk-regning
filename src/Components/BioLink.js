import { React, useRef } from "react";
import { Card } from "react-bootstrap";
import github from "../Resources/images/github.jpg";
import fb from "../Resources/images/fb.png";

function BioLink() {
  return (
    <Card className="d-flex flex-column">
      <h5 className="fw-bold text-decoration-underline align-self-center ">
        Created by: Shlomi Levy
      </h5>
      <div className="social-links">
        <a href="https://github.com/Godnessy">
          <img src={github} alt="GitHub" className="github-link" />
        </a>
        <a href="https://www.facebook.com/groups/561110268888888">
          <img src={fb} alt="FB-logo" />
        </a>
        <p
          className="email me-3 mt-2"
          onClick={() => {
            navigator.clipboard.writeText("Godnessy@gmail.com");
            alert("Kopierte epost til utklippstavle");
          }}
        >
          Godnessy@gmail.com
        </p>
      </div>
    </Card>
  );
}

export default BioLink;
