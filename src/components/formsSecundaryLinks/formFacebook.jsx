import { useEffect, useRef, useState } from "react";
import { Col, Form, FormControl, InputGroup, Row } from "react-bootstrap";
import {
  deleteLink,
  getLinksBySocialMedia,
  insertNewLink,
  updateLink,
} from "../../firebase/firebase";
import { link2FieldsFacebook } from "../../utils/socialMediaFields";
import { linkFacebook } from "../../utils/socialMediaLinks";
import MessageInputs from "../messageInputs";
import { v4 as uuidv4 } from "uuid";
import { FaFacebookF } from "react-icons/fa";
import { ModalFacebook } from "../modals/modalFacebook";
import { BsInfoSquareFill } from "react-icons/bs";
import styles from "../../styles/editProfileView.module.css";

export const FormFacebook = ({ style, user, handleAccordion }) => {
  const [currentUser, setCurrentUser] = useState(user);
  const [show, setShow] = useState(false);
  const [facebookUsername, setFacebookUsername] = useState("");
  const [openFacebook, setOpenFacebook] = useState(false);
  const [facebookLinkDocId, setFacebookLinkDocId] = useState("");
  const usernameRef = useRef(null);
  const [removeLink, setRemoveLink] = useState(false);
  const [alertInput1, setAlerInput1] = useState(false);

  useEffect(() => {
    initFacebook(user.uid);
  }, []);

  async function initFacebook(uid) {
    const resLinks = await getLinksBySocialMedia(uid, "facebook");
    if (resLinks.length > 0) {
      const linkObject = [...resLinks][0];
      setFacebookLinkDocId(linkObject.docId);
      let fieldsData = link2FieldsFacebook(linkObject.url);
      setFacebookUsername(fieldsData.username);
    }
  }
  function addLink() {
    if (facebookUsername !== "") {
      const newURL = linkFacebook(facebookUsername);
      const newLink = {
        id: uuidv4(),
        title: "Facebook",
        category: "secondary",
        socialmedia: "facebook",
        url: newURL,
        uid: currentUser.uid,
      };
      const res = insertNewLink(newLink);
      newLink.docId = res.id;
      initFacebook(currentUser.uid);
      return newLink.docId;
    }
  }

  function editLink(currentLinkDocId) {
    console.log("DELETE LINKS", "DENTRO DEL THEN FACEBOOK");
    if (facebookUsername) {
      const newURL = linkFacebook(facebookUsername);
      const link = {
        title: "Facebook",
        category: "secondary",
        socialmedia: "facebook",
        url: newURL,
        uid: currentUser.uid,
      };
      const res = updateLink(currentLinkDocId, link);
      link.docId = res.id;
    } else {
      deleteLink(facebookLinkDocId);
    }
  }

  function removeLinkFacebook(currentLinkDocId) {
    if (
      facebookUsername.replace(" ", "") === "" ||
      /\s/.test(facebookUsername)
    ) {
      deleteLink(currentLinkDocId);
      return;
    }
  }

  function handleOnSubmitFacebook(e) {
    e.preventDefault();
    e.stopPropagation();
    if (
      facebookUsername.replace(" ", "") === "" ||
      /\s/.test(facebookUsername)
    ) {
      setFacebookUsername("");
      removeLinkFacebook(facebookLinkDocId);
      handleMessageRemoveLink();
    } else if (facebookLinkDocId !== "") {
      editLink(facebookLinkDocId);
      handleMessageConfirmation();
    } else {
      addLink();
      handleMessageConfirmation();
    }
    handleAccordion();
  }
  function onChangeFacebookUsername() {
    if (usernameRef.current.value.length <= 100)
      setFacebookUsername(usernameRef.current.value);
  }
  function handleMessageConfirmation() {
    setOpenFacebook(true);
    setRemoveLink(false);
    setTimeout(() => {
      setOpenFacebook(false);
    }, 3000);
  }
  function handleMessageRemoveLink() {
    setOpenFacebook(true);
    setRemoveLink(true);
    setTimeout(() => {
      setOpenFacebook(false);
    }, 3000);
  }
  function handleOnHide() {
    setShow(false);
  }
  return (
    <>
      <div className="container">
        <h2>
          Datos de tu usuario de Facebook
          <BsInfoSquareFill
            className={styles.btnInfo}
            onClick={() => setShow(true)}
          ></BsInfoSquareFill>
        </h2>
        <ModalFacebook show={show} handleOnHide={handleOnHide}></ModalFacebook>
      </div>
      <Form
        autoComplete={"off"}
        className={style}
        onSubmit={handleOnSubmitFacebook}
      >
        {openFacebook ? (
          <MessageInputs
            open={openFacebook}
            type={removeLink ? "danger" : "success"}
            socialmedia="Facebook"
          ></MessageInputs>
        ) : (
          ""
        )}

        <Row>
          <Col md={7} lg={8} className="mt-2">
            <Form.Group>
              <InputGroup>
                <InputGroup.Text id="btnGroupAddon">
                  {" "}
                  <FaFacebookF />{" "}
                </InputGroup.Text>
                <FormControl
                  className="input"
                  name="username"
                  type="text"
                  placeholder="Nombre de usuario"
                  aria-label="Nombre de usuario"
                  value={facebookUsername}
                  ref={usernameRef}
                  onChange={onChangeFacebookUsername}
                  autoComplete="off"
                  onClick = { ()=> setAlerInput1(true)}
                  isInvalid = { facebookUsername.length === 0 && alertInput1 ? true : false}
                  
                  isValid={facebookUsername.length > 0 ? true : false}
                />
                <Form.Control.Feedback
                  className="mx-5"
                  type={facebookUsername.length === 0 ? "invalid" : "valid"}
                  tooltip={false}
                >
                  { `${facebookUsername.length} car??cteres, M??ximo 100 car??cteres `}
                    
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
          </Col>
          <Col md className="mt-2">
            <input
              className="btn-custom"
              type="submit"
              value="Guardar datos"
              style={{ width: "100%" }}
            />
          </Col>
        </Row>
      </Form>
    </>
  );
};
