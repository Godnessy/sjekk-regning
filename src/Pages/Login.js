import { React, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Card, Alert, Container } from "react-bootstrap";
import { useAuth, currentUser } from "../context/AuthContext";

function Login() {
  const emailref = useRef();
  const passwordref = useRef();
  const passwordConfirmRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await login(emailref.current.value, passwordref.current.value);
      navigate("/home");
    } catch (error) {
      setError(
        "Feil konto navn / passord, prøv på nytt, eller klikk på Glemt passord for å tilbakestille det."
      );
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
            <h2 className="text-center mb-4">Logg inn</h2>
            {error && <Alert variant="danger"> {error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group id="email">
                <Form.Label>E-postadresse</Form.Label>
                <Form.Control type="email" ref={emailref} required />
              </Form.Group>
              <Form.Group id="password">
                <Form.Label>Passord</Form.Label>
                <Form.Control type="password" ref={passwordref} required />
              </Form.Group>
              <Button type="submit" className="w-100 mt-2" disabled={loading}>
                Logg inn
              </Button>
            </Form>
            <div className="w100 text-center mt-3">
              <Link to="/forgot-password">Glemt passord?</Link>
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

export default Login;
