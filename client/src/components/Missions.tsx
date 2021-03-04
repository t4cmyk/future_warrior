import React, { useState } from "react";
import { Button, Card, Carousel } from "react-bootstrap";

function ControlledCarousel() {
  const [index, setIndex] = useState(0);

  const handleSelect = (
    selectedIndex: React.SetStateAction<number>,
    e: any
  ) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel activeIndex={index} onSelect={handleSelect}>
      <Carousel.Item>
        <Card style={{ width: "18rem" }}>
          <Card.Img variant="top" src="mission-placeholder.jpg" />
          <Card.Body>
            <Card.Title>Vegan kochen</Card.Title>
            <Card.Text>Beschreibung wie die Mission funktioniert.</Card.Text>
            <Button variant="primary">Mission abschließen</Button>
          </Card.Body>
        </Card>
      </Carousel.Item>

      <Carousel.Item>
        <Card style={{ width: "18rem" }}>
          <Card.Img variant="top" src="mission-placeholder.jpg" />
          <Card.Body>
            <Card.Title>2te Mission</Card.Title>
            <Card.Text>Beschreibung wie die Mission funktioniert.</Card.Text>
            <Button variant="primary">Mission abschließen</Button>
          </Card.Body>
        </Card>
      </Carousel.Item>

      <Carousel.Item>
        <Card style={{ width: "18rem" }}>
          <Card.Img variant="top" src="mission-placeholder.jpg" />
          <Card.Body>
            <Card.Title>3te Mission</Card.Title>
            <Card.Text>Beschreibung wie die Mission funktioniert.</Card.Text>
            <Button variant="primary">Mission abschließen</Button>
          </Card.Body>
        </Card>
      </Carousel.Item>
    </Carousel>
  );
}

export function Missions() {
  return (
    <>
      <h1>Missionen</h1>
      <br />
      <br />
      <ControlledCarousel />
    </>
  );
}
