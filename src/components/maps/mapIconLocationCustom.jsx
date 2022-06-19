import L from "leaflet";
import urlIcon from "../../assets/img/venue_location_icon.svg";
export const MapIconLocationCustom = L.icon({
  iconUrl:urlIcon ,
  iconRetinaUrl:urlIcon,
  iconAnchor: null,
  shadowUrl: null,
  shadowSize: null,
  shadowAnchor: null,
  iconSize: [35, 35],
  className: "leaflet-venue-icon",
});






