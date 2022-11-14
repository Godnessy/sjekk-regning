import { React, useRef } from "react";
import { Card } from "react-bootstrap";
import github from "../Resources/images/github.jpg";

function BioLink() {
  return (
    <Card className="d-flex flex-column">
      <h5 className="fw-bold text-decoration-underline align-self-center ">
        Created by: Shlomi Levy
      </h5>
      <div className="d-flex social-links flex-row">
        <a href="https://github.com/Godnessy">
          <img
            src={github}
            alt="GitHub"
            className="github-link align-self-center"
          />
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
