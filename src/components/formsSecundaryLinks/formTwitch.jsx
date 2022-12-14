import { useEffect, useRef, useState } from "react";
import { Col, Form, FormControl, InputGroup, Row } from "react-bootstrap";
import {
  deleteLink,
  deleteLinks,
  getLinksBySocialMedia,
  insertNewLink,
  updateLink,
} from "../../firebase/firebase";
import { linkTwitch } from "../../utils/socialMediaLinks";
import MessageInputs from "../messageInputs";
import { v4 as uuidv4 } from "uuid";
import { link2FieldsTwitch } from "../../utils/socialMediaFields";
import { RiTwitchFill } from "react-icons/ri";
import { ModalTwitch } from "../modals/modalTwitch";
import { BsInfoSquareFill } from "react-icons/bs";
import styles from "../../styles/editProfileView.module.css";







export const FormTwitch = ({ style, user, handleAccordion }) => {
  const [currentUser, setCurrentUser] = useState(user);
  const [twitchUsername, setTwitchUsername] = useState("");
  const [openTwitch, setOpenTwitch] = useState(false);
  const [twitchLinkDocId, setTwitchLinkDocId] = useState("");
  const usernameRef = useRef(null);
  const [removeLink, setRemoveLink] = useState(false);
  const [show, setShow] = useState(false);
  const [alertInput1, setAlerInput1] = useState(false);
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
      initTwitch(currentUser.uid);
      return newLink.docId;
    }
  }

  function editLink(currentLinkDocId) {
    // if (twitchUsername) {
    //   const newURL = linkTwitch(twitchUsername);
    //   const link = {
    //     title: "Twitch",
    //     category: "secondary",
    //     url: newURL,
    //     socialmedia: "twitch",
    //     uid: currentUser.uid,
    //   };
    //   const res = updateLink(currentLinkDocId, link);
    //   link.docId = res.id;
    //  } else {
    //   deleteLink(currentLinkDocId);
    //  }
    console.log("DELETE LINKS", "DENTRO DEL THEN TWITCH");
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
    } else {
      deleteLink(twitchLinkDocId);
    }
  }

  function removeLinkTwitch(currentLinkDocId) {
    if (twitchUsername.replace(" ", "") === "" || /\s/.test(twitchUsername)) {
      deleteLink(currentLinkDocId);
      return;
    }
  }

  function handleOnSubmitTwitch(e) {
    e.preventDefault();
    e.stopPropagation();
    if (twitchUsername.replace(" ", "") === "" || /\s/.test(twitchUsername)) {
      setTwitchUsername("");
      removeLinkTwitch(twitchLinkDocId);
      handleMessageRemoveLink();
    } else if (twitchLinkDocId !== "") {
      editLink(twitchLinkDocId);
      handleMessageConfirmation();
    } else {
      addLink();
      handleMessageConfirmation();
    }
    handleAccordion();
  }
  function handleOnChangeTwitch() {
    if(usernameRef.current.value.length <= 100)
    setTwitchUsername(usernameRef.current.value);
  }

  function handleMessageConfirmation() {
    setOpenTwitch(true);
    setTimeout(() => {
      setOpenTwitch(false);
    }, 2000);
  }
  function handleMessageRemoveLink() {
    setOpenTwitch(true);
    setRemoveLink(true);
    setTimeout(() => {
      setOpenTwitch(false);
    }, 3000);
  }
  function handleOnHide() {
    setShow(false);
  }
  return (
    <>
     <div className="container">
        <h2>
          Datos de tu usuario de Twitch
          <BsInfoSquareFill
            className={styles.btnInfo}
            onClick={() => setShow(true)}
          ></BsInfoSquareFill>
        </h2>
        <ModalTwitch show={show} handleOnHide={handleOnHide}></ModalTwitch>
      </div>
      <Form
        className={style.entryContainer}
        autoComplete={"off"}
        onSubmit={handleOnSubmitTwitch}
      >
        {openTwitch ? (
          <MessageInputs
            open={openTwitch}
            type={removeLink ? "danger" : "success"}
            socialmedia={"Twitch"}
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
                  <RiTwitchFill />{" "}
                </InputGroup.Text>
                <FormControl
                  className="input"
                  name="username"
                  type="text"
                  placeholder="Nombre de usuario"
                  value={twitchUsername}
                  ref={usernameRef}
                  onChange={handleOnChangeTwitch}
                  autoComplete="off"
                  aria-label="Nombre de usuario"
                  onClick = { ()=> setAlerInput1(true)}
                  isInvalid = { twitchUsername.length === 0 && alertInput1 ? true : false}
                  isValid = {twitchUsername.length > 0 ? true : false}
                />
                 <Form.Control.Feedback className="mx-5" type = {twitchUsername.length === 0 ? "invalid" : "valid"} tooltip = { false }>
                 { `${twitchUsername.length} car??cteres, M??ximo 100 car??cteres `}
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
