import React from "react";
import { Accordion, Button, Card } from "react-bootstrap";

export function Help() {
  return (
    <>
      <h1>Hilfe</h1>
      <br />
      <Accordion defaultActiveKey="0">
        <Card>
          <Accordion.Toggle as={Card.Header} eventKey="0">
            Was mache ich, wenn ich unangemessene Kommentare im Chat melden
            will?
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="0">
            <Card.Body>Melde es.</Card.Body>
          </Accordion.Collapse>
        </Card>
        <Card>
          <Accordion.Toggle as={Card.Header} eventKey="1">
            Was kann ich tun, wenn ich mich angegriffen fühle?
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="1">
            <Card.Body>Melde es.</Card.Body>
          </Accordion.Collapse>
        </Card>
        <Card>
          <Accordion.Toggle as={Card.Header} eventKey="2">
            Was kann ich tun, wenn ich ein Problem mit meinen Teammitgliedern
            habe?
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="2">
            <Card.Body>Melde es.</Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </>
  );
}
