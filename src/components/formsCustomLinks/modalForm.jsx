import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useEffect, useRef, useState } from "react";
import { Form, Modal, ProgressBar } from "react-bootstrap";
import { storage, updateCustomLink } from "../../firebase/firebase";
import MessageInputsCustoms from "../messageInputsCustoms";
import styles from "../../styles/editProfileView.module.css";

export const ModalForm = ({ style, show, handleOnHide, user }) => {
  const [openCustom, setOpenCustom] = useState(false);
  const [progress, setProgress] = useState(0);
  const [iconFile, setIconFile] = useState("");
  const [customUrl, setCustomUrl] = useState("");
  const [customWebSite, setCustomWebSite] = useState("");

  const customUrlRef = useRef(null);
  const customWebSiteRef = useRef(null);

  useEffect(() => {
    setCustomUrl(user.url);
    setCustomWebSite(user.website);
    setIconFile(user.icon);
  }, [show]);

  const handleSubmit = async (e) => {
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

  function editLink(currentLinkDocId) {
    if (customWebSite && customUrl && iconFile) {
      const link = {
        website: customWebSite,
        url: customUrl,
        icon: iconFile,
        uid: user.uid,
        id: user.id,
      };
      const res = updateCustomLink(currentLinkDocId, link);
      link.docId = res.id;
    }
  }

  const handleOnSubmitCustom = (e) => {
    if (customUrl !== "" && customWebSite !== "") {
      e.preventDefault();
      e.stopPropagation();
      if (user.docId !== "") {
        editLink(user.docId);
        handleMessageConfirmation();
      }
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
      <Modal
        size="lg"
        show={show}
        onHide={handleOnHide}
        backdrop="static"
        keyboard={false}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Editar los Enlaces Personales</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {" "}
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
                onChange={handleSubmit}
              />
              <br />
              <h5>Espere a completar la carga.</h5>
              <ProgressBar
                className={styles.barra}
                striped
                variant="success"
                animated
                now={progress}
                label={`${progress}%`}
              />
            </>
            <br />
            <br />
            <input
              className="btn-custom"
              type="submit"
              value="Actualizar Datos"
            />
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};