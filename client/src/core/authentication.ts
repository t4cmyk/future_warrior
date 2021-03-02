let userLoggedIn: string = "";
let jwt: string = "";

function loadFromLocalStorage() {
  const token = localStorage.getItem("jwt");
  jwt = token || "";
}

loadFromLocalStorage();

export async function authenticateUser(username: string, password: string) {
  const resp = await fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username: username, password: password }),
  });
  if (resp.ok) {
    const token = await resp.text();
    const encPayload = token.split(".")[1];
    const payload: { username: string } = JSON.parse(window.atob(encPayload));
    userLoggedIn = payload.username;
  } else throw new Error(await resp.text());
}

export function isLoggedIn() {
  return userLoggedIn.length > 0;
}

export function getUsername() {
  return userLoggedIn;
}
