import L from "leaflet";
import "leaflet/dist/leaflet.css";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
export const MapIconLocationGeneric = L.icon({
  iconUrl:icon ,
  iconRetinaUrl:icon,
  shadowUrl: iconShadow,
});


  // let DefaultIcon = L.icon({
  //     iconUrl: icon,
  //     shadowUrl: iconShadow
  // });
  // L.Marker.prototype.options.icon = DefaultIcon;





