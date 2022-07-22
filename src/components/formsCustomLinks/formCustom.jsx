import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useEffect, useRef, useState } from "react";
import { Form } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import {
  getLinksBySocialMedia,
  insertNewLinkCustoms,
  storage,
} from "../../firebase/firebase";
import defaultImg from "../../assets/img/undefined.png";

import { link2FieldsWhatsapp } from "../../utils/socialMediaFields";
import MessageInputsCustoms from "../messageInputsCustoms";

export const FormCustom = ({ style, user }) => {
  const [currentUser, setCurrentUser] = useState(user);
  const [state, setState] = useState(0);
  const [openCustom, setOpenCustom] = useState(false);
  const [progress, setProgress] = useState(0);
  const [iconFile, setIconFile] = useState(defaultImg);
  const [customUrl, setCustomUrl] = useState("");
  const [customWebSite, setCustomWebSite] = useState("");

  const customUrlRef = useRef(null);
  const customWebSiteRef = useRef(null);

  useEffect(() => {
  }, []);

  const formIcon = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    await uploadFiles(file);
    setIconFile("");
  };

  const uploadFiles = (file) => {
    if (!file) return;
    const storageRef = ref(storage, `/icons/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const prog = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(prog);
      },
      (err) => console.log(err),
      function () {
        getDownloadURL(uploadTask.snapshot.ref).then((iconUrl) => {
          setIconFile(iconUrl);
        });
      }
    );
  };

  function addLink() {
    if (customWebSite !== "" && customUrl !== "") {
      const newLink = {
        id: uuidv4(),
        website: customWebSite,
        url: customUrl,
        icon: iconFile,
        uid: currentUser.uid,
      };
      const res = insertNewLinkCustoms(newLink);
      newLink.docId = res.id;
      setCustomUrl("");
      setCustomWebSite("");
      return newLink.docId;
    }
  }

  const handleOnSubmitCustom = (e) => {
    if (customUrl !== "" && customWebSite !== "") {
      e.preventDefault();
      e.stopPropagation();
      addLink();
      handleMessageConfirmation();
    }
  };

  function handleOnChangeCustomUrl() {
    setCustomUrl(customUrlRef.current.value);
  }
  function handleOnChangeCustomWebSite() {
    setCustomWebSite(customWebSiteRef.current.value);
  }

  function handleMessageConfirmation() {
    setOpenCustom(true);
    setTimeout(() => {
      setOpenCustom(false);
      window.location.reload();
    }, 3000);
  }

  return (
    <>
      {" "}
      <h2>Datos para los Enlaces Personales</h2>
      <br />
      <Form className={style} onSubmit={handleOnSubmitCustom}>
        {openCustom ? (
          <MessageInputsCustoms
            open={openCustom}
            type={"success"}
            socialmedia={" "}
          ></MessageInputsCustoms>
        ) : (
          ""
        )}

        <br />
        <Form.Control
          className="input"
          type="text"
          name="sitio"
          placeholder="Nombre del Sitio"
          value={customWebSite}
          ref={customWebSiteRef}
          onChange={handleOnChangeCustomWebSite}
        />
        <br />
        <Form.Control
          className="input"
          type="text"
          name="url"
          placeholder="URL Sitio Web"
          value={customUrl}
          ref={customUrlRef}
          onChange={handleOnChangeCustomUrl}
        />
        <br />
        <>
          <Form.Control
            className="input"
            type="file"
            name="icono"
            onChange={formIcon}
          />
          <br />
          <h5>Espere a completar la carga.</h5>
          <h2>Subiendo {progress}%</h2>
          
        </>
        <br />
        <br />
        <input
          className="btn-custom"
          type="submit"
          value="Agregar Nuevo Enlace"
        />
      </Form>
    </>
  );
};
