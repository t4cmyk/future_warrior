import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export function Verify() {
  const message = useRef<HTMLHeadingElement>(null);
  const search = useLocation().search;
  let token = new URLSearchParams(search).get("token");
  const request: RequestInit = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      token: token,
    }),
  };

  useEffect(() => {
    const resultHandler = { onFetch: () => {} };
    const sendVerification = async () => {
      try {
        const resp = await fetch("/verify", request);
        if (resp.ok)
          message.current.innerText =
            "Deine E-mailadresse wurde erfolgreich bestätigt. Du kannst dieses Seite nun schließen.";
        else message.current.innerText = "Dieser Link ist fehlerhaft.";
      } catch (e) {
        message.current.innerText = "Hier ist etwas schief gelaufen :(";
        console.log(e);
      }
      return;
    };
    sendVerification().then((result) => resultHandler.onFetch());
    return () => {};
  }, []);

  return (
    <>
      <h1 ref={message}></h1>
    </>
  );
}
