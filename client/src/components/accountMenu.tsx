import React from "react";
import { logoutPlayer } from "../core/authentication";
import { useLoginState } from "./hooks/loginState";

export function AccountMenu(props: {}) {
  const loginState = useLoginState();

  if (!loginState)
    return (
      <div>
        {`Nicht angemeldet\u00A0`}
        <a href="#/Register">Registrieren</a>/<a href="#/Login">Einloggen</a>
      </div>
    );

  return (
    <div>
      {`Angemeldet als ${loginState.username}\u00A0`}
      <a href="#" onClick={logoutPlayer}>
        (ausloggen)
      </a>
    </div>
  );
}
