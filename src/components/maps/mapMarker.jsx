import React,{ useMemo, useRef, useState } from "react";
import { Marker, Popup, useMapEvents } from "react-leaflet";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

export function MapMarker({setMarkerPosition}) {
    const [position, setPosition] = useState(null);
    const markerRef = useRef(null);
    let DefaultIcon = L.icon({
        iconUrl: icon,
        shadowUrl: iconShadow
    });
    L.Marker.prototype.options.icon = DefaultIcon;
    const map = useMapEvents({
      click() {
        map.locate(
          {
            enableHighAccuracy: true,
          }
        )
      },  
      locationfound(e) {
      setPosition({lat:e.latlng.lat.toPrecision(20),lng:e.latlng.lng.toPrecision(20)})
        map.flyTo({lat:e.latlng.lat.toPrecision(20),lng:e.latlng.lng.toPrecision(20)}, 17);
        setMarkerPosition({lat:e.latlng.lat.toPrecision(20),lng:e.latlng.lng.toPrecision(20)});
      },
    })
    const eventHandlers = useMemo(
        () => ({
          dragend() {
            const marker = markerRef.current
            if (marker != null) {
              setPosition(marker.getLatLng())
              setMarkerPosition(marker.getLatLng());
            }
          },
        }),
        [],
      );
    return position === null ? "" : (
      <Marker 
      position={position} 
      draggable={true}
      eventHandlers={eventHandlers}
      ref={markerRef}
      >
        <Popup>Localiza la ubicación de tu negocio</Popup>
      </Marker>     
    )
  }