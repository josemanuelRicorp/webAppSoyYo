import React, { useMemo, useRef, useState } from "react";
import { Marker, Popup, useMapEvents } from "react-leaflet";
import { MapIconLocationCustom } from "./mapIconLocationCustom";
import { MapIconLocationGeneric } from "./mapIconLocationGeneric";

export function MapMarker({ setMarkerPosition }) {
  const [position, setPosition] = useState(null);
  const [isCurrentLocation, setIsCurrentLocation] = useState(false);
  const markerRef = useRef(null);
  const map = useMapEvents({
    mouseover() {
      if (isCurrentLocation === false) {
        map.locate({
          enableHighAccuracy: true,
        });
        setIsCurrentLocation(true);
      }
    },
    keyup(e) {
      const keyName = e.originalEvent.key;
      if (
        keyName === "ArrowRight" ||
        keyName === "ArrowDown" ||
        keyName === "ArrowUp" ||
        keyName === "ArrowLeft"
      ) {
        setPosition({
          lat: map.getCenter().lat,
          lng: map.getCenter().lng,
        });
        setMarkerPosition({
          lat: map.getCenter().lat,
          lng: map.getCenter().lng,
        });
      }
      
    },
    
    click(e) {
      if (isCurrentLocation) {
        map.setView(
          e.latlng
          //   map.getZoom(), {
          //   animate: true,
          // }
        );
        setPosition({
          lat: e.latlng.lat.toPrecision(20),
          lng: e.latlng.lng.toPrecision(20),
        });

        setMarkerPosition({
          lat: e.latlng.lat.toPrecision(20),
          lng: e.latlng.lng.toPrecision(20),
        });
      }
    },
    locationfound(e) {
      map.flyTo(
        {
          lat: e.latlng.lat.toPrecision(20),
          lng: e.latlng.lng.toPrecision(20),
        },
        17
      );
      setPosition({
        lat: e.latlng.lat.toPrecision(20),
        lng: e.latlng.lng.toPrecision(20),
      });
      setMarkerPosition({
        lat: e.latlng.lat.toPrecision(20),
        lng: e.latlng.lng.toPrecision(20),
      });
    },
  });
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          setPosition(marker.getLatLng());
          setMarkerPosition(marker.getLatLng());
        }
      },
    }),
    []
  );
  return position === null ? (
    ""
  ) : (
    <Marker
      icon={MapIconLocationCustom}
      // icon={MapIconLocationGeneric}
      position={position}
      keyboard={true}
      title={"Arrastre el marcador para cambiar la posición"}
      alt="marcador"
      draggable={true}
      eventHandlers={eventHandlers}
      ref={markerRef}
    >
      <Popup>Localiza la ubicación de tu negocio</Popup>
    </Marker>
  );
}
