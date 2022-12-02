import { React, useState } from "react";
import { Card, Modal, Button } from "react-bootstrap";

function UploadFail() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [text, setText] = useState("");

  return (
    <>
      <button
        variant="primary"
        className="csv-modal btn btn-danger"
        onClick={handleShow}
      >
        Rapporter feil
      </button>

      <Modal
        show={show}
        onHide={() => setShow(false)}
        className="modal modal-xl"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton className="">
          <h2>
            Det har oppstått en feil under forsøk på å analysere bruksfilen din.
            <br></br>
            Vi vil veldig gjerne motta filen for å kunne finne ut hva problemet
            var og hvordan vi kan fikse det for deg og andre brukere. Hvis du
            ønsker å hjelpe oss, vennligst klikk på send inn-knappen, hvis du
            ikke ønsker å sende inn filen din kan du klikke på avbryt-knappen -
            <b className="text-danger">
              Ingen personlig informasjon vil bli samlet inn uansett om du
              sender inn filen eller ikke.
            </b>{" "}
            Vil du sende inn informasjon? send meg gjerne en e-post på
            Godnessy@gmail.com
          </h2>
        </Modal.Header>
        <Modal.Footer className="d-flex justify-content-between">
          <Button variant="danger" onClick={handleClose}>
            Avbryt
          </Button>
          <Button variant="success">Send inn filen</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default UploadFail;
