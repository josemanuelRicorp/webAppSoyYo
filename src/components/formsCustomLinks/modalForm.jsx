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
  const [nameBoton, setNameBoton] = useState("Agregar Nuevo Enlace", true);
  const customUrlRef = useRef(null);
  const customWebSiteRef = useRef(null);
  const [booleanBoton, setBoleanBoton] = useState(true);
  // const [alertInput1, setAlerInput1] = useState(false);
  // const [alertInput2, setAlerInput2] = useState(false);

  useEffect(() => {
    setCustomUrl(user.url);
    setCustomWebSite(user.website);
    setIconFile(user.icon);

  }, [show]);

  const formIcon = async (e) => {
    e.preventDefault();
    setNameBoton("Espererando");
    setBoleanBoton(false);
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
          setNameBoton("Agregar Nuevo Enlace");
          setBoleanBoton(true);
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
    e.preventDefault();
    e.stopPropagation();
    if (customUrl !== "" && customWebSite !== "") {
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
  // function handleAlertInput(type) {
  //   if (type === 1) {
  //     setAlerInput1(true);
  //     setAlerInput2(false);
  //   } else {
  //     setAlerInput2(true);
  //     setAlerInput1(false);
  //   }
  // }
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
              // onClick={() => handleAlertInput(1)}
              // isInvalid={
              //   customWebSite.length === 0 && alertInput1 ? true : false
              // }
              // isValid={customWebSite.length > 0 ? true : false}
            />
            {/* <Form.Control.Feedback
              type={customWebSite.length === 0 ? "invalid" : "valid"}
              tooltip={false}
            >
              {`${customWebSite.length} carácteres, Máximo 100 caracteres `}
            </Form.Control.Feedback> */}
            <br />
            <Form.Control
              className="input"
              type="text"
              name="url"
              placeholder="URL Sitio Web"
              value={customUrl}
              ref={customUrlRef}
              onChange={handleOnChangeCustomUrl}
              // onClick={() => handleAlertInput(2)}
              // isInvalid={customUrl.length === 0 && alertInput2 ? true : false}
              // isValid={customUrl.length > 0 ? true : false}
            />
            {/* <Form.Control.Feedback
              type={customUrl.length === 0 ? "invalid" : "valid"}
              tooltip={false}
            >
              {`${customUrl.length} caracteres, Maximo 100 caracteres `}
            </Form.Control.Feedback> */}
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
              disabled={!booleanBoton}
              className="btn-custom"
              type="submit"
              value={nameBoton}
            />
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};
