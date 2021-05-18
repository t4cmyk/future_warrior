import React, { useRef, useState } from "react";
import { Alert, Button, Container, Form, Spinner } from "react-bootstrap";
import { useHistory, useLocation } from "react-router-dom";

function ContactSuccess(props: { success: boolean; onClose: () => any }) {
  if (!props.success) return <></>;
  return (
    <Alert variant="success" onClose={props.onClose} dismissible>
      <Alert.Heading>
        Dein Passwort wurde erfolgreich geändert.
      </Alert.Heading>
    </Alert>
  );
}

function ContactError(props: { errorMsg: string[]; onClose: () => any }) {
  if (props.errorMsg.length <= 0) return <></>;
  return (
    <Alert variant="danger" onClose={props.onClose} dismissible>
      <Alert.Heading>Es ist ein Fehler aufgetreten.</Alert.Heading>
      <ul>
        {props.errorMsg.map((msg, idx) => (
          <li key={idx}>{msg}</li>
        ))}
      </ul>
    </Alert>
  );
}

export function ChangePassword() {
  const search = useLocation().search;
  let token = new URLSearchParams(search).get('token');

  const passwordRef = useRef<HTMLInputElement>();

  let history = useHistory();
  const [canSubmit, setCanSubmit] = useState(false);
  const [submitInProgress, setInProgress] = useState(false);
  const [submitError, setSumbitError] = useState<string[]>([]);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const onSubmit = async () => {
    setInProgress(true);
    const request: RequestInit = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        password: passwordRef.current.value,
        token: token
        
      }),
    };
    try {
      const resp = await fetch("/changePassword", request);
      const respData = await resp.json();
      if (resp.ok) {
        setSubmitSuccess(true);
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
      if (!passwordRef.current.validity.valid) return false;
      return true;
    };
    setCanSubmit(canSubmit());
  };

  return (
    <>
      <Container>
        <h1>Passwort ändern</h1>
        <ContactSuccess
          success={submitSuccess}
          onClose={() => setSubmitSuccess(false)}
        />
        <ContactError
          errorMsg={submitError}
          onClose={() => setSumbitError([])}
        />
        <Form.Group controlId="formGroupPassword">
          <Form.Label>Neues Passwort:</Form.Label>
          <Form.Control
            type="password"
            placeholder="Passwort"
            onChange={onChange}
            ref={passwordRef}
          />
        </Form.Group>
        <Button onClick={onSubmit} disabled={!canSubmit || submitInProgress}>
          {submitInProgress ? (
            <Spinner animation="border" />
          ) : (
            "Bestätigen"
          )}
        </Button>
      </Container>
    </>
  );
}
