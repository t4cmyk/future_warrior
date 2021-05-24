import React, { useEffect, useState } from "react";
import { Accordion, Card, Container } from "react-bootstrap";

type OnFeedbackUpdatedHandler = (entries: IFeedbackEntry[]) => any;
const onFeedbackListener: OnFeedbackUpdatedHandler[] = [];
function addOnFeedbackListener(handler: OnFeedbackUpdatedHandler) {
  onFeedbackListener.push(handler);
}
function removeOnFeedbackListener(handler: OnFeedbackUpdatedHandler) {
  const idx = onFeedbackListener.indexOf(handler);
  if (idx >= 0) {
    onFeedbackListener[idx] = onFeedbackListener[onFeedbackListener.length - 1];
    onFeedbackListener.pop();
  }
}

interface IFeedbackEntry {
  name: string;
  description: string;
  feedback: string;
  enjoy: number;
  importance: number;
  frequency: number;
  comments: string;
}

function RecentFeedbackEntry(props: { idx: number; entry: IFeedbackEntry }) {
  const numStr = props.idx.toString();
  return (
    <Card>
      <Accordion.Toggle as={Card.Header} eventKey={numStr}>
        {props.entry.name}
      </Accordion.Toggle>
      <Accordion.Collapse eventKey={numStr}>
        <Card.Body>
          Beschreibe in 2 Sätzen kurz und knapp deine persönliche Umsetzung der
          Mission:
          <br />
          {props.entry.feedback}
          <br />
          Auf einer Skala von 1 bis 5, wie viel Spaß hat dir die Mission
          gemacht?
          <br />
          {props.entry.enjoy}
          <br />
          Auf einer Skala von 1 bis 5, als wie wichtig hast du die Mission für
          dich empfunden?
          <br />
          {props.entry.importance}
          <br />
          Kannst du dir vorstellen, diese Mission ab jetzt öfter zu machen?
          <br />
          {props.entry.frequency}
          <br />
          Als Letztes hast du noch die Option, einen Kommentar zu schreiben. Das
          ist freiwillig, du kannst das Feld also auch überspringen
          <br />
          {props.entry.comments}
          <br />
        </Card.Body>
      </Accordion.Collapse>
    </Card>
  );
}

function useFeedbackEntries() {
  const [feedbackEntries, setFeedbackEntries] = useState([]);
  useEffect(() => {
    addOnFeedbackListener(setFeedbackEntries);
    const fetchFeedbackEntries = async () => {
      const resp = await fetch("/feedback");
      const data = await resp.json();
      onFeedbackListener.forEach((callback) => callback(data.feedback));
    };
    fetchFeedbackEntries();
    return () => removeOnFeedbackListener(setFeedbackEntries);
  }, []);

  return feedbackEntries;
}

export function RecentFeedback() {
  const entries = useFeedbackEntries();

  const cards = entries.map((entry, idx) => (
    <RecentFeedbackEntry idx={idx} key={idx} entry={entry} />
  ));
  return (
    <Container>
      <Accordion defaultActiveKey="0">{cards}</Accordion>
    </Container>
  );
}
