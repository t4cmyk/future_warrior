import React from "react";
import { logoutPlayer } from "../core/authentication";
import { useLoginState } from "./hooks/loginState";

export function AccountMenu(props: {}) {
  const loginState = useLoginState();

  if (!loginState) return <></>;

  return (
    <div className="justify-content-end col-12 d-flex">
      Angemeldet als {loginState.username}{" "}
      <span onClick={logoutPlayer}> (ausloggen)</span>
    </div>
  );
}
