import { useEffect, useRef, useState } from "react";
import {
  getLinksBySocialMedia,
  insertNewLink,
  updateLink,
} from "../../firebase/firebase";
import { link2FieldsEmail } from "../../utils/socialMediaFields";
import { linkEmail } from "../../utils/socialMediaLinks";
import { v4 as uuidv4 } from "uuid";
import MessageInputs from "../messageInputs";
import { Col, Form, Row, Spinner } from "react-bootstrap";

export const FormEmail = ({ style, user, handleAccordion }) => {
  const [currentUser, setCurrentUser] = useState(user);
  const [openEmail, setOpenEmail] = useState(false);
  const [state, setState] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);
  const [emailLinkDocId, setEmailLinkDocId] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const emailAddressRef = useRef(null);
  const emailSubjectRef = useRef(null);
  const emailBodyRef = useRef(null);

  useEffect(() => {
    initEmailInfo(user.uid);
  }, []);
  async function initEmailInfo(uid) {
    const resLinksEmail = await getLinksBySocialMedia(uid, "email");
    if (resLinksEmail.length > 0) {
      const linkObject = [...resLinksEmail][0];
      setEmailLinkDocId(linkObject.docId);
      let fieldsData = link2FieldsEmail(linkObject.url);
      setEmailAddress(fieldsData.email);
      setEmailSubject(fieldsData.subject);
      setEmailBody(fieldsData.body);
    }
  }

  function addLink() {
    if (emailAddress !== "") {
      const newURL = linkEmail(emailAddress, emailSubject, emailBody);
      const newLink = {
        id: uuidv4(),
        title: "Email",
        socialmedia: "email",
        category: "primary",
        url: newURL,
        uid: currentUser.uid,
      };
      const res = insertNewLink(newLink);
      newLink.docId = res.id;

      return newLink.docId;
    }
  }

  function editLink(currentLinkDocId) {
    if (emailAddress) {
      const newURL = linkEmail(emailAddress, emailSubject, emailBody);
      const link = {
        title: "E-mail",
        socialmedia: "email",
        category: "primary",
        url: newURL,
        uid: currentUser.uid,
      };
      const res = updateLink(currentLinkDocId, link);
      link.docId = res.id;
    }
  }

  function handleOnSubmitEmail(e) {
    e.preventDefault();
    e.stopPropagation();
    handleButton();
    // if (emailLinkDocId !== "") {
    //   editLink(emailLinkDocId);
    // } else {
    //   addLink();
    // }
    // handleMessageConfirmation();
    // handleAccordion();
  }

  function handleOnChangeEmailAddress() {
    setEmailAddress(emailAddressRef.current.value);
  }
  function handleOnChangeEmailSubject() {
    setEmailSubject(emailSubjectRef.current.value);
  }
  function handleOnChangeEmailBody() {
    setEmailBody(emailBodyRef.current.value);
  }
  function handleButton() {
    setState(11);
    setIsDisabled(true);
    if (emailLinkDocId !== "") {
      editLink(emailLinkDocId);
    } else {
      addLink();
    }
    setTimeout(() => {
      setState(19);
      handleMessageConfirmation();
      handleAccordion();
    }, 2000);
  }
  function handleMessageConfirmation() {
    setOpenEmail(true);
    setState(10);
    setTimeout(() => {
      setState(0);
      setIsDisabled(false);
      setOpenEmail(false);
    }, 2000);
  }

  return (
    <>
      <Form className={style} onSubmit={handleOnSubmitEmail}>
        <h2>Datos para el enlace de tu E-mail</h2>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column lg="4">
            Dirección de correo electrónico
          </Form.Label>
          <Col lg="8">
            <Form.Control
              className="input"
              type="text"
              name="email"
              autoComplete="off"
              placeholder="ejemplo@dominio.extensión"
              value={emailAddress}
              ref={emailAddressRef}
              onChange={handleOnChangeEmailAddress}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
          <Form.Label column lg="4">
            Asunto:
          </Form.Label>
          <Col lg="8">
            <Form.Control
              className="input"
              type="text"
              name="subject"
              autoComplete="off"
              placeholder="Escribe el asunto del correo"
              value={emailSubject}
              ref={emailSubjectRef}
              onChange={handleOnChangeEmailSubject}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
          <Form.Label column lg="4">
            Cuerpo:{" "}
          </Form.Label>
          <Col lg="8">
            <Form.Control
              className="input"
              type="text"
              name="body"
              autoComplete="off"
              placeholder="Escribe el mensaje del correo"
              value={emailBody}
              ref={emailBodyRef}
              onChange={handleOnChangeEmailBody}
            />
          </Col>
        </Form.Group>
        {/* {isDisabled ? ( */}
        {state == 10 ? (
          <button className="btn-custom disabled" disabled type="submit">
            <Spinner
              className="me-1"
              as="span"
              animation="grow"
              size="sm"
              role="status"
              aria-hidden="true"
            />
            Procesando
          </button>
        ) : (
         
          <input className="btn-custom" type="submit" value="Guardar datos" />
        )}
        {openEmail ? (
          <MessageInputs
            open={openEmail}
            type={"success"}
            socialmedia={"correo electrónico"}
          ></MessageInputs>
        ) : (
          ""
        )}
      </Form>
    </>
  );
};
