import React, { useRef, useState } from "react";
import { Alert, Button, Container, Form, Spinner } from "react-bootstrap";
import { useHistory } from "react-router-dom";

function ContactSuccess(props: { success: boolean; onClose: () => any }) {
  if (!props.success) return <></>;
  return (
    <Alert variant="success" onClose={props.onClose} dismissible>
      <Alert.Heading>Nachricht wurde erfolgreich gesendet</Alert.Heading>
    </Alert>
  );
}

function ContactError(props: { errorMsg: string[]; onClose: () => any }) {
  if (props.errorMsg.length <= 0) return <></>;
  return (
    <Alert variant="danger" onClose={props.onClose} dismissible>
      <Alert.Heading>Nachricht konnte nicht abgesendet werden</Alert.Heading>
      <ul>
        {props.errorMsg.map((msg, idx) => (
          <li key={idx}>{msg}</li>
        ))}
      </ul>
    </Alert>
  );
}

export function ContactForm() {
  const nameRef = useRef<HTMLInputElement>();
  const mailRef = useRef<HTMLInputElement>();
  const subjectRef = useRef<HTMLInputElement>();
  const messageRef = useRef<HTMLInputElement>();
  const privacyRef = useRef<HTMLInputElement>();

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
        name: nameRef.current.value,
        subject: subjectRef.current.value,
        mail: mailRef.current.value,
        message: messageRef.current.value,
      }),
    };
    try {
      const resp = await fetch("/contactForm", request);
      const respData = await resp.json();
      if (resp.ok) {
        setSubmitSuccess(true);
        alert("Nachricht wurde erfolgreich gesendet!");
        /**  authenticateByJWT(respData.token);
        history.push("/Main");*/
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
      if (!privacyRef.current.checked) return false;
      if (!subjectRef.current.validity.valid) return false;
      if (!messageRef.current.validity.valid) return false;
      return true;
    };
    setCanSubmit(canSubmit());
  };

  return (
    <>
      <Container>
        <h1>Kontaktformular</h1>
        <br />
        <ContactSuccess
        success={submitSuccess}
        onClose={() => setSubmitSuccess(false)} />
        <ContactError
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
        <Form.Group controlId="formGroupSubject">
          <Form.Label>Betreff</Form.Label>
          <Form.Control
            type="subject"
            placeholder="Betreff"
            onChange={onChange}
            ref={subjectRef}
          />
        </Form.Group>
        <Form.Group controlId="formMessage">
          <Form.Label>Persönliche Nachricht</Form.Label>
          <Form.Control
            type="textarea"
            placeholder="persönliche Nachricht"
            onChange={onChange}
            ref={messageRef}
          />
        </Form.Group>
        <input type="checkbox" ref={privacyRef} onChange={onChange}></input>
        Ich akzeptiere die Datenschutzbedingungen
        <br />
        <br />
        <Button onClick={onSubmit} disabled={!canSubmit || submitInProgress}>
          {submitInProgress ? <Spinner animation="border" /> : "Senden"}
        </Button>
      </Container>
    </>
  );
}
