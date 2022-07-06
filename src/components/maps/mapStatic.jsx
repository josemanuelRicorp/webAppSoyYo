import { MapContainer, Marker, Popup, TileLayer, useMapEvent } from "react-leaflet";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import React, { useEffect } from "react";
import "leaflet/dist/leaflet.css";

export const MapStatic = ({ lat, lng }) => {
  const initialPositionCoords = [-17.806098458690858, -63.16360831260682];
  let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
  });
  L.Marker.prototype.options.icon = DefaultIcon;

  useEffect(() => {
    // console.log({lat, lng});
    // console.log({"initialPositionCoords":initialPositionCoords});

    // console.log({ markerLat: lat, markerLng: lng });
    console.log({ markerLat: lat, markerLng: lng });
    // setPosition({ lat, lng });
  }, []);



  return (
    <div style={{ width: "100%", backgroundColor: "red" }}>
      <MapContainer
        id="mapStatic"
        // style={{ width: "100%", height: "200px" ,backgroundColor:"green" }}
        center={  initialPositionCoords }
        zoom={17}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={initialPositionCoords}>
          <Popup>
            {lat},{lng}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};
