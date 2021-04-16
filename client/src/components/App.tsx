import React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import { AccountMenu } from "./accountMenu";
import { Chat } from "./Chat";
import { Contact } from "./Contact";
import { Help } from "./Help";
import { Impressum } from "./Impressum";
import { Landing } from "./Landing";
import { Login } from "./Login";
import { Main } from "./Main";
import { MissionComplete } from "./MissionComplete";
import { Missions } from "./Missions";
import { Privacy } from "./Privacy";
import { Register } from "./Register";
import { Teams } from "./Teams";
import { Tutorial } from "./Tutorial";
import { Utopia } from "./Utopia";

export function AppComponent() {
  return (
    <>
      <AccountMenu />
      <Router>
        <Switch>
          <Route path="/Landing/">
            <Landing />
          </Route>
          <Route path="/Login/">
            <Login />
          </Route>
          <Route path="/Register/">
            <Register />
          </Route>
          <Route path="/Tutorial/">
            <Tutorial />
          </Route>

          <Route path="/Help/">
            <Help />
          </Route>
          <Route path="/Privacy/">
            <Privacy />
          </Route>
          <Route path="/Impressum/">
            <Impressum />
          </Route>
          <Route path="/Contact/">
            <Contact />
          </Route>

          <Route path="/Main/">
            <Main />
          </Route>
          <Route path="/Utopia/">
            <Utopia />
          </Route>
          <Route path="/Teams/">
            <Teams />
          </Route>
          <Route path="/Missions/">
            <Missions />
          </Route>
          <Route path="/Chat/">
            <Chat />
          </Route>
          <Route path="/MissionComplete/">
            <MissionComplete />
          </Route>

          <Route path="/">404</Route>
        </Switch>
      </Router>
    </>
  );
}
