import React, {  useState } from "react";
import { Modal, Row, Spinner } from "react-bootstrap";
import { MapContainer, TileLayer } from "react-leaflet";
import { MdAdsClick } from "react-icons/md";
import { MapPlaceholder, MapMarker } from "../maps";

//  {lat: -17.806098458690858, lng: -63.16360831260682}
export const Map = ({ show, handleOnHide, handlePositionMarker, handleOnSubmitMaps }) => {
  const [position, setPosition] = useState([
    -17.783310801661553, -63.18212983710896
  ]);

  const [state, setState] = useState(9);
  function handleSaveLocation() {
    setState(11);
    setTimeout(() => {
    setState(9);
    handleOnSubmitMaps();
    handleOnHide();
    },1800);
    
  }

  function setMarkerPosition(value) {
    setState(10);
    handlePositionMarker(value);
  }


  return (
    <Modal
    size="lg"
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
        <Row className="mapContainer">
         <MapContainer
                  id="map"
                  center={position}
                  zoom={13}
                  scrollWheelZoom={true}
                  placeholder={<MapPlaceholder />}
                >
                  <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <MapMarker 
                  setMarkerPosition={setMarkerPosition} 
                  />
                </MapContainer>
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
                  onClick={handleSaveLocation}
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
