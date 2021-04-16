import React, { useEffect, useState } from "react";
import {
  getToken,
  getUsername,
  isLoggedIn,
  registerOnLoginChange,
} from "../../core/authentication";

export function useLoginState() {
  const [loggedInState, setLoggedIn] = useState(isLoggedIn());
  useEffect(() => {
    const onNewLoginState = () => {
      setLoggedIn(isLoggedIn());
    };
    const cleanup = registerOnLoginChange(onNewLoginState);
    return cleanup;
  });

  if (loggedInState) {
    return {
      username: getUsername(),
      token: getToken(),
    };
  }
  return undefined;
}
