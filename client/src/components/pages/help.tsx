import React from "react";
import { Accordion, Card, Container } from "react-bootstrap";
import { ContactForm } from "../contactForm";

let qaPairs = [
  [
    "Wie funktioniert das Spiel nochmal?",
    "Du bekommst in deinem Team täglich 12 bis 14 Missionen zur Auswahl. Diese siehst du, wenn du vom Hauptmenü auf den Pfeil am rechten Bildschirmrand klickst. Du kannst zwei davon am Tag ausführen und abgeben, indem du im Missionsmenü die jeweilige Karte auswählst und den Button „Mission abschließen“ drückst. Je mehr Punkte ihr im Team macht, desto schneller baut ihr die Parallelwelt namens edrE auf. Wenn ihr diese Welt vollständig aufgebaut habt, könnt ihr helfen, das Leben dort noch lebenswerter zu machen. Wie weit du in deinem Team im Vergleich zu den anderen Teams bist, kannst du vom Hauptmenü aus mit einem Klick auf den Pfeil am linken Bildschirmrand sehen. Dort werden auch alle abgeschlossenen Missionen anonym veröffentlicht.\nMit einem Klick auf den Pfeil am oberen Bildschirmrand kannst du den Fortschritt deines Teams auf der edrE sehen. Der Pfeil am unteren Bildschirmrand öffnet den Teamchat, in dem du dich mit deinen Teamkolleg:innen austauschen kannst.",
  ],
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
  [
    "Awareness – Für ein friedvolles Miteinander",
    "Awareness richtet sich gegen Diskriminierung, Gewalt und persönliche Grenzverletzung. Awareness bedeutet Bewusstsein und Sensibilität für meine Mitmenschen.\nFrei von Vorurteilen und Diskriminierungen ist keine*r, auch wenn es nicht beabsichtigt sind. \nDie Wirkung zählt jedoch, und nicht die Absicht.\nJede*r hat eine persönliche Grenze und Gründe dafür. Du musst die Gründe nicht kennen, um die Grenze zu akzeptieren. Du weißt nicht, was andere Menschen bereits erlebt haben und wie sie mit ihren Erfahrungen umgehen (können) und es geht dich auch nichts an, wenn die Person es dir nicht aus freien Stücken erzählt. Mache dir bewusst, dass auch du eine Person bist, die aus verschiedenen Gründen das Ziel von Diskriminierung sein oder werden kann, wenn andere Personen deine persönliche Grenze nicht akzeptieren. \nUm ein friedliches Miteinander zu gewährleisten, machen wir uns gegenseitig respektvoll auf Grenzverletzungen aufmerksam. Wir reagieren früh, um unangenehme Situationen zu verhindern und die persönlichen Grenzen von allen zu schützen.\nSolltest du, ob aus erster oder zweiter Hand, Zeug*in eines unangemessenen Inhalts, einer Diskriminierung, von Gewalt oder persönlicher Grenzverletzung werden, die unmittelbar oder indirekt mit mission:future zusammenhängt, nimm bitte in einem ersten Schritt über das untenstehende Formular Kontakt mit der Spielleitung auf. Wir melden uns umgehend bei dir, um zu besprechen, wie wir gemeinsam reagieren können. ",
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
