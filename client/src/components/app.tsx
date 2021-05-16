import React from "react";
import {
  BrowserRouter as Router,
  Link,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import { AccountMenu } from "./accountMenu";
import { Chat } from "./pages/chat";
import { Contact } from "./pages/contact";
import { Help } from "./pages/help";
import { Impressum } from "./pages/impressum";
import { Landing } from "./pages/landing";
import { Login } from "./pages/login";
import { Main } from "./pages/main";
import { MissionComplete } from "./pages/missionComplete";
import { Missions } from "./pages/missions";
import { Privacy } from "./pages/privacy";
import { Register } from "./pages/register";
import { Teams } from "./pages/teams";
import { Tutorial } from "./pages/tutorial";
import { Planet } from "./pages/planet";
import { isLoggedIn } from "../core/authentication";
import { Footer } from "./footer";
import { Countdown } from "./pages/Countdown";
import { requireGameState } from "./hooks/gameState";

function Header() {
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

function SwitchPageContent() {
  const loadedGameState = requireGameState();

  if (!loadedGameState) return <></>;

  return (
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
          <Route path="/Countdown/">
            <Countdown />
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
      <Route path="/Planet/">
        <Planet />
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
      <Route path="/MissionComplete/:mission">
        <MissionComplete />
      </Route>

      <Route path="/" exact>
        <Redirect to={isLoggedIn() ? "/Main/" : "/Landing/"} />
      </Route>
      <Route path="/">404</Route>
    </Switch>
  );
}

export function AppComponent() {
  return (
    <>
      <Router>
        <Header />
        <SwitchPageContent />
        <Footer />
      </Router>
    </>
  );
}
