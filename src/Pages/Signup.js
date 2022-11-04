import { React, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Card, Alert, Container } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
function Signup() {
  const emailref = useRef();
  const passwordref = useRef();
  const passwordConfirmRef = useRef();
  const { signup } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (passwordref.current.value !== passwordConfirmRef.current.value) {
      return setError("e-post og bekreft e-post adresser er ikke identiske");
    }
    try {
      setError("");
      setLoading(true);
      await signup(emailref.current.value, passwordref.current.value);
      navigate("/home");
    } catch (error) {
      setError("Failed to Create an account" + error.message);
    }
    setLoading(false);
  }

  return (
    <>
      <Container
        className="align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}
      >
        <Card className="align-items-center" style={{ maxWidth: "60vh" }}>
          <Card.Body>
            <h2 className="text-center mb-4">Registrering</h2>
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
              <Form.Group id="password-confirm">
                <Form.Label>Bekreft passord</Form.Label>
                <Form.Control
                  type="password"
                  ref={passwordConfirmRef}
                  required
                />
              </Form.Group>
              <Button type="submit" className="w-100 mt-2" disabled={loading}>
                Registrer meg som ny bruker
              </Button>
            </Form>
          </Card.Body>
          <hr />
          <div>
            <h6 className="w100 text-center mt-2">
              Allerede har en konto?
              <Link to="/"> Logge inn</Link>
            </h6>
          </div>
          <div className="signup-form"></div>
        </Card>
      </Container>
    </>
  );
}

export default Signup;
