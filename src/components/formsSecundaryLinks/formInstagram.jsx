import { useEffect, useRef, useState } from "react";
import { Col, Form, FormControl, InputGroup, Row } from "react-bootstrap";
import {
  deleteLinks,
  deleteLink,
  getLinksBySocialMedia,
  insertNewLink,
  updateLink,
} from "../../firebase/firebase";
import { link2FieldsInstagram } from "../../utils/socialMediaFields";
import { linkInstagram } from "../../utils/socialMediaLinks";
import MessageInputs from "../messageInputs";
import { v4 as uuidv4 } from "uuid";
import { RiInstagramFill } from "react-icons/ri";
import { ModalInstagram } from "../modals/modalInstagram";
import { BsInfoSquareFill } from "react-icons/bs";
import styles from "../../styles/editProfileView.module.css";



export const FormInstagram = ({ style, user, handleAccordion }) => {
  const [currentUser, setCurrentUser] = useState(user);
  const [instagramUsername, setInstagramUsername] = useState("");
  const [openInstagram, setOpenInstagram] = useState(false);
  const [instagramLinkDocId, setInstagramLinkDocId] = useState("");
  const usernameRef = useRef(null);
  const [removeLink, setRemoveLink] = useState(false);
  const [show, setShow] = useState(false);
  useEffect(() => {
    initInstagram(user.uid);
  }, []);

  async function initInstagram(uid) {
    // const resLinks = await getLinksBySocialMedia(uid, "instagram");
    // if (resLinks.length > 0) {
    //   const linkObject = [...resLinks][0];

    //   setInstagramLinkDocId(linkObject.docId);
    //   let fieldsData = link2FieldsInstagram(linkObject.url);
    //   setInstagramUsername(fieldsData.username);
    // }
    getLinksBySocialMedia(uid, "instagram").then((resLinks) => {
      if (resLinks.length > 0) {
        const linkObject = [...resLinks][0];
        setInstagramLinkDocId(linkObject.docId);
        let fieldsData = link2FieldsInstagram(linkObject.url);
        setInstagramUsername(fieldsData.username);
      }
    })
  }
  function addLink() {
    if (instagramUsername !== "") {
      const newURL = linkInstagram(instagramUsername);
      const newLink = {
        id: uuidv4(),
        title: "Instagram",
        category: "secondary",
        url: newURL,
        socialmedia: "instagram",
        uid: currentUser.uid,
      };
      const res = insertNewLink(newLink);
      newLink.docId = res.id;
      initInstagram(currentUser.uid)
      return newLink.docId;
    }
  }

  function editLink(currentLinkDocId) {
    console.log('DELETE', "DENTTRO DE INSTAGRAM")
    if (instagramUsername) {
      const newURL = linkInstagram(instagramUsername);
      const link = {
        title: "Instagram",
        category: "secondary",
        url: newURL,
        socialmedia: "instagram",
        uid: currentUser.uid,
      };
      const res = updateLink(currentLinkDocId, link);
      link.docId = res.id;
    } else {
      deleteLink(instagramLinkDocId);
    }
  }
  
  function removeLinkInstagram(currentLinkDocId) {
    if (instagramUsername.replace(" ","") ==="" || /\s/.test(instagramUsername)) {
      deleteLink(currentLinkDocId);
      return;
    }
  }

  // function handleOnSubmitInstagram(e) {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   if (instagramLinkDocId !== "") {
  //     editLink(instagramLinkDocId);
  //     console.log('instagramLinkDocId', instagramLinkDocId)
  //   } else {
  //     addLink();
  //     console.log('agregar link', "HOLA")
  //   }
  //   handleMessageConfirmation();
  //   handleAccordion();
  // }
  function handleOnSubmitInstagram(e) {
    e.preventDefault();
    e.stopPropagation();
    if(instagramUsername.replace(" ","") ==="" ||  /\s/.test(instagramUsername)){
      setInstagramUsername("");
      removeLinkInstagram(instagramLinkDocId);
      handleMessageRemoveLink();
    }else if (instagramLinkDocId !== "") {
      editLink(instagramLinkDocId);
      handleMessageConfirmation();
    } else {
      addLink();
      handleMessageConfirmation();
    }
    handleAccordion();
  }



  
  function onChangeInstagramUsername() {
    setInstagramUsername(usernameRef.current.value);
  }
  function handleMessageConfirmation() {
    setOpenInstagram(true);
    setRemoveLink(false);
    setTimeout(() => {
      setOpenInstagram(false);
    }, 3000);
  }
  function handleMessageRemoveLink() {
    setOpenInstagram(true);
    setRemoveLink(true)
    setTimeout(() => {
      setOpenInstagram(false);
    }, 3000);
  }
  function handleOnHide() {
    setShow(false);
  }
  return (
    <>
      <div className="container">
        <h2>
          Datos de tu usuario de Instagram
          <BsInfoSquareFill
            className={styles.btnInfo}
            onClick={() => setShow(true)}
          ></BsInfoSquareFill>
        </h2>
        <ModalInstagram
          show={show}
          handleOnHide={handleOnHide}
        ></ModalInstagram>
      </div>
      <Form
        className={style}
        autoComplete={"off"}
        onSubmit={handleOnSubmitInstagram}
      >
        <h2>Datos de tu usuario de Instagram</h2>
        {openInstagram ? (
           <MessageInputs
           open={openInstagram}
           type={removeLink ? "danger" : "success"}
           socialmedia={"Instagram"}
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
                  <RiInstagramFill />{" "}
                </InputGroup.Text>
                <FormControl
                  className="input"
                  name="username"
                  type="text"
                  placeholder="Nombre de usuario"
                  value={instagramUsername}
                  ref={usernameRef}
                  onChange={onChangeInstagramUsername}
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
