import React, { useRef } from "react";

export function Register() {
  const nameRef = useRef<HTMLInputElement>();
  const mailRef = useRef<HTMLInputElement>();
  const passwordRef = useRef<HTMLInputElement>();
  const plzRef = useRef<HTMLInputElement>();

  const onSubmit = () => {};

  return (
    <>
      <h1>Future Warrior - Performativ in die Zukunft</h1>
      <br />
      Nickname
      <br />
      <input ref={nameRef}></input>
      <br />
      Emailadresse
      <br />
      <input ref={mailRef}></input>
      <br />
      Passwort
      <br />
      <input ref={passwordRef}></input>
      <br />
      Passwort wiederholen
      <br />
      <input></input>
      <br />
      Postleitzahl
      <br />
      (deine PLZ brauchen wir, um dich sinnvoll einem Team zuordnen zu können.
      Falls ihr Aufgaben zusammen erledigen wollt, müsst ihr die Möglichkeit
      haben, euch einfach und bequem treffen zu können)
      <br />
      <input ref={plzRef}></input>
      <br />
      <button>Registrieren</button>
    </>
  );
}
