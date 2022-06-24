import React, { useMemo, useRef, useState } from "react";
import { Marker, Popup, useMapEvents } from "react-leaflet";
import { MapIconLocationCustom } from "./mapIconLocationCustom";
import { MapIconLocationGeneric } from "./mapIconLocationGeneric";

export function MapMarker({ setMarkerPosition }) {
  const [position, setPosition] = useState(null);
  const [isCurrentLocation, setIsCurrentLocation] = useState(false);
  const markerRef = useRef(null);
  const map = useMapEvents({
    mouseover(){
      if (isCurrentLocation == false) {
        map.locate({
          enableHighAccuracy: true,
        });
        setIsCurrentLocation(true);
      }
    },
    dblclick() {
      // if (isCurrentLocation == false) {
      //   map.locate({
      //     enableHighAccuracy: true,
      //   });
      //   setIsCurrentLocation(true);
      // }

      // console.log({"setMarkerPosition":e.latlng});
      // map.setView(e.latlng
      // //   , map.getZoom(), {
      // //   animate: true,
      // // }
      // );
      // setPosition({
      //   lat: e.latlng.lat.toPrecision(20),
      //   lng: e.latlng.lng.toPrecision(20),
      // });
    },
    click(e) {
      if (isCurrentLocation) {
        console.log({ setMarkerPosition: e.latlng });
        map.setView(
          e.latlng,
          //   , map.getZoom(), {
          //   animate: true,
          // }
        );
        setPosition({
          lat: e.latlng.lat.toPrecision(20),
          lng: e.latlng.lng.toPrecision(20),
        });
      }
    },
    locationfound(e) {
      setPosition({
        lat: e.latlng.lat.toPrecision(20),
        lng: e.latlng.lng.toPrecision(20),
      });
      map.flyTo(
        {
          lat: e.latlng.lat.toPrecision(20),
          lng: e.latlng.lng.toPrecision(20),
        },
        17
      );
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
