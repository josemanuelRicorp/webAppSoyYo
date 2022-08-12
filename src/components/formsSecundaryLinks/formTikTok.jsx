import { useEffect, useRef, useState } from "react";
import { Col, Form, FormControl, InputGroup, Row } from "react-bootstrap";
import {
  deleteLink,
  deleteLinks,
  getLinksBySocialMedia,
  insertNewLink,
  updateLink,
} from "../../firebase/firebase";
import { link2FieldsTiktok } from "../../utils/socialMediaFields";
import MessageInputs from "../messageInputs";
import { v4 as uuidv4 } from "uuid";
import { linkTiktok } from "../../utils/socialMediaLinks";
import { FaTiktok } from "react-icons/fa";
import { ModalTiktok } from "../modals/modalTiktok";
import { BsInfoSquareFill } from "react-icons/bs";
import styles from "../../styles/editProfileView.module.css";
export const FormTikTok = ({ style, user, handleAccordion }) => {
  const [currentUser, setCurrentUser] = useState(user);
  const [tiktokUsername, setTiktokUsername] = useState("");
  const [openTiktok, setOpenTiktok] = useState(false);
  const [tiktokLinkDocId, setTiktokLinkDocId] = useState("");
  const usernameRef = useRef(null);
  const [removeLink, setRemoveLink] = useState(false);
  const [show, setShow] = useState(false);
  const [alertInput1, setAlerInput1] = useState(false);
  useEffect(() => {
    initTiktok(user.uid);
  }, []);
  async function initTiktok(uid) {
    const resLinks = await getLinksBySocialMedia(uid, "tiktok");
    if (resLinks.length > 0) {
      const linkObject = [...resLinks][0];
      setTiktokLinkDocId(linkObject.docId);
      let fieldsData = link2FieldsTiktok(linkObject.url);
      setTiktokUsername(fieldsData.username);
    }
  }
  function addLink() {
    if (tiktokUsername !== "") {
      const newURL = linkTiktok(tiktokUsername);
      const newLink = {
        id: uuidv4(),
        title: "TikTok",
        url: newURL,
        category: "secondary",
        socialmedia: "tiktok",
        uid: currentUser.uid,
      };
      const res = insertNewLink(newLink);
      newLink.docId = res.id;
      initTiktok(currentUser.uid);
      return newLink.docId;
    }
  }

  function editLink(currentLinkDocId) {
    // if (tiktokUsername) {
    //   const newURL = linkTiktok(tiktokUsername);
    //   const link = {
    //     title: "TikTok",
    //     url: newURL,
    //     category: "secondary",
    //     socialmedia: "tiktok",
    //     uid: currentUser.uid,
    //   };
    //   const res = updateLink(currentLinkDocId, link);
    //   link.docId = res.id;
    // } else {
    //   deleteLink(currentLinkDocId);
    // }
    console.log("DELETE LINKS", "DENTRO DEL THEN TIKTOK");
    if (tiktokUsername) {
      const newURL = linkTiktok(tiktokUsername);
      const link = {
        title: "TikTok",
        url: newURL,
        category: "secondary",
        socialmedia: "tiktok",
        uid: currentUser.uid,
      };
      const res = updateLink(currentLinkDocId, link);
      link.docId = res.id;
    } else {
      deleteLink(tiktokLinkDocId);
    }
  }
  function removeLinkTiktok(currentLinkDocId) {
    if (tiktokUsername.replace(" ", "") === "" || /\s/.test(tiktokUsername)) {
      deleteLink(currentLinkDocId);
      return;
    }
  }

  function handleOnSubmitTiktok(e) {
    e.preventDefault();
    e.stopPropagation();
    if (tiktokUsername.replace(" ", "") === "" || /\s/.test(tiktokUsername)) {
      setTiktokUsername("");
      removeLinkTiktok(tiktokLinkDocId);
      handleMessageRemoveLink();
    } else if (tiktokLinkDocId !== "") {
      editLink(tiktokLinkDocId);
      handleMessageConfirmation();
    } else {
      addLink();
      handleMessageConfirmation();
    }
    handleAccordion();
  }

  function handleOnChangeTiktokUsername() {
    if (usernameRef.current.value.length <= 100)
      setTiktokUsername(usernameRef.current.value);
  }
  function handleMessageConfirmation() {
    setOpenTiktok(true);
    setTimeout(() => {
      setOpenTiktok(false);
    }, 3000);
  }
  function handleMessageRemoveLink() {
    setOpenTiktok(true);
    setRemoveLink(true);
    setTimeout(() => {
      setOpenTiktok(false);
    }, 3000);
  }
  function handleOnHide() {
    setShow(false);
  }

  return (
    <>
      <div className="container">
        <h2>
          Datos de tu usuario de TikTok
          <BsInfoSquareFill
            className={styles.btnInfo}
            onClick={() => setShow(true)}
          ></BsInfoSquareFill>
        </h2>
        <ModalTiktok show={show} handleOnHide={handleOnHide}></ModalTiktok>
      </div>
      <Form
        className={style}
        autoComplete={"off"}
        onSubmit={handleOnSubmitTiktok}
      >
        {openTiktok ? (
          <MessageInputs
            open={openTiktok}
            type={removeLink ? "danger" : "success"}
            socialmedia={"Tiktok"}
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
                  <FaTiktok />{" "}
                </InputGroup.Text>
                <FormControl
                  className="input"
                  name="username"
                  type="text"
                  placeholder="Nombre de usuario"
                  value={tiktokUsername}
                  ref={usernameRef}
                  onChange={handleOnChangeTiktokUsername}
                  autoComplete="off"
                  aria-label="Nombre de usuario"
                  onClick={() => setAlerInput1(true)}
                  isInvalid={
                    tiktokUsername.length === 0 && alertInput1 ? true : false
                  }
                  isValid={tiktokUsername.length > 0 ? true : false}
                />
                <Form.Control.Feedback
                  className="mx-5"
                  type={
                    tiktokUsername.length === 0 && alertInput1
                      ? "invalid"
                      : "valid"
                  }
                  tooltip={false}
                >
                  {`${tiktokUsername.length} carácteres, Máximo 100 carácteres `}
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
