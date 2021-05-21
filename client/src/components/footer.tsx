import React from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <>
      <br />
      <br />
      <footer>
        <div className="d-flex justify-content-around">
          <div>
            <img src="/img/logos/disPos.png" height="50" width="0" />
            <img className="logo" src="/img/logos/disPos.png" />
            {"   "}
            <img className="logo" src="/img/logos/spHi.jpg" />
          </div>
          <div>
            <Link to="/Help/">Hilfe</Link>{" "}
            <Link to="/Privacy/">Datenschutz</Link>{" "}
            <Link to="/Impressum/">Impressum</Link>{" "}
            <Link to="/Contact/">Kontakt</Link>
          </div>
          <div>
            <img src="/img/logos/disPos.png" height="50" width="0" />
            <img className="logo" src="/img/logos/studOst.png" />
            {"   "}
            <img className="logo" src="/img/logos/stuPa.jpg" />
          </div>
        </div>
      </footer>
    </>
  );
}
