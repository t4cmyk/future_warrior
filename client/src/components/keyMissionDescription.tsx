import React, { useEffect, useState } from "react";
import { Accordion, Card, Container } from "react-bootstrap";
import { getToken } from "../core/authentication";

export function KeyMissionDescription() {
  const [keyMissionStatus, setkeyMissionStatus] = useState<Boolean>(false);
  useEffect(() => {
    const resultHandler = { onFetch: setkeyMissionStatus };
    const fetchKeyMissionStatus = async () => {
      try {
        const resp = await fetch(`/keyMission?token=${getToken()}`);
        const respData = (await resp.json()) as Boolean;
        setkeyMissionStatus(respData);
        return respData;
      } catch (e) {
        console.log(e);
      }
      return;
    };
    fetchKeyMissionStatus().then((result) => resultHandler.onFetch(result));
    return () => {
      resultHandler.onFetch = (_: any) => {};
    };
  }, []);

  return (
    <>
      {keyMissionStatus ? (
        <></>
      ) : (
        <Container>
          <Accordion defaultActiveKey="0">
            <Card>
              <Accordion.Toggle as={Card.Header} eventKey={"1"}>
                Schlüsselmission - Beschreibung
              </Accordion.Toggle>
              <Accordion.Collapse eventKey={"1"}>
                <Card.Body>
                  <>
                    Das ist eure gemeinsame Team-Mission, die ihr absolvieren
                    müsst, um das letzte Level abzuschließen und vollständigen
                    Anspruch auf eure erschaffene edrE erheben zu können. Ihr
                    habt dafür die vollen 14 Tage Zeit. Eine:r von euch kann die
                    Mission zu jeder Zeit abschließen, damit ihr euren Schlüssel
                    zum Erfolg erhaltet. Buchstäblich.
                    <br />
                    Diese Mission bringt deinem Team 20 Punkte. Wenn ihr
                    Dokumentationsmaterial haben solltet (Fotos, Skizzen etc.),
                    schickt dieses bitte an dis-positiv@posteo.de. Das würde
                    mich sehr freuen!
                    <br />
                    Ihr habt die Möglichkeit, euch über den Chat auszutauschen.
                    <br />
                    <br />
                    Schritt 1: Wählt gemeinsam ein gesellschaftlich (auch sozial
                    und/oder politisch) relevantes Thema in Bezug auf
                    ökologische Nachhaltigkeit.
                    <br />
                    <br />
                    Schritt 2: Findet gemeinsam ein für alle passendes Bild, wie
                    in der Gesellschaft derzeit mit diesem Thema umgegangen
                    wird. Beschreibt so präzise wie möglich eure Gedanken. Ihr
                    könnt auch externe Links teilen.
                    <br />
                    <br />
                    Schritt 3: Wenn ihr euch auf ein Ist-Bild geeinigt habt,
                    kreiert im nächsten Schritt ein für alle passendes Bild, wie
                    ein eurer Meinung nach wünschenswerter (vielleicht sogar
                    utopischer) Umgang mit dem Thema aussehen könnte. Beschreibt
                    so präzise wie möglich eure Gedanken. Ihr könnt auch externe
                    Links teilen.
                    <br />
                    <br />
                    Schritt 4: Wenn ihr euch auf die beiden Bilder geeinigt
                    habt, überlegt euch gemeinsam eine Handlung im Jetzt, die
                    einen ersten Schritt in die Richtung eures Soll-Bilds
                    anstoßen kann. Ihr könnt durch eure Handlung ein Nachdenken
                    bei euren Mitmenschen anregen. Bereitet diese Handlung vor
                    und führt sie an einem öffentlichen Ort (egal ob analog oder
                    digital) aus. Öffentlich heißt, dass es theoretisch euch
                    fremde Menschen geben kann, die eure Handlung beobachten und
                    auch an ihr teilnehmen können. Oberstes Gebot: Es darf keine
                    Gewalt angewandt werden! Sollte dies ungeplanter Weise doch
                    passieren oder eure Handlung wie auch immer in eine Richtung
                    eskalieren, die ihr nicht möchtet, löst die Situation
                    selbständig auf, indem ihr euch von der Handlung distanziert
                    und sie als Teil eines Spiels offenlegt.
                    <br />
                    <br />
                    Beispiel 1 (im analogen Raum):
                    <br />
                    Ein:e von euch gemimte Person of Colour sitzt in der U-Bahn.
                    Eine ebenfalls von euch gemimte weiße Person kommt hinzu und
                    macht der Person of Colour durch rassistische Äußerungen den
                    Sitzplatz streitig. Zwei weitere von euch gemimte Fahrgäste
                    mischen sich in die Diskussion ein und vertreten
                    unterschiedliche Standpunkte. Ihr könntet versuchen, die
                    anderen Fahrgäste, die nicht in eure Handlung eingeweiht
                    sind, in die Diskussion mit einzubeziehen, um ihnen ein
                    Statement mit ihrer persönlichen Meinung zu entlocken und zu
                    Zivilcourage anzuregen. Auch wenn keine anderen Personen
                    aktiv teilnehmen, könnt ihr eure Handlung als Erfolg werten,
                    denn ihr könnt euch sicher sein, dass sie gesehen wurde und
                    sich die Mehrheit der Mitfahrenden Gedanken dazu gemacht
                    haben.
                    <br />
                    <br />
                    Beispiel 2 (im digitalen Raum):
                    <br />
                    Ein von euch gemimter Social Media Account eines
                    homosexuellen Mannes kommentiert einen Beitrag eines
                    bekannten deutschen Nachrichtensenders zur Verweigerung der
                    Segnung homosexueller Paare durch die katholische Kirche:
                    „Schade. Mein Mann und ich würden uns schon seit langem
                    gerne kirchlich trauen lassen.“ Ein weiterer von euch
                    gemimter Account einer heterosexuellen Person kommentiert
                    das mit einem diskriminierenden Hasskommentar. Zwei weitere
                    von euch gemimte Accounts mischen sich in die Diskussion ein
                    und vertreten unterschiedliche Meinungen. Ihr könnt
                    versuchen, durch Bezug auf Kommentare andere Menschen in die
                    Diskussion mit einzubeziehen. Beachtet, dass es in der
                    Anonymität des Internets schneller zu eindeutigen
                    Meinungsäußerungen kommen kann.
                  </>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
        </Container>
      )}
    </>
  );
}
