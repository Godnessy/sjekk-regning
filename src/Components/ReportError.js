import { React, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { db } from "../firebase-config.js";
import { doc, setDoc } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore";

function ReportError({ uploadFailedFile, file, handleCsvFile }) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [text, setText] = useState("");
  const [email, setEmail] = useState("");
  const [sentFile, setSentFile] = useState(false);

  const sendInFile = async () => {
    if (file) {
      await uploadFailedFile();

      setText("");
      setEmail("");
      setShow(false);
      return;
    } else {
      await uploadFailedFile();
    }
  };

  const sendInMsgFile = async (text, email) => {
    if (text == "" || !file) {
      alert(
        "Mangler melding eller fil, sjekk at du har velgt en fil og har fylt ut meldingen"
      );
      return;
    }
    await sendInMessage(text, email);
    await uploadFailedFile();
    setShow(false);
    setEmail("");
  };

  const sendInMessage = async (text, email = "") => {
    if (text == "") {
      alert("Vennligst skriv en melding før du sender");
      return;
    }
    const date = new Date();
    const dateToSend = date.toLocaleDateString();
    const time = String(date).split(" ")[4];
    const dateForID = dateToSend.replaceAll("/", "-") + "-" + time;
    const answer = email ? { sentAnswer: false } : email;
    const docRef = await setDoc(doc(db, "userFeedback", dateForID), {
      Message: text,
      Email: email,
      Read: false,
      sentWithFile: sentFile,
      Implemented: false,
      answer,
    });
    setText("");
    setEmail("");
    alert("Takk for tilbakemelding! ");
    setShow(false);
    setSentFile(false);
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
            <p className="fw-bold">Melding:</p>
            <div className="d-flex flex-column">
              <input
                type="text"
                name=""
                id=""
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                }}
              />
              <br></br>
              <p className="fw-bold">
                Vil du ha et svar? Skriv inn e-posten din:
              </p>
              <input
                type="email"
                name="emailOfSender"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <button
                className="btn report-reset-button"
                onClick={() => {
                  setText("");
                  setEmail("");
                }}
              >
                Reset
              </button>
            </div>
            <p className="fw-bold">
              Prøvde du å kjøre en fil og det fungerte ikke? du kan sende filen
              til oss for analysering:
            </p>
            <input
              id="csvInput"
              name="file"
              type="File"
              onChange={(e) => {
                handleCsvFile(e);
                setSentFile(true);
              }}
            />
            <div className="d-flex flex-row mt-2">
              <button
                className="btn btn-success me-2"
                onClick={() => sendInMsgFile(text, email)}
              >
                Send inn melding og fil
              </button>
              <button
                className="btn btn-info"
                onClick={() => sendInMessage(text, email)}
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
