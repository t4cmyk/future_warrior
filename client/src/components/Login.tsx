import React, { useRef, useState } from "react";
import { Alert, Button } from "react-bootstrap";
import Container from "react-bootstrap/esm/Container";
import Form from "react-bootstrap/esm/Form";
import {
  authenticateUser,
  getUsername,
  isLoggedIn,
} from "../core/authentication";

export function Login() {
  const [loginState, setLoginState] = useState(isLoggedIn());
  const [loginError, setLoginError] = useState("");
  const usernameRef = useRef<HTMLInputElement>();
  const passwordRef = useRef<HTMLInputElement>();

  if (loginState) {
    const username = getUsername();
    return <>Logged in as {username}</>;
  }

  const login = async () => {
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;
    try {
      await authenticateUser(username, password);
      setLoginState(true);
    } catch (ex) {
      setLoginState(false);
      setLoginError((ex as Error).message);
    }
  };

  let loginErrorElement = <></>;
  if (loginError.length > 0) {
    loginErrorElement = (
      <>
        <Alert variant="danger" onClose={() => setLoginError("")} dismissible>
          <Alert.Heading>Login fehlgeschlagen</Alert.Heading>
          <p>{loginError}</p>
        </Alert>
      </>
    );
  }

  return (
    <>
      <Container>
        <h1>Future Warrior - Performativ in die Zukunft!</h1>
        {loginErrorElement}
        <Form>
          <Form.Group controlId="formGroupEmail">
            <Form.Label>Nickname</Form.Label>
            <Form.Control
              type="email"
              placeholder="Nickname"
              ref={usernameRef}
            />
          </Form.Group>
          <Form.Group controlId="formGroupPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              ref={passwordRef}
            />
          </Form.Group>
        </Form>
        <Button variant="secondary">Passwort vergessen?</Button>
        <Button onClick={login}>Einloggen</Button>
      </Container>
    </>
  );
}
