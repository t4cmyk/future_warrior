import React from "react";

export function MissionComplete() {
  return (
    <>
      <h1>Mission abschließen</h1>
      <br />
      Herzlichen Glückwunsch! Du hast die Mission XY erledigt. Nachfolgend wären
      noch ein paar Fragen für das Raumfahrtprotokoll wichtig. Das dauert nicht
      lange und hilft allen Raumfahrer*innen, sich ein Bild von deiner
      persönlichen Mission zu machen, um sich inspirieren zu lassen, sich selbst
      für diese Mission zu motivieren oder die Mission weiterzuentwickeln.
      Letztlich hilft das vor allem Utopia und der zukünftigen Gesellschaft
      dort, die von eurem Erfahrungsreichtum der „alten Welt“ profitiert.
      <br />
      Beschreibe in 2 Sätzen kurz und knapp deine persönliche Umsetzung der
      Mission:
      <br />
      <textarea></textarea>
      <br />
      <input type="radio" id="great" value="2"></input>
      <label>Sehr viel</label>
      <br />
      <input type="radio" id="good" value="1"></input>
      <label>Eher viel</label>
      <br />
      <input type="radio" id="okay" value="0"></input>
      <label>Geht so</label>
      <br />
      <input type="radio" id="bad" value="-1"></input>
      <label>Eher keine</label>
      <br />
      <input type="radio" id="worse" value="-2"></input>
      <label>Gar keinen</label>
      <br />
      <br />
      <button>Raumfahrt beschleunigen 🠒 </button>
    </>
  );
}
