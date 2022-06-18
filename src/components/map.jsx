import React, { useState } from "react";
import { Col, Modal, Row, Spinner } from "react-bootstrap";
// import { MapsPicker } from './MapsPicker';
import { MapContainer, TileLayer } from "react-leaflet";
import { MapPlaceholder } from "./mapPlaceholder";
import { MapMarker } from "./mapMarker";

import { MdAdsClick } from "react-icons/md";
import { linkGoogleMaps } from "../utils/socialMediaLinks";
//  {lat: -17.806098458690858, lng: -63.16360831260682}
export const Map = ({ show, handleOnHide, setMarkerPositionResult }) => {
  const initialPositionCoords = ["-17.791907391388357", "-63.17891451557049"];
  // const [position, setPosition] = useState(initialPositionCoords);
  const [position, setPosition] = useState([
    -17.806098458690858, -63.16360831260682,
  ]);
  const [marker, setMarker] = useState();
  const [state, setState] = useState(9);
  function handleLocation() {
    setState(11);
    setTimeout(() => {
    setState(9);
    }, 2000);
    handleOnHide();
  }
  function setMarkerPosition(value) {
    setState(10);
    setMarker(value);
    // let url = `https://www.google.com/maps/@${value.lat},${value.lng},17z`;
    // // http://maps.google.com/maps?z={zoom}&t={typeMap}&q=loc:{latitude}+{longitude}
    // let url2 = `https://maps.google.com/maps?z=17&t=m&q=loc:${value.lat}+${value.lng}`;
    // linkGoogleMaps(value.lat, value.lng);
    // console.log(url.toString());
    // console.log(url2.toString());
    console.log(linkGoogleMaps(value.lat, value.lng));
    setMarkerPositionResult(linkGoogleMaps(value.lat, value.lng));
  }

  return (
    <Modal
      // size="lg-down"
      // size="sm"
      fullscreen={"lg-down"}
      show={show}
      onHide={handleOnHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          <MdAdsClick /> Selecciona la ubicación
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col>
            <div>
              <div style={{ width: "100%" }}>
                <MapContainer
                  id="map"
                  center={position}
                  zoom={10}
                  scrollWheelZoom={true}
                  placeholder={<MapPlaceholder />}
                >
                  <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <MapMarker setMarkerPosition={setMarkerPosition} />
                </MapContainer>
              </div>
            </div>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <div style={{ width: "100%" }}>
          {state === 11 ? (
            <button
              style={{ float: "right" }}
              className="btn-custom disabled"
              disabled
            >
              <Spinner
                className="me-1"
                as="span"
                animation="grow"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              Cargando
            </button>
          ) : (
            <>
              {state === 9 ? (
                <button
                  style={{ float: "right" }}
                  className="btn-custom disabled"
                  disabled
                >
                  Guardar
                </button>
              ) : (
                <button
                  style={{ float: "right" }}
                  className="btn-custom"
                  onClick={handleLocation}
                >
                  Guardar
                </button>
              )}
            </>
          )}
        </div>
      </Modal.Footer>
    </Modal>
  );
};
