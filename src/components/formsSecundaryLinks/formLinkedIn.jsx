import { useEffect, useRef, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import {
  getLinksBySocialMedia,
  insertNewLink,
  updateLink,
} from "../../firebase/firebase";
import { link2FieldsLinkedin } from "../../utils/socialMediaFields";
import { linkLinkedin } from "../../utils/socialMediaLinks";
import MessageInputs from "../messageInputs";
import { v4 as uuidv4 } from "uuid";

export const FormLinkedIn = ({ style, user ,closeAccordion}) => {
  const [currentUser, setCurrentUser] = useState(user);
  const [openLinkedin, setOpenLinkedin] = useState(false);
  const [linkedinLinkDocId, setLinkedinLinkDocId] = useState("");
  const [linkedinUsername, setLinkedinUsername] = useState("");
  const usernameRef = useRef(null);

  useEffect(() => {
    initLinkedin(user.uid);
  }, []);

  async function initLinkedin(uid) {
    const resLinks = await getLinksBySocialMedia(uid, "linkedin");
    if (resLinks.length > 0) {
      const linkObject = [...resLinks][0];
      setLinkedinLinkDocId(linkObject.docId);
      let fieldsData = link2FieldsLinkedin(linkObject.url);
      setLinkedinUsername(fieldsData.username);
    }
  }

  function addLink() {
    if (linkedinUsername !== "") {
      const newURL = linkLinkedin(linkedinUsername);
      const newLink = {
        id: uuidv4(),
        title: "LinkedIn",
        socialmedia: "linkedin",
        url: newURL,
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
    if (linkedinUsername) {
      const newURL = linkLinkedin(linkedinUsername);
      const link = {
        title: "LinkedIn",
        socialmedia: "linkedin",
        url: newURL,
        uid: currentUser.uid,
      };
      const res = updateLink(currentLinkDocId, link);
      link.docId = res.id;
      closeAccordion();
      handleMessageConfirmation();
    }
  }

  function handleOnSubmitLinkedin(e) {
    e.preventDefault();
    e.stopPropagation();
    if (linkedinLinkDocId !== "") {
      editLink(linkedinLinkDocId);
    } else {
      addLink();
    }
  }
  function handleOnChangeLinkedin() {
    setLinkedinUsername(usernameRef.current.value);
  }

  function handleMessageConfirmation() {
    setOpenLinkedin(true);
    setTimeout(() => {
      setOpenLinkedin(false);
    }, 2000);
  }

  return (
    <>
      <Form
        autoComplete={"off"}
        className={style}
        onSubmit={handleOnSubmitLinkedin}
      >
        {openLinkedin ? (
          <MessageInputs
            open={openLinkedin}
            type="success"
            socialmedia="Linkedin"
          ></MessageInputs>
        ) : (
          ""
        )}
        <Form.Group as={Row} className="mb-3">
          <Form.Label column lg="4">
            linkedin.com/
          </Form.Label>
          <Col lg="8">
            <Form.Control
              className="input"
              name="username"
              type="text"
              placeholder="Nombre de usuario"
              value={linkedinUsername}
              ref={usernameRef}
              onChange={handleOnChangeLinkedin}
              autoComplete="off"
            />
          </Col>
        </Form.Group>
        <input className="btn-custom" type="submit" value="Guardar datos" />
      </Form>
    </>
  );
};
