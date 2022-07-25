import { useEffect, useRef, useState } from "react";
import { Col, Form, FormControl, InputGroup, Row } from "react-bootstrap";
import {
  getLinksBySocialMedia,
  insertNewLink,
  updateLink,
} from "../../firebase/firebase";
import { link2FieldsFacebook } from "../../utils/socialMediaFields";
import { linkFacebook } from "../../utils/socialMediaLinks";
import MessageInputs from "../messageInputs";
import { v4 as uuidv4 } from "uuid";
import { FaFacebookF } from "react-icons/fa";
export const FormFacebook = ({ style, user, handleAccordion }) => {
  const [currentUser, setCurrentUser] = useState(user);

  const [facebookUsername, setFacebookUsername] = useState("");
  const [openFacebook, setOpenFacebook] = useState(false);
  const [facebookLinkDocId, setFacebookLinkDocId] = useState("");
  const usernameRef = useRef(null);

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
      return newLink.docId;
    }
  }

  function editLink(currentLinkDocId) {
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
    }
  }
  function handleOnSubmitFacebook(e) {
    e.preventDefault();
    e.stopPropagation();
    if (facebookLinkDocId !== "") {
      editLink(facebookLinkDocId);
    } else {
      addLink();
    }
    handleMessageConfirmation();
    handleAccordion();
  }
  function onChangeFacebookUsername() {
    setFacebookUsername(usernameRef.current.value);
  }
  function handleMessageConfirmation() {
    setOpenFacebook(true);
    setTimeout(() => {
      setOpenFacebook(false);
    }, 3000);
  }
  return (
    <>
      <Form
        autoComplete={"off"}
        className={style}
        onSubmit={handleOnSubmitFacebook}
      >
        <h2>Datos de tu usuario de Facebook</h2>
        {openFacebook ? (
          <MessageInputs
            open={openFacebook}
            type="success"
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
