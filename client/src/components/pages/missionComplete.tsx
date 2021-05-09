import React, { useRef } from "react";
import { useParams } from "react-router-dom";
import { Button, Container, Form } from "react-bootstrap";
import { IMission } from "./missions";

export function MissionComplete() {
  const { mission } = useParams<{ mission: string }>();

  const missionData: IMission = JSON.parse(decodeURI(atob(mission)));

  const feedbackRef = useRef<HTMLTextAreaElement>();
  const commentRef = useRef<HTMLTextAreaElement>();

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
      <Form.Group controlId="formGroupFeedback">
        <Form.Label>
          Beschreibe in 2 Sätzen kurz und knapp deine persönliche Umsetzung der
          Mission:
        </Form.Label>
        <Form.Control as="textarea" rows={3} ref={feedbackRef} />
      </Form.Group>
      <Form.Group controlId="formGroupJoy">
        <Form.Label>
          Auf einer Skala von 1 bis 5, wie viel Spaß hat dir die Mission
          gemacht?
        </Form.Label>
        <Form.Check
          type="radio"
          id="5"
          label="5 Sehr viel"
          name="formLabelJoy"
        />
        <Form.Check type="radio" id="4" label="4 Viel" name="formLabelJoy" />
        <Form.Check type="radio" id="3" label="3 Geht so" name="formLabelJoy" />
        <Form.Check type="radio" id="2" label="2 Wenig" name="formLabelJoy" />
        <Form.Check
          type="radio"
          id="1"
          label="1 Gar keinen"
          name="formLabelJoy"
        />
      </Form.Group>
      <Form.Group controlId="formGroupImportance">
        <Form.Label>
          Auf einer Skala von 1 bis 5, als wie wichtig hast du die Mission für
          dich empfunden?
        </Form.Label>
        <Form.Check
          type="radio"
          id="5"
          label="5 Sehr"
          name="formLabelImportance"
        />
        <Form.Check
          type="radio"
          id="4"
          label="4 Mehr"
          name="formLabelImportance"
        />
        <Form.Check
          type="radio"
          id="3"
          label="3 Geht so"
          name="formLabelImportance"
        />
        <Form.Check
          type="radio"
          id="2"
          label="2 Weniger"
          name="formLabelImportance"
        />
        <Form.Check
          type="radio"
          id="1"
          label="1 Gar nicht"
          name="formLabelImportance"
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
        <Form.Check
          type="radio"
          id="5"
          label="5 Sehr häufig"
          name="formLabelFreq"
        />
        <Form.Check type="radio" id="4" label="4 Oft" name="formLabelFreq" />
        <Form.Check
          type="radio"
          id="3"
          label="3 Manchmal"
          name="formLabelFreq"
        />
        <Form.Check type="radio" id="2" label="2 Selten" name="formLabelFreq" />
        <Form.Check type="radio" id="1" label="1 Nie" name="formLabelFreq" />
      </Form.Group>
      <Form.Group controlId="formGroupComments">
        <Form.Label>
          Als Letztes hast du noch die Option, einen Kommentar zu schreiben. Das
          ist freiwillig, du kannst das Feld also auch überspringen.
        </Form.Label>
        <Form.Control as="textarea" rows={3} ref={commentRef} />
      </Form.Group>
      <Button>Raumfahrt beschleunigen 🠒 </Button>
    </Container>
  );
}
