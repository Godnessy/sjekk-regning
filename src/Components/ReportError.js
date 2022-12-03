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

  const sendInFile = async () => {
    await uploadFailedFile();
    alert("Takk for at du deler filen med oss!");
    setShow(false);
  };

  const sendInMsgFile = async (text, file) => {
    if (text == "" || !file) {
      alert(
        "Mangler melding eller fil, sjekk at du har velgt en fil og har fylt ut meldingen"
      );
      return;
    }
    await sendInMessage(text);
    await uploadFailedFile();

    alert("Takk for tilbakemelding! ");
    setShow(false);
  };

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
    setShow(false);
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
        <Modal.Header closeButton>
          <div className="pe-2">
            <h2>
              Har du opplevd eller funnet en feil på nettsiden? <br></br>Gjerne
              fortell oss hva som skjedde! Har du prøvd å sjekke regningen din
              og det fungerte ikke? Kan du sende inn bruksfilen din slik at vi
              kan analysere den og fikse problemet slik at dette ikke skjer for
              deg eller andre brukere igjen.<br></br> hvis du ikke ønsker å
              sende inn en melding eller filen din kan du klikke på
              avbryt-knappen -
              <b className="text-danger">
                Ingen personlig informasjon <br></br>vil bli samlet inn uansett
                om du sender inn filen eller ikke.
              </b>{" "}
            </h2>
            <br></br>
            <p>Melding:</p>
            <div className="d-flex flex-row">
              <input
                type="text"
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
            <div className="d-flex flex-row mt-2">
              <button
                className="btn btn-success me-2"
                onClick={() => sendInMsgFile(text)}
              >
                Send inn melding og fil
              </button>
              <button
                className="btn btn-info"
                onClick={() => sendInMessage(text)}
              >
                Send inn bare melding
              </button>
            </div>
          </div>
        </Modal.Header>
        <Modal.Footer className="d-flex justify-content-between">
          <Button
            variant="success"
            onClick={() => {
              sendInFile();
            }}
          >
            Send inn filen uten melding
          </Button>
          <Button variant="danger" onClick={handleClose}>
            Avbryt
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ReportError;
