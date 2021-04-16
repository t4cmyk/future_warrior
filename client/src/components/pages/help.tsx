import React from "react";
import { Accordion, Card, Container } from "react-bootstrap";

let qaPairs = [
  ["Frage 1", "Antwort 1"],
  ["Frage 2", "Antwort 2"],
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
    <Container>
      <Accordion defaultActiveKey="0">{h}</Accordion>
    </Container>
  );
}

export function Help() {
  return buildFAQ();
}
