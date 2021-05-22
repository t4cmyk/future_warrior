import React, { useRef, useState } from "react";
import { Alert, Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

function acceptCookies() {
  localStorage.setItem("cookiesAccepted", "true");
}

function areCookiesAccepted() {
  const acceptance = localStorage.getItem("cookiesAccepted");
  let a = acceptance || "";
  if (a.length > 0) return true;
}

export function CookieBanner() {
  const [show, setShow] = useState(true);
  if (areCookiesAccepted()) {
    return <></>;
  } else
    return (
      <>
        <Container className="fixed-bottom"  >
          <Alert width="max-content"
            show={show}
            variant="warning"
            onClose={() => {
                acceptCookies();
                setShow(false);
              }}
            dismissible
          >
            <Alert.Heading></Alert.Heading>
            
              Diese Website benutzt Cookies. Wenn Sie die Website weiter nutzen,
              gehen wir von Ihrem Einverständnis aus.
            
            <div className="d-flex justify-content-end"><Button
              onClick={() => {
                acceptCookies();
                setShow(false);
              }}
            >
              OK
            </Button>{" "}
            {"  "}
            <Link to="/Privacy">
              <Button variant="secondary">Datenschutzerklärung</Button>
            </Link></div>
            
          </Alert>
        </Container>
      </>
    );
}
