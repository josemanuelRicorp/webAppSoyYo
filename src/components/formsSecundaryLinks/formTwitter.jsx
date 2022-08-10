import { useEffect, useRef, useState } from "react";
import { Col, Form, FormControl, InputGroup, Row } from "react-bootstrap";
import {
  deleteLink,
  deleteLinks,
  getLinksBySocialMedia,
  insertNewLink,
  updateLink,
} from "../../firebase/firebase";
import { link2FieldsTwitter } from "../../utils/socialMediaFields";
import { linkTwitter } from "../../utils/socialMediaLinks";
import { v4 as uuidv4 } from "uuid";
import MessageInputs from "../messageInputs";
import { BsTwitter } from "react-icons/bs";
import { ModalTwitter } from "../modals/modalTwitter";
import { BsInfoSquareFill } from "react-icons/bs";
import styles from "../../styles/editProfileView.module.css";

export const FormTwitter = ({ style, user, handleAccordion }) => {
  const [currentUser, setCurrentUser] = useState(user);
  const [twitterUsername, setTwitterUsername] = useState("");
  const [openTwitter, setOpenTwitter] = useState(false);
  const [twitterLinkDocId, setTwitterLinkDocId] = useState("");
  const usernameRef = useRef(null);
  const [removeLink, setRemoveLink] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    initTwitter(user.uid);
  }, []);
  async function initTwitter(uid) {
    const resLinks = await getLinksBySocialMedia(uid, "twitter");
    if (resLinks.length > 0) {
      const linkObject = [...resLinks][0];
      setTwitterLinkDocId(linkObject.docId);
      let fieldsData = link2FieldsTwitter(linkObject.url);
      setTwitterUsername(fieldsData.username);
    }
  }

  function addLink() {
    if (twitterUsername !== "") {
      const newURL = linkTwitter(twitterUsername);
      const newLink = {
        id: uuidv4(),
        title: "Twitter",
        category: "secondary",
        socialmedia: "twitter",
        url: newURL,
        uid: currentUser.uid,
      };
      const res = insertNewLink(newLink);
      newLink.docId = res.id;
      initTwitter(currentUser.uid);
      return newLink.docId;
    }
  }

  function editLink(currentLinkDocId) {
    console.log("DELETE LINKS", "DENTRO DEL THEN TWITTER");
    if (twitterUsername) {
      const newURL = linkTwitter(twitterUsername);
      const link = {
        title: "Twitter",
        category: "secondary",
        socialmedia: "twitter",
        url: newURL,
        uid: currentUser.uid,
      };
      const res = updateLink(currentLinkDocId, link);
      link.docId = res.id;
    } else {
      deleteLink(twitterLinkDocId);
    }
  }

  function removeLinkLinkdin(currentLinkDocId) {
 if (twitterUsername.replace(" ", "") === "" || /\s/.test(twitterUsername)) {
         deleteLink(currentLinkDocId);
      return;
    }
  }


  function handleOnSubmitTwitter(e) {
    e.preventDefault();
    e.stopPropagation();
    if (twitterUsername.replace(" ", "") === "" || /\s/.test(twitterUsername)) {
      setTwitterUsername("");
      removeLinkLinkdin(twitterLinkDocId)
      handleMessageRemoveLink();
    }else if (twitterLinkDocId !== "") {
      editLink(twitterLinkDocId);
      handleMessageConfirmation();
    } else {
      addLink();
      handleMessageConfirmation();
    }
    handleAccordion();
  }

  function handleMessageConfirmation() {
    setOpenTwitter(true);
    setRemoveLink(false);
    setTimeout(() => {
      setOpenTwitter(false);
    }, 3000);
  }
  function handleMessageRemoveLink() {
    setOpenTwitter(true);
    setRemoveLink(true)
    setTimeout(() => {
      setOpenTwitter(false);
    }, 3000);
  }
  function handleOnChangeTwitterUsername() {
    setTwitterUsername(usernameRef.current.value);
  }
  function handleOnHide() {
    setShow(false);
  }
  return (
    <>
     <div className="container">
        <h2>
          Datos de tu usuario de Twitter
          <BsInfoSquareFill
            className={styles.btnInfo}
            onClick={() => setShow(true)}
          ></BsInfoSquareFill>
        </h2>
        <ModalTwitter show={show} handleOnHide={handleOnHide}></ModalTwitter>
      </div>
      <Form
        className={style}
        autoComplete={"off"}
        onSubmit={handleOnSubmitTwitter}
      >
        {openTwitter ? (
          <MessageInputs
          open={openTwitter}
          type={removeLink ? "danger" : "success"}
          socialmedia={"Twitter"}
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
                  <BsTwitter />{" "}
                </InputGroup.Text>
                <FormControl
                  className="input"
                  name="username"
                  type="text"
                  placeholder="Nombre de usuario"
                  value={twitterUsername}
                  ref={usernameRef}
                  onChange={handleOnChangeTwitterUsername}
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
