import { useEffect, useState } from "react";
import {
  getLinksBySocialMedia,
  insertNewLink,
  updateLink,
  deleteLink,
} from "../../firebase/firebase";
import { link2FieldsMaps } from "../../utils/socialMediaFields";
import { v4 as uuidv4 } from "uuid";

import MessageInputs from "../messageInputs";
import { linkGoogleMaps } from "../../utils/socialMediaLinks";
import { Map, MapStatic } from "../maps";
import { ModalMapDescription } from "../modals/ModalMapDescription";
export const FormMap = ({ style, user, handleAccordion }) => {
  const [state, setState] = useState(0);
  const [currentUser, setCurrentUser] = useState(user);
  const [openMap, setOpenMap] = useState(false);
  const [openModalDescription, setOpenModalDescription] = useState(false);
  const [mapLat, setMapLat] = useState("");
  const [mapLng, setMapLng] = useState("");
  const initialPositionCoords = {
    lat: -17.768760534061514,
    lng: -63.18273797606208,
  };
  const [mapLatLng, setMapLatLng] = useState(initialPositionCoords);
  const [mapsLinkDocId, setMapsLinkDocId] = useState("");
  const [removeLink, setRemoveLink] = useState(false);
  const [showMap, setShowMap] = useState(false);
  useEffect(() => {
    initMapsInfo(user.uid);
  // }, []);
  }, [handleDeleteMap, handleOnSubmitMaps]);

  async function initMapsInfo(uid) {
    const resLinksMaps = await getLinksBySocialMedia(uid, "maps");
    if (resLinksMaps.length > 0) {
      const linkObject = [...resLinksMaps][0];
      setMapsLinkDocId(linkObject.docId);
      let fieldsData = link2FieldsMaps(linkObject.url);
      setMapLat(fieldsData.lat);
      setMapLng(fieldsData.lng);
      setMapLatLng({ lat: fieldsData.lat, lng: fieldsData.lng });
      setState(1);
    }
  }

  function addLink() {
    console.log({mapLatLng});
    console.log({mapLat, mapLng});
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
      initMapsInfo(currentUser.uid);
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
  function handleCloseModalMapDescription(){
    setOpenModalDescription(false);
    
  }
  function handleOpenModalMapDescription(){
    setOpenModalDescription(true);
  }
  function handleOnHideMap() {
    setShowMap(false);
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
    }, 3000);
  }
  function handleMessageRemoveLink() {
    setOpenMap(true);
    setRemoveLink(true);
    setTimeout(() => {
      setOpenMap(false);
    }, 3000);
  }
  function handleDeleteMap() {
    const res = deleteLink(mapsLinkDocId);
    handleMessageRemoveLink();
    handleAccordion();
    setState(0)
  }

  return (
    <>
      <div className={style}>
        <h2>Datos para el enlace de tu ubicación</h2>
        {openMap ? (
          <MessageInputs
            open={openMap}
            type={removeLink ? "danger" : "success"}
            socialmedia={"ubicación"}
          ></MessageInputs>
        ) : (
          ""
        )}
 
 <button className="btn-custom" onClick={() => setShowMap(true)}>
          Editar ubicación
        </button>

        {
          openModalDescription ?
          <ModalMapDescription
            show = {openModalDescription}
            handleOnHide = { handleCloseModalMapDescription }
            titleDescription = "Description"
            url = ""
          /> :
          null
        }


        {mapsLinkDocId ? (
          <>
            <button className="btn-custom negative" onClick={handleDeleteMap}>
              Eliminar ubicación registrada
            </button>
          </>
        ) : (
          <></>
        )}
        <Map
          user={currentUser}
          show={showMap}
          handleOnHide={handleOnHideMap}
          handleOnSubmitMaps={handleOnSubmitMaps}
          handlePositionMarker={handlePositionMarker}
          handleOpenModalMapDescription = { handleOpenModalMapDescription }
        />
      </div>
      <div>{state === 1 ? <MapStatic mapLatLng={mapLatLng} /> : <> </>}</div>
    </>
  );
};
