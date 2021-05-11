import React from "react";
import { Link } from "react-router-dom";
import { logoutPlayer } from "../core/authentication";
import { useLoginState } from "./hooks/loginState";

export function AccountMenu(props: {}) {
  const loginState = useLoginState();

  if (!loginState)
    return (
      <div>
        {`Nicht angemeldet\u00A0`}
        <Link to="/Register">Registrieren</Link>/
        <Link to="/Login">Einloggen</Link>
      </div>
    );

  return (
    <div>
      {`Angemeldet als\u00A0`}
      <span className="text-capitalize">{loginState.username}</span>
      {`\u00A0`}
      <a href="#" onClick={logoutPlayer}>
        (ausloggen)
      </a>
    </div>
  );
}
