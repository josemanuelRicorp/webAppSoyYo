import { useEffect, useRef, useState } from "react";
import {
  getLinksBySocialMedia,
  insertNewLink,
  updateLink,
} from "../../firebase/firebase";
import { link2FieldsMaps } from "../../utils/socialMediaFields";
import { v4 as uuidv4 } from "uuid";

import MessageInputs from "../messageInputs";
import { linkGoogleMaps } from "../../utils/socialMediaLinks";
import { Map, MapStatic } from "../maps";

export const FormMap = ({ style, user, handleAccordion }) => {
  const [state, setState] = useState(0);
  const [currentUser, setCurrentUser] = useState(user);
  const [openMap, setOpenMap] = useState(false);
  const [mapLat, setMapLat] = useState("");
  const [mapLng, setMapLng] = useState("");
  const initialPositionCoords = {
    lat: -17.768760534061514,
    lng: -63.18273797606208,
  };
  const [mapLatLng, setMapLatLng] = useState(initialPositionCoords);
  const [mapsLinkDocId, setMapsLinkDocId] = useState("");
  const mapMarkerRef = useRef(null);

  const [showMap, setShowMap] = useState(false);
  useEffect(() => {
    initMapsInfo(user.uid);
  }, []);

  async function initMapsInfo(uid) {
    const resLinksMaps = await getLinksBySocialMedia(uid, "maps");
    setTimeout(() => {
      if (resLinksMaps.length > 0) {
        const linkObject = [...resLinksMaps][0];
        setMapsLinkDocId(linkObject.docId);
        let fieldsData = link2FieldsMaps(linkObject.url);
        console.log({ fl: fieldsData.lat, fln: fieldsData.lng });

        setMapLat(fieldsData.lat);
        setMapLng(fieldsData.lng);
        setMapLatLng({ lat: fieldsData.lat, lng: fieldsData.lng });

        console.log({ mapLat, mapLng, mapLatLng });

        setState(1);
      }
    }, 2000);
  }

  function addLink() {
    if (mapLatLng) {
      const newURL = linkGoogleMaps(mapLat, mapLng);
      const newLink = {
        id: uuidv4(),
        title: "Mapa",
        category: "primary",
        socialmedia: "maps",
        url: newURL,
        uid: currentUser.uid,
      };
      const res = insertNewLink(newLink);
      newLink.docId = res.id;
      return newLink.docId;
    }
  }

  function editLink(currentLinkDocId) {
    if (mapLatLng) {
      const newURL = linkGoogleMaps(mapLat, mapLng);
      const link = {
        title: "Mapa",
        category: "primary",
        socialmedia: "maps",
        url: newURL,
        uid: currentUser.uid,
      };
      const res = updateLink(currentLinkDocId, link);
      link.docId = res.id;
    }
  }

  function handleOnSubmitMaps() {
    if (mapsLinkDocId !== "") {
      editLink(mapsLinkDocId);
    } else {
      addLink();
    }
    handleMessageConfirmation();
    handleAccordion();
  }

  function handleOnHideMap() {
    setShowMap(false);
    // handleOnSubmitMaps();
  }

  function handlePositionMarker(value) {
    setMapLat(value.lat);
    setMapLng(value.lng);
    setMapLatLng({ lat: value.lat, lng: value.lng });
  }

  function handleMessageConfirmation() {
    setOpenMap(true);
    setTimeout(() => {
      setOpenMap(false);
    }, 2600);
  }
  return (
    <>
      <div className={style}>
        <h2>Datos para el enlace de tu ubicación</h2>
        {openMap ? (
          <MessageInputs
            open={openMap}
            type={"success"}
            socialmedia={"ubicación"}
          ></MessageInputs>
        ) : (
          ""
        )}
        <button className="btn-custom" onClick={() => setShowMap(true)}>
          Editar ubicación
        </button>
        <Map
          user={currentUser}
          show={showMap}
          handleOnHide={handleOnHideMap}
          handleOnSubmitMaps={handleOnSubmitMaps}
          handlePositionMarker={handlePositionMarker}
        />
      </div>
      <div>{state == 1 ? <MapStatic mapLatLng={mapLatLng} /> : <></>}</div>
    </>
  );
};
