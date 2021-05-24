import React, { useEffect } from "react";
import { useState } from "react";
import {
  Alert,
  Button,
  ButtonGroup,
  Container,
  ToggleButton,
} from "react-bootstrap";
import { getToken } from "../../core/authentication";
import { IPlanetInfo, Sector } from "../planetElements";

function isNewSectorAvaible(sel: ISectorSelection) {
  if (
    (sel.level > 1 && sel.sector1 == null) ||
    (sel.level > 2 && sel.sector2 == null) ||
    (sel.level > 3 && sel.sector3 == null)
  )
    return true;
}

export interface ISectorSelection {
  level: number; // 1 -default, 2 - one sector, 3 - two sectors, 4 - three sectors
  sector1: string;
  sector2: string;
  sector3: string;
  selectedSector: string;
}

export function isAnySectorEqualString(
  sel: IPlanetInfo | ISectorSelection,
  st: string
) {
  if (sel.sector1 == st) return true;
  if (sel.sector2 == st) return true;
  if (sel.sector3 == st) return true;
  return false;
}

interface IRadio {
  name: string;
  value: string;
}

function genRadios(sectors: ISectorSelection) {
  let radios: IRadio[] = [];
  if (sectors == null) return radios;
  if (!isAnySectorEqualString(sectors, Sector.energy))
    radios.push({ name: Sector.energy, value: Sector.energy });
  if (!isAnySectorEqualString(sectors, Sector.diet))
    radios.push({ name: Sector.diet, value: Sector.diet });
  if (!isAnySectorEqualString(sectors, Sector.mobility))
    radios.push({ name: Sector.mobility, value: Sector.mobility });
  if (!isAnySectorEqualString(sectors, Sector.social))
    radios.push({ name: Sector.social, value: Sector.social });
  if (!isAnySectorEqualString(sectors, Sector.household))
    radios.push({ name: Sector.household, value: Sector.household });
  radios.push({ name: "Ich weiß es noch nicht", value: "null" });

  return radios;
}

export function SelectSector() {
  const [show, setShow] = useState(false);
  const [radioValue, setRadioValue] = useState("null");
  const [radios, setRadios] = useState([
    { name: "Ich weiß es noch nicht", value: "null" },
  ]);

  const onSectorSelection = async (value: any) => {
    const request: RequestInit = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sector: value == "null" ? null : value,
      }),
    };
    const resp = await fetch(`/sectorChoice?&token=${getToken()}`, request);
    const respData = (await resp.json());
    if (resp.ok) {
      if (respData == true) setShow(false);
    } else {
      console.log(resp);
    }
  };

  // fetch sector infos
  const [selectionInfo, setSelectionInfo] = useState<ISectorSelection>();
  useEffect(() => {
    const resultHandler = { onFetch: setSelectionInfo };
    const fetchSelectionInfos = async () => {
      try {
        const resp = await fetch(`/sectorSelection?token=${getToken()}`);
        const respData = (await resp.json()) as ISectorSelection;
        setSelectionInfo(respData);
        return respData;
      } catch (e) {
        console.log(e);
      }
      return;
    };
    fetchSelectionInfos().then((result) => resultHandler.onFetch(result));
    return () => {
      resultHandler.onFetch = (_: any) => {};
    };
  }, []);

  // show selection
  useEffect(() => {
    if (!selectionInfo) return;
    if (isNewSectorAvaible(selectionInfo)) setShow(true);
    setRadios(genRadios(selectionInfo));
    setRadioValue(selectionInfo.selectedSector);
  }, [selectionInfo]);

  return (
    <>
      <Container className="fixed-bottom">
        <Alert
          width="max-content"
          show={show}
          variant="primary"
          onClose={() => {
            setShow(false);
          }}
        >
          <Alert.Heading></Alert.Heading>
          Glückwusch, Ihr habt einen weiteren Sektor zum Ausbauen
          freigeschaltet. Sobald dein gesamtes Team den gleichen Sektor
          ausgewählt hat, wird die Auswahl bestätigt.
          <br />
          <br />
          Welchen Sektor möchtest du ausbauen?
          <div className="d-flex justify-content-center">
            {" "}
            <ButtonGroup toggle>
              {radios.map((radio, idx) => (
                <ToggleButton
                  key={idx}
                  type="radio"
                  variant="primary"
                  name="radio"
                  value={radio.value}
                  checked={radioValue === radio.value}
                  onChange={(e) => {
                    setRadioValue(e.currentTarget.value);
                    onSectorSelection(e.currentTarget.value);
                  }}
                >
                  {radio.name}
                </ToggleButton>
              ))}
            </ButtonGroup>
          </div>
        </Alert>
      </Container>
    </>
  );
}
