import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import React, { useEffect, useState } from "react";
import { MapPlaceholder } from "./mapPlaceholder";
import { MapIconLocationCustom } from "./mapIconLocationCustom";

export const MapStatic = ({ mapLatLng }) => {
  const [position, setPosition] = useState(mapLatLng);

  useEffect(() => {
    setPosition(mapLatLng);
  }, []);

  return (
    <div style={{ width: "100%", backgroundColor: "red" }}>
      <MapContainer
        id="mapStatic"
        center={position}
        zoom={17}
        // scrollWheelZoom={false}
        placeholder={<MapPlaceholder />}
      >
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          icon={MapIconLocationCustom}
          // icon={MapIconLocationGeneric}
          position={position}
          title={"Ubicación guardada"}
          alt="marcador"
          draggable={false}
          // ref={markerRef}
        >
          <Popup>Ubicación de tu negocio</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};
