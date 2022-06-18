import React,{ useMemo, useRef, useState } from "react";
import { Marker, Popup, useMapEvent, useMapEvents } from "react-leaflet";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

export function MapStaticMarker({ lat, lng }) {
    const [position, setPosition] = useState(null);
   
    let DefaultIcon = L.icon({
        iconUrl: icon,
        shadowUrl: iconShadow
    });
    L.Marker.prototype.options.icon = DefaultIcon;
    const map = useMapEvent({
    //   click() {
    //     map.locate(
    //       {
    //         enableHighAccuracy: true,
            
    //       }
    //     )
    //   },
      load(){
        setPosition({ lat, lng })
        map.flyTo({ lat, lng }, 17);
           
      },
    //   locationfound(e) {
    //   setPosition({lat:e.latlng.lat.toPrecision(20),lng:e.latlng.lng.toPrecision(20)})
    //     map.flyTo({lat:e.latlng.lat.toPrecision(20),lng:e.latlng.lng.toPrecision(20)}, 17);
        
    //   },
    })
  


    return position === null ? "" : (
      <Marker 
      position={position} 
     
    //   eventHandlers={eventHandlers}
    //   ref={markerRef}
      >
        <Popup>Localiza la ubicación de tu negocio</Popup>
      </Marker>     
    )
  }