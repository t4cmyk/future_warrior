import React from "react";
import { Link } from "react-router-dom";
import { AccountMenu } from "./accountMenu";

export function Header() {
  return (
    <header>
      <div className="justify-content-between col-12 d-flex">
        <Link to="/Landing">
          <img width="288" height="100" src="/img/missionfuture.png" />
        </Link>
        <AccountMenu />
      </div>
    </header>
  );
}
