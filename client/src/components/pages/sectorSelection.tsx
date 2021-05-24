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

const level = 4;
const sector1 = 1;
const sector2: any = null;
const sector3: any = null;

function isNewSectorAvaible(sel: ISectorSelection) {
  if (
    (level > 1 && sel.sector1 == null) ||
    (level > 2 && sel.sector2 == null) ||
    (level > 3 && sel.sector3 == null)
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
  radios.push({ name: "Ich weiß es noch nicht", value: "0" });

  return radios;
}

export function SelectSector() {
  const [show, setShow] = useState(false);
  const [radioValue, setRadioValue] = useState("0");
  const [radios, setRadios] = useState([
    { name: "Energie", value: "0" },
    { name: "Ernährung", value: "0" },
    { name: "Mobilität", value: "0" },
    { name: "Soziales", value: "0" },
    { name: "Haushalt", value: "0" },
    { name: "Ich weiß es noch nicht", value: "0" },
  ]);

  const [selectionInfo, setSelectionInfo] = useState<ISectorSelection>();
  useEffect(() => {
    const resultHandler = { onFetch: setSelectionInfo };
    const fetchSelectionInfos = async () => {
      try {
        const resp = await fetch(`/planetData?token=${getToken()}`);
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

  useEffect(() => {
    if (!selectionInfo) return;
    if (isNewSectorAvaible(selectionInfo)) setShow(true);
    setRadios(genRadios(selectionInfo));
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
                  onChange={(e) => setRadioValue(e.currentTarget.value)}
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
