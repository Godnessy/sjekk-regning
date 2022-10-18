import { React, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Card, Alert, Container } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";

function ForgotPassword() {
  const emailref = useRef();
  const { resetPassword } = useAuth();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      setMessage("");
      await resetPassword(emailref.current.value);
      setMessage("Vi har sendt deg en e-post dersom du har en konto!");
    } catch (error) {
      setError(
        "Denne e-postadressen eksisterer ikke, prøv igjen eller opprett en ny konto."
      );
      console.log(error.message);
    }
    setLoading(false);
  }

  return (
    <>
      <Container
        className="align-items-center mb-3 my-3 justify-content-center"
        style={{ minHeight: "100vh" }}
      >
        <Card className="align-items-center" style={{ maxWidth: "60vh" }}>
          <Card.Body>
            <h2 className="text-center mb-4">Reset Passord</h2>
            {error && <Alert variant="danger"> {error}</Alert>}
            {message && <Alert variant="success"> {message}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group id="email">
                <Form.Label>E-postadresse</Form.Label>
                <Form.Control type="email" ref={emailref} required />
              </Form.Group>
              <Button type="submit" className="w-100 mt-2" disabled={loading}>
                Reset passord!
              </Button>
            </Form>
            <div className="w100 text-center mt-3">
              <Link to="/">Logg in</Link>
            </div>
          </Card.Body>
          <hr />
          <div>
            <div className="w100 text-center">
              Har du ikke en konto?
              <Link to="/signup"> Opprette ny konto</Link>
            </div>
          </div>
          <div className="signup-form"></div>
        </Card>
      </Container>
    </>
  );
}

export default ForgotPassword;
