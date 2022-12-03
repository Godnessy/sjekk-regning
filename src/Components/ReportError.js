import { React, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { db } from "../firebase-config.js";
import { doc, setDoc } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore";

function ReportError({ uploadFailedFile }) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [text, setText] = useState("");

  const sendInMessage = async (text) => {
    if (text == "") {
      alert("Vennligst skriv en melding før du sender");
      return;
    }
    const date = new Date();
    const dateToSend = date.toLocaleDateString();
    const docRef = await addDoc(collection(db, "userFeedback"), {
      [dateToSend]: text,
    });
    setText("");
    alert("Takk for tilbakemelding! ");
  };

  return (
    <>
      <button
        variant="primary"
        className=" report btn btn-danger"
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
            Har du opplevd eller funnet en feil på nettsiden? <br></br>Gjerne
            fortell oss hva som skjedde! Har du prøvd å sjekke regningen din og
            det fungerte ikke? Kan du sende inn bruksfilen din slik at vi kan
            analysere den og fikse problemet slik at dette ikke skjer for deg
            eller andre brukere igjen<br></br> hvis du ikke ønsker å sende inn
            filen din kan du klikke på avbryt-knappen -
            <b className="text-danger">
              Ingen personlig informasjon vil bli samlet inn uansett om du
              sender inn filen eller ikke.
            </b>{" "}
            <br></br>
            <br></br>
            <p>Melding:</p>
            <div className="d-flex flex-row">
              <input
                type="text"
                asd
                name=""
                id=""
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                }}
              />
              <button
                className="btn"
                onClick={() => {
                  setText("");
                }}
              >
                Reset
              </button>
            </div>
            <button
              className="btn btn-success"
              onClick={() => sendInMessage(text)}
            >
              Send inn melding/fil
            </button>
          </h2>
        </Modal.Header>
        <Modal.Footer className="d-flex justify-content-between">
          <Button variant="danger" onClick={handleClose}>
            Avbryt
          </Button>
          <Button variant="success" onClick={uploadFailedFile}>
            Send inn filen uten melding
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ReportError;
