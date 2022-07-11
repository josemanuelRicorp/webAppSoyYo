import React, { useMemo, useRef, useState } from "react";
import { Marker, Popup, useMapEvents } from "react-leaflet";
import { MapIconLocationCustom } from "./mapIconLocationCustom";

export function MapMarkerStatic({ setPosition }) {
  const [markerPosition, setMarkerPosition] = useState({});

  const markerRef = useRef(null);
  const map = useMapEvents({
  
  });
 
  return markerPosition === null ? (
    ""
  ) : (
    <Marker
      icon={MapIconLocationCustom}
      // icon={MapIconLocationGeneric}
      setMarkerPosition={setPosition}
      title={"Ubicación guardada"}
      alt="marcador"
      draggable={false}
      ref={markerRef}
    >
      <Popup>Ubicación de tu negocio</Popup>
    </Marker>
  );
}
