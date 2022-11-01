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

function Instructions() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //TODO:
  //-on main page make CSV part of form bigger and add 1 2 3 to step following the flow, change Regne ut position to inside the form
  //and make the button bigger
  //-Add a background and more pop to total pris (add Din Regning:) when the button is clicked
  //-Add details in the middle between day and hourly to explain what people see.

  //Modal:
  //--make the divs smaller so people can see
  //-Make an arrow pointing down so people will know there is more
  // add Steg X/Y so people know

  return (
    <>
      <p variant="primary" className="csv-modal" onClick={handleShow}>
        Vet ikke hvor den finnes? Her finner du en guide med bilder.
      </p>

      <Modal
        show={show}
        onHide={() => setShow(false)}
        className="modal modal-xl"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton className="text-danger">
          For å bergene fakturen for deg må vi få målevardiene fra deg, Vi har
          samlet bilder av den nøyaktige banen du må følge for å få filen
          enkelt!
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-column">
            <Card className="mb-3 border border-5 border-dark">
              <Card.Title className="ms-3">
                Først må du gå til{" "}
                <a href="http://elhub.no" target="_blank">
                  Elhub
                </a>{" "}
                sin nettside
              </Card.Title>
              <Card.Body>
                <img className="inst-pic" src={pic1} alt="" srcset="" />
              </Card.Body>
            </Card>
            <Card className="mb-3 border border-5 border-dark">
              <Card.Body>
                <img className="inst-pic" src={pic2} alt="" srcset="" />
              </Card.Body>
            </Card>
            <Card className="mb-3 border border-5 border-dark">
              <Card.Body>
                <img className="inst-pic" src={pic3} alt="" srcset="" />
              </Card.Body>
            </Card>
            <Card className="mb-3 border border-5 border-dark">
              <Card.Body>
                <img className="inst-pic" src={pic4} alt="" srcset="" />
              </Card.Body>
            </Card>
            <Card className="mb-3 border border-5 border-dark">
              <Card.Body>
                <img className="inst-pic" src={pic5} alt="" srcset="" />
              </Card.Body>
            </Card>
            <Card className="mb-3 border border-5 border-dark">
              <Card.Body>
                <img className="inst-pic" src={pic6} alt="" srcset="" />
              </Card.Body>
            </Card>
            <Card className="mb-3 border border-5 border-dark">
              <Card.Title className="ms-3 fs-4 text-danger my-3">
                Systemet vårt er i betamodus og kan bare beregne priser for
                oktober 2022 akkurat nå! Flere måneder kommer snart.
              </Card.Title>
              <Card.Body>
                <img className="inst-pic" src={pic7} alt="" srcset="" />
              </Card.Body>
            </Card>
            <Card className="mb-3 border border-5 border-dark">
              <Card.Body>
                <img className="inst-pic" src={pic8} alt="" srcset="" />
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
