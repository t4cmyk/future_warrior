import React from "react";
import { useLoginState } from "./hooks/loginState";

export function AccountMenu(props: {}) {
  const loginState = useLoginState();

  if (!loginState) return <></>;

  return (
    <div className="AccountMenu">
      Eingeloggt als {loginState.username} <span>(ausloggen)</span>
    </div>
  );
}
