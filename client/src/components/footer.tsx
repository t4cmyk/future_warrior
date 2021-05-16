import React from "react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer>
      <hr />
      <Link to="/Help/">Hilfe</Link> <Link to="/Privacy/">Datenschutz</Link>{" "}
      <Link to="/Impressum/">Impressum</Link>{" "}
      <Link to="/Contact/">Kontakt</Link>
    </footer>
  );
}
