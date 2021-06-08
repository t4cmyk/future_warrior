import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";
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
import { Countdown } from "./pages/countdown";
import { GamePhase, requireGameState, useGameState } from "./hooks/gameState";
import { ForgotPassword } from "./pages/forgotPassword";
import { ChangePassword } from "./pages/changePassword";
import { Verify } from "./pages/verify";
import { Header } from "./header";
import { ScrollToTop } from "./scrollToTop";
import { CookieBanner } from "./cookiebanner";
import { useLoginState } from "./hooks/loginState";
import { Ending } from "./pages/ending";

function SwitchPageContent() {
  const loadedGameState = requireGameState();
  const gameState = useGameState();
  const history = useHistory();
  const loginState = useLoginState();

  useEffect(() => {
    if (
      loadedGameState &&
      gameState.phase == GamePhase.Finished &&
      loginState &&
      history.location.pathname != "/Ending/"
    )
      history.push("/Ending/");
  });

  if (!loadedGameState) return <></>;

  return (
    <Switch>
      <Route path="/Ending/">
        <Ending />
      </Route>

      <Route path="/Landing/">
        {loginState ? <Redirect to="/Main/" /> : <Landing />}
      </Route>
      <Route path="/Login/">
        <Login />
      </Route>
      <Route path="/ForgotPassword/">
        <ForgotPassword />
      </Route>
      <Route path="/ChangePassword/">
        <ChangePassword />
      </Route>
      <Route path="/Register/">
        <Register />
      </Route>
      <Route path="/Verify/">
        <Verify />
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
        {loginState ? <Main /> : <Redirect to="/Landing/" />}
      </Route>
      <Route path="/Planet/">
        {loginState ? <Planet /> : <Redirect to="/Landing/" />}
      </Route>
      <Route path="/Teams/">
        <Teams />
      </Route>
      <Route path="/Missions/">
        {loginState ? <Missions /> : <Redirect to="/Landing/" />}
      </Route>
      <Route path="/Chat/">
        {loginState ? <Chat /> : <Redirect to="/Landing/" />}
      </Route>
      <Route path="/MissionComplete/:mission">
        {loginState ? <MissionComplete /> : <Redirect to="/Landing/" />}
      </Route>

      <Route path="/" exact>
        <Redirect to={loginState ? "/Main/" : "/Landing/"} />
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
        <ScrollToTop />
        <CookieBanner />
        <SwitchPageContent />

        <Footer />
      </Router>
    </>
  );
}
