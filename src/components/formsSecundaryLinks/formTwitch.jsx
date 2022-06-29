import { useEffect, useRef, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import {
  getLinksBySocialMedia,
  insertNewLink,
  updateLink,
} from "../../firebase/firebase";
import { linkTwitch } from "../../utils/socialMediaLinks";
import MessageInputs from "../messageInputs";
import { v4 as uuidv4 } from "uuid";
import { link2FieldsTwitch } from "../../utils/socialMediaFields";

export const FormTwitch = ({ style, user,handleAccordion }) => {
  const [currentUser, setCurrentUser] = useState(user);
  
  const [twitchUsername, setTwitchUsername] = useState("");
  const [openTwitch, setOpenTwitch] = useState(false);
  const [twitchLinkDocId, setTwitchLinkDocId] = useState("");
  const usernameRef = useRef(null);

  useEffect(() => {
    initTwitch(user.uid);
  }, []);
  async function initTwitch(uid) {
    const resLinks = await getLinksBySocialMedia(uid, "twitch");
    if (resLinks.length > 0) {
      const linkObject = [...resLinks][0];
      setTwitchLinkDocId(linkObject.docId);
      let fieldsData = link2FieldsTwitch(linkObject.url);
      setTwitchUsername(fieldsData.username);
    }
  }

  function addLink() {
    if (twitchUsername !== "") {
      const newURL = linkTwitch(twitchUsername);
      const newLink = {
        id: uuidv4(),
        title: "Twitch",
        category: "secondary",

        url: newURL,
        socialmedia: "twitch",
        uid: currentUser.uid,
      };
      const res = insertNewLink(newLink);
      newLink.docId = res.id;
      }
  }

  function editLink(currentLinkDocId) {
    if (twitchUsername) {
      const newURL = linkTwitch(twitchUsername);
      const link = {
        title: "Twitch",
        category: "secondary",

        url: newURL,
        socialmedia: "twitch",
        uid: currentUser.uid,
      };
      const res = updateLink(currentLinkDocId, link);
      link.docId = res.id;
     }
  }
  function handleOnSubmitTwitch(e) {
    e.preventDefault();
    e.stopPropagation();
    if (twitchLinkDocId !== "") {
      editLink(twitchLinkDocId);
    } else {
      addLink();
    }
    handleMessageConfirmation();
    handleAccordion();
    
  }
  function handleOnChangeTwitch() {
    setTwitchUsername(usernameRef.current.value);
  }

  function handleMessageConfirmation() {
    setOpenTwitch(true);
    setTimeout(() => {
      setOpenTwitch(false);
    }, 2000);
  }

  return (
    <>
      <Form
        className={style.entryContainer}
        autoComplete={"off"}
        onSubmit={handleOnSubmitTwitch}
      >
        {openTwitch ? (
          <MessageInputs
            open={openTwitch}
            type={"success"}
            socialmedia={"Twitch"}
          ></MessageInputs>
        ) : (
          ""
        )}

        <Form.Group as={Row} className="mb-3">
          <Form.Label column lg="4">
            twitch.tv/
          </Form.Label>
          <Col lg="8">
            <Form.Control
              className="input"
              type="text"
              name="username"
              value={twitchUsername}
              ref={usernameRef}
              onChange={handleOnChangeTwitch}
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
