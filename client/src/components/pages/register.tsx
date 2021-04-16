import React, { useRef, useState } from "react";

export function Register() {
  const nameRef = useRef<HTMLInputElement>();
  const mailRef = useRef<HTMLInputElement>();
  const passwordRef = useRef<HTMLInputElement>();
  const confirmPasswordRef = useRef<HTMLInputElement>();
  const plzRef = useRef<HTMLInputElement>();

  const [canSubmit, setCanSubmit] = useState(false);
  const [submitError, setSumbitError] = useState("");

  const onSubmit = async () => {
    const request: RequestInit = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: nameRef.current.value,
        password: passwordRef.current.value,
        mail: mailRef.current.value,
        plz: plzRef.current.value,
      }),
    };
    const resp = await fetch("/register", request);
    if (resp.ok) {
    }
  };

  const onChange = () => {
    const canSubmit = () => {
      if (!nameRef.current.validity.valid) return false;
      if (!mailRef.current.validity.valid) return false;
      if (!plzRef.current.validity.valid) return false;
      if (!passwordRef.current.validity.valid) return false;
      if (!confirmPasswordRef.current.validity.valid) return false;
      return true;
    };
    setCanSubmit(canSubmit());
  };

  return (
    <>
      <h1>Future Warrior - Performativ in die Zukunft</h1>
      <br />
      <p>
        <label htmlFor="name">Nickname</label>
        <input
          id="name"
          ref={nameRef}
          onChange={onChange}
          minLength={4}
          maxLength={12}
          pattern="^\w{4,12}$"
          required
        ></input>
      </p>
      <p>
        <label htmlFor="email">E-Mail</label>
        <input
          id="email"
          ref={mailRef}
          onChange={onChange}
          type="email"
          required
        ></input>
      </p>
      <p>
        <label htmlFor="password">Passwort</label>
        <input
          id="password"
          ref={passwordRef}
          onChange={onChange}
          type="password"
          minLength={6}
          required
        ></input>
      </p>
      <p>
        <label htmlFor="password2">Passwort wiederholen</label>
        <input
          id="password2"
          ref={confirmPasswordRef}
          onChange={onChange}
          type="password"
          minLength={6}
          required
        ></input>
      </p>
      <p>
        <label htmlFor="plz">Postleitzahl</label>
        (deine PLZ brauchen wir, um dich sinnvoll einem Team zuordnen zu können.
        Falls ihr Aufgaben zusammen erledigen wollt, müsst ihr die Möglichkeit
        haben, euch einfach und bequem treffen zu können)
        <br />
        <input
          id="plz"
          ref={plzRef}
          onChange={onChange}
          minLength={5}
          maxLength={5}
          required
        ></input>
      </p>{" "}
      <button onClick={onSubmit} disabled={!canSubmit}>
        Registrieren
      </button>
    </>
  );
}
