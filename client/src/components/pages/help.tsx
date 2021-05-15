import React from "react";
import { Accordion, Card, Container } from "react-bootstrap";
import { ContactForm } from "../contactForm";

let qaPairs = [
  [
    "Was kann ich tun, wenn ich eine bereits gespeicherte Eingabe rückgängig machen will?",
    "Nimm über das untenstehende Formular Kontakt mit der Spielleitung auf und wir schauen, was wir in deinem Fall tun können.",
  ],
  [
    "Was mache ich, wenn ich während der Spielphase merke, dass ich aus persönlichen Gründen nicht weiterspielen kann?",
    "In diesem Fall melde dich bitte zuerst über das untenstehende Kontaktformular an die Spielleitung, bevor du dein Team einweihst. Wir besprechen gemeinsam, wie wir einen reibungslosen Übergang gestalten können.",
  ],
  [
    "Was mache ich, wenn ich beobachte, dass eine Person nicht regelkonform spielt?",
    "Verdeutliche dir zuallererst, dass in erster Linie die Person, welche die Regeln verletzt, selbst einen Nachteil davon hat. Diese Person beraubt sich selbst der Erfahrungen, welche sie durch das Spiel erlangen könnte.\n Da im Team gespielt wird, soll natürlich das restliche Team dadurch nicht beeinflusst werden. Daher melde bitte genau, was du beobachten konntest an die Spielleitung. Wir entscheiden ggf. zusammen, was in dem jeweiligen Fall passieren kann und soll. Nutze das untenstehende Kontaktformular, um deine Beobachtungen mitzuteilen.",
  ],
];

function Question(props: {
  question: string;
  answer: string;
  questionNum: number;
}) {
  let numStr = props.questionNum.toString();
  return (
    <Card>
      <Accordion.Toggle as={Card.Header} eventKey={numStr}>
        {props.question}
      </Accordion.Toggle>
      <Accordion.Collapse eventKey={numStr}>
        <Card.Body>{props.answer}</Card.Body>
      </Accordion.Collapse>
    </Card>
  );
}

function buildFAQ() {
  let h: JSX.Element[] = [];
  h.push(<h1>Hilfe</h1>);
  h.push(<br />);
  qaPairs.forEach((pair, index) => {
    h.push(
      <Question
        question={pair[0]}
        answer={pair[1]}
        questionNum={index}
      ></Question>
    );
  });
  return (
    <>
      <Container>
        <Accordion defaultActiveKey="0">{h}</Accordion>
      </Container>
      <br />
      <ContactForm></ContactForm>
    </>
  );
}

export function Help() {
  return buildFAQ();
}
