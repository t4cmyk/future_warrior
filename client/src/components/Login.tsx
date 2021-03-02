import React, { useRef, useState } from "react";
import {
  authenticateUser,
  getUsername,
  isLoggedIn,
} from "../core/authentication";

export function Login() {
  const [loginState, setLoginState] = useState(isLoggedIn());
  const [loginError, setLoginError] = useState("");
  const usernameRef = useRef<HTMLInputElement>();
  const passwordRef = useRef<HTMLInputElement>();

  if (loginState) {
    const username = getUsername();
    return <>Logged in as {username}</>;
  }

  const login = async () => {
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;
    try {
      await authenticateUser(username, password);
      setLoginState(true);
    } catch (ex) {
      setLoginState(false);
      setLoginError((ex as Error).message);
    }
  };

  return (
    <>
      <h1>Future Warrior - Performativ in die Zukunft!</h1>
      <br />
      <table>
        <tr>
          <td>Nickname</td>
        </tr>
        <tr>
          <td>
            <input id="usernameInput" ref={usernameRef}></input>
          </td>
        </tr>
        <tr>
          <td>Passwort</td>
        </tr>
        <tr>
          <td>
            <input id="passwordInput" ref={passwordRef}></input>
          </td>
          <td>
            <button onClick={login}>Einloggen 🠒 </button>
          </td>
        </tr>
      </table>
      {loginError.length > 0 ? <span>{loginError}</span> : <></>}
      <button>Passwort vergessen?</button>
      <br />
    </>
  );
}
