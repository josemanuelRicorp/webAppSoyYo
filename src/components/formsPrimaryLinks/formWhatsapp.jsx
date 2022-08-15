import { useEffect, useRef, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { linkWhatsApp } from "../../utils/socialMediaLinks";
import MessageInputs from "../messageInputs";
import { v4 as uuidv4 } from "uuid";
import {
  deleteLink,
  getLinksBySocialMedia,
  insertNewLink,
  updateLink,
} from "../../firebase/firebase";
import { link2FieldsWhatsapp } from "../../utils/socialMediaFields";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
export const FormWhatsapp = ({ style, user, handleAccordion }) => {
  const [openWhatsApp, setOpenWhatsApp] = useState(false);
  const [whatsappLinkDocId, setWhatsappLinkDocId] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [whatsappMsg, setWhatsappMsg] = useState("");
  const whatsappNumberRef = useRef(null);
  const whatsappMsgRef = useRef(null);
  const [currentUser, setCurrentUser] = useState(user);
  const [alertInput1, setAlerInput1] = useState(false);
  const [removeLink, setRemoveLink] = useState(false);
  useEffect(() => {
    initWhatsAppInfo(user.uid);
    console.log(
      "🚀 ~ file: formWhatsapp.jsx ~ line 26 ~ FormWhatsapp ~ whatsappLinkDocId",
      whatsappLinkDocId
    );
  }, [whatsappLinkDocId]);

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
    if (whatsappNumber !== "") {
      const newURL = linkWhatsApp(whatsappNumber, whatsappMsg);
      const newLink = {
        id: uuidv4(),
        title: "WhatsApp",
        category: "primary",
        socialmedia: "whatsapp",
        url: newURL,
        uid: currentUser.uid,
      };
      const res = insertNewLink(newLink);
      newLink.docId = res.id;
      initWhatsAppInfo(currentUser.uid);
      return newLink.docId;
    }
  }

  function editLink(currentLinkDocId) {
    if (whatsappNumber) {
      const newURL = linkWhatsApp(whatsappNumber, whatsappMsg);
      const link = {
        title: "WhatsApp",
        socialmedia: "whatsapp",
        category: "primary",
        url: newURL,
        uid: currentUser.uid,
      };
      const res = updateLink(currentLinkDocId, link);
      link.docId = res.id;
      initWhatsAppInfo(user.uid);
    } else {
      deleteLink(whatsappLinkDocId);
    }
  }
  function removeLinkWhatsapp(currentLinkDocId) {
    if (whatsappNumber.replace(" ", "") === "" || /\s/.test(whatsappNumber)) {
      deleteLink(currentLinkDocId);
      return;
    }
  }
  const handleOnSubmitWhatsapp = (e) => {
    e.preventDefault();
    e.stopPropagation();
      if (whatsappNumber.replace(" ", "") === "" || /\s/.test(whatsappNumber)) {
        setWhatsappNumber("");
        removeLinkWhatsapp(whatsappLinkDocId);
        handleMessageRemoveLink();
      } else if (whatsappLinkDocId !== "") {
        editLink(whatsappLinkDocId);
        handleMessageConfirmation();
      } else {
        addLink();
        handleMessageConfirmation();
      }
      handleAccordion();
  }

  function handleOnChangeWhatsAppNumber() {
    setWhatsappNumber(whatsappNumberRef.current.value);
  }
  function handleOnChangeWhatsAppMsg() {
    if (whatsappMsgRef.current.value.length <= 100)
      setWhatsappMsg(whatsappMsgRef.current.value);
  }

  function handleMessageConfirmation() {
    setOpenWhatsApp(true);
    setRemoveLink(false);
    setTimeout(() => {
      setOpenWhatsApp(false);
    }, 3000);
  }
  function handleMessageRemoveLink() {
    setOpenWhatsApp(true);
    setRemoveLink(true);
    setTimeout(() => {
      setOpenWhatsApp(false);
    }, 3000);
  }

  return (
    <>
      <Form className={style} onSubmit={handleOnSubmitWhatsapp}>
        {openWhatsApp ? (
          <MessageInputs
            open={openWhatsApp}
            type={removeLink ? "danger" : "success"}
            socialmedia={"WhatsApp"}
          ></MessageInputs>
        ) : (
          ""
        )}
        <h2>Datos para el enlace de tu WhatsApp</h2>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column lg="4">
            Número telefónico:
          </Form.Label>
          {/* <Col lg="8">
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
          </Col> */}
          <Col lg="1">
            <PhoneInput
              placeholder="ingrese un número telefonico"
              value={whatsappNumber}
              onChange={setWhatsappNumber}
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
              onClick={() => setAlerInput1(true)}
              isInvalid={whatsappMsg.length === 0 && alertInput1 ? true : false}
              isValid={whatsappMsg.length > 0 ? true : false}
            />
            <Form.Control.Feedback
              type={whatsappMsg.length === 0 ? "invalid" : "valid"}
              tooltip={false}
            >
              {`${whatsappMsg.length} carácteres, Máximo 100 carácteres `}
            </Form.Control.Feedback>
          </Col>
        </Form.Group>
        <input className="btn-custom" type="submit" value="Guardar datos" />
      </Form>
    </>
  );
};
