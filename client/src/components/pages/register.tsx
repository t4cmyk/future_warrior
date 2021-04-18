import React, { useRef, useState } from "react";
import { Alert, Button, Container, Form, Spinner } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { authenticateByJWT } from "../../core/authentication";

function RegisterError(props: { errorMsg: string[]; onClose: () => any }) {
  if (props.errorMsg.length <= 0) return <></>;
  return (
    <Alert variant="danger" onClose={props.onClose} dismissible>
      <Alert.Heading>Registrierung fehlgeschlagen</Alert.Heading>
      <ul>
        {props.errorMsg.map((msg, idx) => (
          <li key={idx}>{msg}</li>
        ))}
      </ul>
    </Alert>
  );
}

export function Register() {
  const nameRef = useRef<HTMLInputElement>();
  const mailRef = useRef<HTMLInputElement>();
  const passwordRef = useRef<HTMLInputElement>();
  const confirmPasswordRef = useRef<HTMLInputElement>();
  const plzRef = useRef<HTMLInputElement>();

  let history = useHistory();
  const [canSubmit, setCanSubmit] = useState(false);
  const [submitInProgress, setInProgress] = useState(false);
  const [submitError, setSumbitError] = useState<string[]>([]);

  const onSubmit = async () => {
    setInProgress(true);
    const request: RequestInit = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: nameRef.current.value,
        password: passwordRef.current.value,
        mail: mailRef.current.value,
        plz: plzRef.current.value,
      }),
    };
    try {
      const resp = await fetch("/register", request);
      const respData = await resp.json();
      if (resp.ok) {
        authenticateByJWT(respData.token);
        history.push("/Main");
      } else {
        setSumbitError(respData);
      }
    } catch (e) {
      setSumbitError([e.toString()]);
    }
    setInProgress(false);
  };

  const onChange = () => {
    const canSubmit = () => {
      if (!nameRef.current.validity.valid) return false;
      if (!mailRef.current.validity.valid) return false;
      if (!plzRef.current.validity.valid) return false;
      if (!passwordRef.current.validity.valid) return false;
      if (!confirmPasswordRef.current.validity.valid) return false;
      if (passwordRef.current.value !== confirmPasswordRef.current.value)
        return false;
      return true;
    };
    setCanSubmit(canSubmit());
  };

  return (
    <>
      <Container>
        <h1>Account erstellen</h1>
        <br />
        <RegisterError
          errorMsg={submitError}
          onClose={() => setSumbitError([])}
        />
        <Form.Group controlId="formGroupNickname">
          <Form.Label>Nickname</Form.Label>
          <Form.Control
            placeholder="Nickname"
            onChange={onChange}
            ref={nameRef}
          />
        </Form.Group>
        <Form.Group controlId="formGroupEmail">
          <Form.Label>E-Mail</Form.Label>
          <Form.Control
            type="email"
            placeholder="E-Mail"
            onChange={onChange}
            ref={mailRef}
          />
        </Form.Group>
        <Form.Group controlId="formGroupPassword">
          <Form.Label>Passwort</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            onChange={onChange}
            ref={passwordRef}
          />
        </Form.Group>
        <Form.Group controlId="formGroupPasswordRepeat">
          <Form.Label>Passwort wiederholen</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            onChange={onChange}
            ref={confirmPasswordRef}
          />
        </Form.Group>
        <Form.Group controlId="formGroupPLZ">
          <Form.Label>Postleitzahl</Form.Label>
          <br />
          <span className="font-weight-lighter">
            deine PLZ brauchen wir, um dich sinnvoll einem Team zuordnen zu
            können. Falls ihr Aufgaben zusammen erledigen wollt, müsst ihr die
            Möglichkeit haben, euch einfach und bequem treffen zu können
          </span>
          <Form.Control placeholder="PLZ" onChange={onChange} ref={plzRef} />
        </Form.Group>{" "}
        <Button onClick={onSubmit} disabled={!canSubmit || submitInProgress}>
          {submitInProgress ? <Spinner animation="border" /> : "Registrieren"}
        </Button>
      </Container>
    </>
  );
}
