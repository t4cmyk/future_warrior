import React from "react";

export function Login() {
    return (		<>
        <h1>
            Future Warrior - Performativ in die Zukunft!
        </h1>
        <br/>
        <table>
            <tr>
                <td>Nickname</td>
            </tr>
            <tr>
                <td>
                <input id = "usernameInput"></input>
                </td>
            </tr>
            <tr><td>Passwort</td></tr>
            <tr>
                <td><input id = "passwordInput"></input></td>
                <td><button>Einloggen 🠒 </button></td>
            </tr>
        </table>
        <button>Passwort vergessen?</button>
        <br />
    </>);
}