import { useEffect, useRef, useState } from "react";
import { Col, Form, FormControl, InputGroup, Row } from "react-bootstrap";
import {
  getLinksBySocialMedia,
  insertNewLink,
  updateLink,
} from "../../firebase/firebase";
import { link2FieldsTwitter } from "../../utils/socialMediaFields";
import { linkTwitter } from "../../utils/socialMediaLinks";
import { v4 as uuidv4 } from "uuid";
import MessageInputs from "../messageInputs";
import {  BsTwitter } from "react-icons/bs";

export const FormTwitter = ({ style, user, handleAccordion }) => {
  const [currentUser, setCurrentUser] = useState({});
  const [twitterUsername, setTwitterUsername] = useState("");
  const [openTwitter, setOpenTwitter] = useState(false);
  const [twitterLinkDocId, setTwitterLinkDocId] = useState("");
  const usernameRef = useRef(null);

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

        url: newURL,
        socialmedia: "twitter",
        uid: currentUser.uid,
      };
      const res = insertNewLink(newLink);
      newLink.docId = res.id;
    }
  }

  function editLink(currentLinkDocId) {
    if (twitterUsername) {
      const newURL = linkTwitter(twitterUsername);
      const link = {
        title: "Twitter",
        category: "secondary",

        url: newURL,
        socialmedia: "twitter",
        uid: currentUser.uid,
      };
      const res = updateLink(currentLinkDocId, link);
      link.docId = res.id;
    }
  }

  function handleOnSubmitTwitter(e) {
    e.preventDefault();
    e.stopPropagation();
    if (twitterLinkDocId !== "") {
      editLink(twitterLinkDocId);
    } else {
      addLink();
    }
    handleMessageConfirmation();
    handleAccordion();
  }

  function handleMessageConfirmation() {
    setOpenTwitter(true);
    setTimeout(() => {
      setOpenTwitter(false);
    }, 2000);
  }
  function handleOnChangeTiktokUsername() {
    setTwitterUsername(usernameRef.current.value);
  }

  return (
    <>
      <Form
        className={style}
        autoComplete={"off"}
        onSubmit={handleOnSubmitTwitter}
      >
          <h2>Datos de tu usuario de Twitter</h2>
        {openTwitter ? (
          <MessageInputs
            open={openTwitter}
            type={"success"}
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
                  onChange={handleOnChangeTiktokUsername}
                   autoComplete="off"
                  aria-label="Nombre de usuario"
                />
              </InputGroup>
            </Form.Group>
          </Col>
          <Col md className="mt-2">
            <input className="btn-custom" type="submit" value="Guardar datos" style={{width:"100%"}} />
          </Col>
        </Row>
      
      </Form>
    </>
  );
};
