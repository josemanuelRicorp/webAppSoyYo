import { useEffect, useRef, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import {
  getLinksBySocialMedia,
  insertNewLink,
  updateLink,
} from "../../firebase/firebase";
import { link2FieldsTiktok } from "../../utils/socialMediaFields";
import MessageInputs from "../messageInputs";
import { v4 as uuidv4 } from "uuid";
import { linkTiktok } from "../../utils/socialMediaLinks";

export const FormTikTok = ({ style, user, closeAccordion }) => {
  const [currentUser, setCurrentUser] = useState(user);
  const [tiktokUsername, setTiktokUsername] = useState("");
  const [openTiktok, setOpenTiktok] = useState(false);
  const [tiktokLinkDocId, setTiktokLinkDocId] = useState("");
  const usernameRef = useRef(null);

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
        socialmedia: "tiktok",
        uid: currentUser.uid,
      };
      const res = insertNewLink(newLink);
      newLink.docId = res.id;
      handleMessageConfirmation();
      closeAccordion();
      return newLink.docId;
    }
  }

  function editLink(currentLinkDocId) {
    if (tiktokUsername) {
      const newURL = linkTiktok(tiktokUsername);
      const link = {
        title: "TikTok",
        url: newURL,
        socialmedia: "tiktok",
        uid: currentUser.uid,
      };
      const res = updateLink(currentLinkDocId, link);
      link.docId = res.id;
      handleMessageConfirmation();
      closeAccordion();
    }
  }
  function handleOnSubmitTiktok(e) {
    e.preventDefault();
    e.stopPropagation();
    if (tiktokLinkDocId !== "") {
      editLink(tiktokLinkDocId);
    } else {
      addLink();
    }
  }

  function handleOnChangeTiktokUsername() {
    setTiktokUsername(usernameRef.current.value);
  }
  function handleMessageConfirmation() {
    setOpenTiktok(true);
    setTimeout(() => {
      setOpenTiktok(false);
    }, 3000);
  }
  return (
    <>
      <Form
        className={style}
        autoComplete={"off"}
        onSubmit={handleOnSubmitTiktok}
      >
        {openTiktok ? (
          <MessageInputs
            open={openTiktok}
            type={"success"}
            socialmedia={"Tiktok"}
          ></MessageInputs>
        ) : (
          ""
        )}
        <Form.Group as={Row} className="mb-3">
          <Form.Label column lg="4">
            tiktok.com/
          </Form.Label>
          <Col lg="8">
            <Form.Control
              className="input"
              type="text"
              name="username"
              value={tiktokUsername}
              ref={usernameRef}
              onChange={handleOnChangeTiktokUsername}
              autoComplete="off"
              placeholder="Nombre de usuario"
            />
          </Col>
        </Form.Group>
        <input className="btn-custom" type="submit" value="Guardar datos" />
      </Form>
    </>
  );
};
