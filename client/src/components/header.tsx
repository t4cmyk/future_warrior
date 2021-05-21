import React from "react";
import { Link } from "react-router-dom";
import { AccountMenu } from "./accountMenu";
import { useLoginState } from "./hooks/loginState";

export function Header() {
  const loginState = useLoginState();
  const linkTo = loginState ? "/Main" : "/Landing";

  return (
    <header>
      <div className="justify-content-between col-12 d-flex">
        <Link to={linkTo}>
          <img width="288" height="100" src="/img/missionfuture.png" />
        </Link>
        <AccountMenu />
      </div>
    </header>
  );
}
