import { useEffect, useRef, useState } from "react";
import { Col, Form, FormControl, InputGroup, Row } from "react-bootstrap";
import {
  deleteLink,
  getLinksBySocialMedia,
  insertNewLink,
  updateLink,
} from "../../firebase/firebase";
import { link2FieldsLinkedin } from "../../utils/socialMediaFields";
import { linkLinkedin } from "../../utils/socialMediaLinks";
import MessageInputs from "../messageInputs";
import { v4 as uuidv4 } from "uuid";
import { RiLinkedinFill } from "react-icons/ri";
import { ModalLinkedin } from "../modals/modalLinkedin";
import { BsInfoSquareFill } from "react-icons/bs";
import styles from "../../styles/editProfileView.module.css";

export const FormLinkedIn = ({ style, user, handleAccordion }) => {
  const [currentUser, setCurrentUser] = useState(user);
  const [openLinkedin, setOpenLinkedin] = useState(false);
  const [linkedinLinkDocId, setLinkedinLinkDocId] = useState("");
  const [linkedinUsername, setLinkedinUsername] = useState("");
  const usernameRef = useRef(null);
  const [removeLink, setRemoveLink] = useState(false);
  const [show, setShow] = useState(false);
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
        category: "secondary",
        url: newURL,
        uid: currentUser.uid,
      };
      const res = insertNewLink(newLink);
      newLink.docId = res.id;
      initLinkedin(currentUser.uid);
      return newLink.docId;
    }
  }

  function editLink(currentLinkDocId) {
    // if (linkedinUsername) {
    //   const newURL = linkLinkedin(linkedinUsername);
    //   const link = {
    //     title: "LinkedIn",
    //     socialmedia: "linkedin",
    //     category: "secondary",
    //     url: newURL,
    //     uid: currentUser.uid,
    //   };
    //   const res = updateLink(currentLinkDocId, link);
    //   link.docId = res.id;
    // }
    console.log("DELETE LINKS", "DENTRO DEL THEN LINKEDIN");
    if (linkedinUsername) {
      const newURL = linkLinkedin(linkedinUsername);
      const link = {
        title: "LinkedIn",
        socialmedia: "linkedin",
        category: "secondary",
        url: newURL,
        uid: currentUser.uid,
      };
      const res = updateLink(currentLinkDocId, link);
      link.docId = res.id;
    } else {
      deleteLink(linkedinLinkDocId);
    }
  }
  function removeLinkeLinkdin(currentLinkDocId) {
    if (
      linkedinUsername.replace(" ", "") === "" ||
      /\s/.test(linkedinUsername)
    ) {
      deleteLink(currentLinkDocId);
      return;
    }
  }

  function handleOnSubmitLinkedin(e) {
    e.preventDefault();
    e.stopPropagation();
    if (
      linkedinUsername.replace(" ", "") === "" ||
      /\s/.test(linkedinUsername)
    ) {
      setLinkedinUsername("");
      removeLinkeLinkdin(linkedinLinkDocId);
      handleMessageRemoveLink();
    } else if (linkedinLinkDocId !== "") {
      editLink(linkedinLinkDocId);
      handleMessageConfirmation();
    } else {
      addLink();
      handleMessageConfirmation();
    }
    handleAccordion();
  }
  function handleOnChangeLinkedin() {
    setLinkedinUsername(usernameRef.current.value);
  }

  function handleMessageConfirmation() {
    setOpenLinkedin(true);
    setRemoveLink(false);
    setTimeout(() => {
      setOpenLinkedin(false);
    },2000);
  }
  function handleMessageRemoveLink() {
    setOpenLinkedin(true);
    setRemoveLink(true);
    setTimeout(() => {
      setOpenLinkedin(false);
    }, 3000);
  }
  function handleOnHide() {
    setShow(false);
  }
  return (
    <>
     <div className="container">
        <h2>
          Datos de tu usuario de LinkedIn
          <BsInfoSquareFill
            className={styles.btnInfo}
            onClick={() => setShow(true)}
          ></BsInfoSquareFill>
        </h2>
        <ModalLinkedin show={show} handleOnHide={handleOnHide}></ModalLinkedin>
      </div>
      <Form
        autoComplete={"off"}
        className={style}
        onSubmit={handleOnSubmitLinkedin}
      >
        {openLinkedin ? (
          <MessageInputs
            open={openLinkedin}
            type={removeLink ? "danger" : "success"}
            socialmedia="Linkedin"
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
                  <RiLinkedinFill />{" "}
                </InputGroup.Text>
                <FormControl
                  className="input"
                  name="username"
                  type="text"
                  placeholder="Nombre de usuario"
                  value={linkedinUsername}
                  ref={usernameRef}
                  onChange={handleOnChangeLinkedin}
                  autoComplete="off"
                  aria-label="Nombre de usuario"
                />
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
