import { useEffect, useRef, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { linkWhatsApp } from "../../utils/socialMediaLinks";
import MessageInputs from "../messageInputs";
import { v4 as uuidv4 } from "uuid";
import {
  getLinksBySocialMedia,
  insertNewLink,
  updateLink,
} from "../../firebase/firebase";
import { link2FieldsWhatsapp } from "../../utils/socialMediaFields";

export const FormWhatsapp = ({ style, user , handleAccordion }) => {
  const [openWhatsApp, setOpenWhatsApp] = useState(false);
  const [whatsappLinkDocId, setWhatsappLinkDocId] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [whatsappMsg, setWhatsappMsg] = useState("");
  const whatsappNumberRef = useRef(null);
  const whatsappMsgRef = useRef(null);
  const [currentUser, setCurrentUser] = useState(user);

  useEffect(() => {
    initWhatsAppInfo(user.uid);
  }, []);

  async function initWhatsAppInfo(uid) {
    const resLinksWhatsapp = await getLinksBySocialMedia(uid, "whatsapp");
    if (resLinksWhatsapp.length > 0) {
      const linkObject = [...resLinksWhatsapp][0];
      
      setWhatsappLinkDocId(linkObject.docId);
      let fieldsData = link2FieldsWhatsapp(linkObject.url);
      setWhatsappNumber(fieldsData.phone);
      setWhatsappMsg(fieldsData.msg);
    }
  }

  function addLink() {
    if (whatsappNumber!== "") {
      const newURL=linkWhatsApp(whatsappNumber, whatsappMsg);
      const newLink = {
        id: uuidv4(),
        title: "WhatsApp",
        socialmedia: "whatsapp",
        url: newURL,
        uid: currentUser.uid,
      };
      const res = insertNewLink(newLink);
      newLink.docId = res.id;
      return newLink.docId;
    }
  }

  function editLink(currentLinkDocId) {
    if (whatsappNumber) {
      const newURL = linkWhatsApp(whatsappNumber, whatsappMsg);
      const link = {
        title: "WhatsApp",
        socialmedia: "whatsapp",
        url: newURL,
        uid: currentUser.uid,
      };
      const res = updateLink(currentLinkDocId, link);
      link.docId = res.id;
    }
  }

  const handleOnSubmitWhatsapp = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (whatsappLinkDocId !== "") {
      console.log("actualizar link");
      editLink(whatsappLinkDocId);
    } else {
      console.log("agregar link");
      addLink();
    }
    handleMessageConfirmation();
    handleAccordion();
  };
  function handleOnChangeWhatsAppNumber() {
    setWhatsappNumber(whatsappNumberRef.current.value);
  }
  function handleOnChangeWhatsAppMsg() {
    setWhatsappMsg(whatsappMsgRef.current.value);
  }

  function handleMessageConfirmation() {
    setOpenWhatsApp( true);
    setTimeout(() => {
      setOpenWhatsApp( false);
    }, 3000);
  }
 

  return (
    <>
      <Form className={style} onSubmit={handleOnSubmitWhatsapp}>
        {openWhatsApp ? (
          <MessageInputs
            open={openWhatsApp}
            type={"success"}
            socialmedia={"WhatsApp"}
          ></MessageInputs>
        ) : (
          ""
        )}
        <h2>WhatsApp</h2>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column lg="4">
            Número telefónico:
          </Form.Label>
          <Col lg="8">
            <Form.Control
              className="input"
              type="text"
              name="number"
              value={whatsappNumber}
              ref={whatsappNumberRef}
              onChange={handleOnChangeWhatsAppNumber}
              autoComplete="off"
              placeholder="70000000"
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
          <Form.Label column lg="4">
            Mensaje:
          </Form.Label>
          <Col lg="8">
            <Form.Control
              className="input"
              type="text"
              name="msg"
              autoComplete="off"
              placeholder="Escribe tu mensaje"
              value={whatsappMsg}
              ref={whatsappMsgRef}
              onChange={handleOnChangeWhatsAppMsg}
            />
          </Col>
        </Form.Group>
        <input className="btn-custom" type="submit" value="Guardar datos" />
      </Form>
    </>
  );
};
