type OnLoginStateChangeFn = () => any;
const onLoginStateChangeCallbacks = new Array<OnLoginStateChangeFn>();
let userLoggedIn: string = "";
let jwt: string = "";

export function registerOnLoginChange(callback: OnLoginStateChangeFn) {
  onLoginStateChangeCallbacks.push(callback);
  return () => {
    const idx = onLoginStateChangeCallbacks.indexOf(callback);
    console.assert(idx != -1);
    onLoginStateChangeCallbacks[idx] =
      onLoginStateChangeCallbacks[onLoginStateChangeCallbacks.length - 1];
    onLoginStateChangeCallbacks.pop();
  };
}

function loadFromLocalStorage() {
  const token = localStorage.getItem("jwt");
  jwt = token || "";
  if (jwt.length > 0) parseToken();
}

function parseToken() {
  const encPayload = jwt.split(".")[1];
  const payload: { username: string } = JSON.parse(window.atob(encPayload));
  userLoggedIn = payload.username;
}

loadFromLocalStorage();

function onLoginStateChange() {
  onLoginStateChangeCallbacks.forEach((cb) => cb());
}

export async function authenticateUser(username: string, password: string) {
  const resp = await fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username: username, password: password }),
  });
  if (resp.ok) {
    jwt = await resp.text();
    parseToken();
    localStorage.setItem("jwt", jwt);
    onLoginStateChange();
  } else throw new Error(await resp.text());
}

export function logoutPlayer() {
  userLoggedIn = "";
  jwt = "";
  localStorage.removeItem("jwt");
  onLoginStateChange();
}

export function isLoggedIn() {
  return userLoggedIn.length > 0;
}

export function getUsername() {
  return userLoggedIn;
}

export function getToken() {
  return jwt;
}
