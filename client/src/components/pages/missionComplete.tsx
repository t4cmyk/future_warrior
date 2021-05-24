import React, { ChangeEvent, useRef, useState } from "react";
import { Redirect, useHistory, useParams } from "react-router-dom";
import { Button, Container, Form } from "react-bootstrap";
import { IMission, useMissionData } from "../missionCard";
import { getToken } from "../../core/authentication";
import { IDailyMissionData } from "./missions";

export function MissionComplete() {
  const { mission } = useParams<{ mission: string }>();
  const missionTxt = sessionStorage.getItem(`daily/${mission}`);
  if (!missionTxt) return <Redirect to="/Missions/" />;
  const dailyData: IDailyMissionData = JSON.parse(missionTxt);
  const missionData = useMissionData(dailyData.mission);

  return (
    <Container>
      <h1>Mission abschließen</h1>
      <br />
      Herzlichen Glückwunsch! Du hast die Mission "{missionData.name}" erledigt.
      Nachfolgend wären noch ein paar Fragen für das Raumfahrtprotokoll wichtig.
      Das dauert nicht lange und hilft allen Raumfahrer*innen, sich ein Bild von
      deiner persönlichen Mission zu machen, um sich inspirieren zu lassen, sich
      selbst für diese Mission zu motivieren oder die Mission
      weiterzuentwickeln. Letztlich hilft das vor allem Utopia und der
      zukünftigen Gesellschaft dort, die von eurem Erfahrungsreichtum der „alten
      Welt“ profitiert.
      <br />
      <MissionCompleteFeedback mission={dailyData} />;
    </Container>
  );
}

function FeedbackRating(props: {
  name: string;
  options: string[];
  selectedIndex: number;
  onSelect: (idx: number) => any;
}) {
  const onChange = (changeEvent: ChangeEvent<HTMLInputElement>) => {
    props.onSelect(parseInt(changeEvent.target.id));
  };

  return (
    <>
      {props.options.map((val, idx) => (
        <Form.Check
          type="radio"
          key={idx}
          id={idx.toString()}
          label={val}
          checked={props.selectedIndex == idx}
          onChange={onChange}
          name={props.name}
        />
      ))}
    </>
  );
}

function MissionCompleteFeedback(props: { mission: IDailyMissionData }) {
  const feedbackRef = useRef<HTMLTextAreaElement>();
  const commentRef = useRef<HTMLTextAreaElement>();

  const [enjoy, setEnjoy] = useState(-1);
  const enjoyLabels = [
    "5 Sehr viel",
    "4 Viel",
    "3 Geht so",
    "2 Wenig",
    "1 Gar keinen",
  ];
  const [importance, setImportance] = useState(-1);
  const importanceLabels = [
    "5 Sehr",
    "4 Mehr",
    "3 Geht so",
    "2 Weniger",
    "1 Gar nicht",
  ];
  const [frequency, setFrequency] = useState(-1);
  const frequencyLabels = [
    "5 Sehr häufig",
    "4 Oft",
    "3 Manchmal",
    "2 Selten",
    "1 Nie",
  ];

  const history = useHistory();

  const onSubmit = () => {
    const submit = async () => {
      try {
        const request: RequestInit = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            enjoy: 5 - enjoy,
            importance: 5 - importance,
            feedback: feedbackRef.current.value,
            frequency: 5 - frequency,
            comment: commentRef.current.value,
          }),
        };
        const resp = await fetch(
          `/complete?mission=${props.mission.id}&token=${getToken()}`,
          request
        );
        return resp.ok;
      } catch (e) {
        console.log(e);
      }
      return false;
    };
    submit().then((ok) => history.push("/Missions/"));
  };

  return (
    <>
      <Form.Group controlId="formGroupJoy">
        <Form.Label>
          Auf einer Skala von 1 bis 5, wie viel Spaß hat dir die Mission
          gemacht?
        </Form.Label>
        <FeedbackRating
          name="formLabelJoy"
          options={enjoyLabels}
          selectedIndex={enjoy}
          onSelect={setEnjoy}
        />
      </Form.Group>
      <Form.Group controlId="formGroupImportance">
        <Form.Label>
          Auf einer Skala von 1 bis 5, als wie wichtig hast du die Mission für
          dich empfunden?
        </Form.Label>
        <FeedbackRating
          name="formLabelImportance"
          options={importanceLabels}
          selectedIndex={importance}
          onSelect={setImportance}
        />
      </Form.Group>
      <Form.Group controlId="formGroupFeedback">
        <Form.Label>
          Beschreibe in 2 Sätzen kurz und knapp deine persönliche Umsetzung der
          Mission:
        </Form.Label>
        <Form.Control as="textarea" rows={3} ref={feedbackRef} />
      </Form.Group>
      <Form.Group controlId="formGroupFreq">
        <Form.Label>
          Kannst du dir vorstellen, diese Mission ab jetzt öfter zu machen?
        </Form.Label>
        <FeedbackRating
          name="formLabelFrquency"
          options={frequencyLabels}
          selectedIndex={frequency}
          onSelect={setFrequency}
        />
      </Form.Group>
      <Form.Group controlId="formGroupComments">
        <Form.Label>
          Als Letztes hast du noch die Option, einen Kommentar zu schreiben. Das
          ist freiwillig, du kannst das Feld also auch überspringen.
        </Form.Label>
        <Form.Control as="textarea" rows={3} ref={commentRef} />
      </Form.Group>
      <Button onClick={onSubmit}>Raumfahrt beschleunigen 🠒 </Button>
    </>
  );
}
