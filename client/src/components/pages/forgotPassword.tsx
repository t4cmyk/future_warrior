import React, { useRef, useState } from "react";
import { Alert, Button, Container, Form, Spinner } from "react-bootstrap";
import { useHistory } from "react-router-dom";

function ContactSuccess(props: { success: boolean; onClose: () => any }) {
  if (!props.success) return <></>;
  return (
    <Alert variant="success" onClose={props.onClose} dismissible>
      <Alert.Heading>
        Erfolg! Die Passwortwiederherstellungsmail sollte in Kürze versendet
        werden.
        <br />
        Falls es nicht funktioniert, hast du möglicherweise die falsche
        E-mailadresse eingegeben. Bitte kontaktiere uns über das
        Kontaktformular, falls du weiterhin Probleme haben solltest.
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

export function ForgotPassword() {
  const mailRef = useRef<HTMLInputElement>();

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
        mail: mailRef.current.value,
      }),
    };
    try {
      const resp = await fetch("/forgotPassword", request);
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
      if (!mailRef.current.validity.valid) return false;
      return true;
    };
    setCanSubmit(canSubmit());
  };

  return (
    <>
      <Container>
        <h1>Passwort Vergessen</h1>
        Gib bitte hier deine Emailadresse, mit der du dich registriert hast, an.
        Dann wird dir eine E-Mail geschickt mit der du dein Passwort ändern
        kannst.
        <br />
        <ContactSuccess
          success={submitSuccess}
          onClose={() => setSubmitSuccess(false)}
        />
        <ContactError
          errorMsg={submitError}
          onClose={() => setSumbitError([])}
        />
        <Form.Group controlId="formGroupEmail">
          <Form.Label>E-Mail</Form.Label>
          <Form.Control
            type="email"
            placeholder="E-Mail"
            onChange={onChange}
            ref={mailRef}
          />
        </Form.Group>
        <br />
        <br />
        <Button onClick={onSubmit} disabled={!canSubmit || submitInProgress}>
          {submitInProgress ? (
            <Spinner animation="border" />
          ) : (
            "Passwordwiederherstellungsmail Senden"
          )}
        </Button>
      </Container>
    </>
  );
}
