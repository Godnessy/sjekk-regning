import { React, useState } from "react";
import { Card, Modal, Button } from "react-bootstrap";
import pic1 from "../Resources/images/csv-flow/1.png";
import pic2 from "../Resources/images/csv-flow/2.png";
import pic3 from "../Resources/images/csv-flow/3.png";
import pic4 from "../Resources/images/csv-flow/4.png";
import pic5 from "../Resources/images/csv-flow/5.png";
import pic6 from "../Resources/images/csv-flow/6.png";
import pic7 from "../Resources/images/csv-flow/7.png";
import pic8 from "../Resources/images/csv-flow/8.png";
import arrow from "../Resources/images/csv-flow/arrow.png";
function Instructions() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <p variant="primary" className="csv-modal" onClick={handleShow}>
        Klikk her for veiledning.
      </p>

      <Modal
        show={show}
        onHide={() => setShow(false)}
        className="modal modal-xl"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton className="text-danger">
          <h2>Slik får du frem filen som inneholder bruksverdiene dine:</h2>
        </Modal.Header>
        <Modal.Body>
          <img src={arrow} alt="" className="modal-arrow" />
          <div className="d-flex flex-column">
            <Card className="mb-3 border border-5 border-dark">
              <Card.Title className="ms-3">
                1. Først må du gå til{" "}
                <a href="http://elhub.no" target="_blank">
                  Elhub
                </a>{" "}
                sin nettside - Steg 1/8
              </Card.Title>
              <Card.Body>
                <img className="inst-pic" src={pic1} alt="" />
              </Card.Body>
            </Card>
            <Card className="mb-3 border border-5 border-dark">
              <Card.Title className="ms-3">Steg 2/8</Card.Title>
              <Card.Body>
                <img className="inst-pic" src={pic2} alt="" />
              </Card.Body>
            </Card>
            <Card className="mb-3 border border-5 border-dark">
              <Card.Title className="ms-3">Steg 3/8</Card.Title>
              <Card.Body>
                <img className="inst-pic" src={pic3} alt="" />
              </Card.Body>
            </Card>
            <Card className="mb-3 border border-5 border-dark">
              <Card.Title className="ms-3">Steg 4/8</Card.Title>
              <Card.Body>
                <img className="inst-pic" src={pic4} alt="" />
              </Card.Body>
            </Card>
            <Card className="mb-3 border border-5 border-dark">
              <Card.Title className="ms-3">Steg 5/8</Card.Title>
              <Card.Body>
                <img className="inst-pic" src={pic5} alt="" />
              </Card.Body>
            </Card>
            <Card className="mb-3 border border-5 border-dark">
              <Card.Title className="ms-3">Steg 6/8</Card.Title>
              <Card.Body>
                <img className="inst-pic" src={pic6} alt="" />
              </Card.Body>
            </Card>
            <Card className="mb-3 border border-5 border-dark">
              <Card.Title className="ms-3 fs-4 text-danger mt-2">
                Systemet vårt er i betamodus og kan bare beregne priser for
                oktober 2022 akkurat nå! Flere måneder kommer snart.
                <p className="text-dark">Steg 7/8</p>
              </Card.Title>
              <Card.Body>
                <img className="inst-pic" src={pic7} alt="" />
              </Card.Body>
            </Card>
            <Card className="mb-3 border border-5 border-dark">
              <Card.Title className="ms-3">Steg 8/8</Card.Title>
              <Card.Body>
                <img className="inst-pic" src={pic8} alt="" />
              </Card.Body>
            </Card>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Instructions;
