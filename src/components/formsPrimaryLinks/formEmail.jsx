import { useEffect, useRef, useState } from "react";
import {
  deleteLink,
  getLinksBySocialMedia,
  insertNewLink,
  updateLink,
} from "../../firebase/firebase";
import { link2FieldsEmail } from "../../utils/socialMediaFields";
import { linkEmail } from "../../utils/socialMediaLinks";
import { v4 as uuidv4 } from "uuid";
import MessageInputs from "../messageInputs";
import { Col, Form, InputGroup, Row, Spinner, DropdownButton, Dropdown } from "react-bootstrap";
import { emailToString, stringToEmailExtention } from "../../utils/stringUtils";
export const FormEmail = ({ style, user, handleAccordion }) => {
  const [currentUser, setCurrentUser] = useState(user);
  const [openEmail, setOpenEmail] = useState(false);
  const [state, setState] = useState(0);
  const [emailLinkDocId, setEmailLinkDocId] = useState("");
  const [emailExtention, setEmailExtention] = useState("gmail.com");
  const [emailAddress, setEmailAddress] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const emailAddressRef = useRef(null);
  const emailSubjectRef = useRef(null);
  const emailBodyRef = useRef(null);
  const [typeInputEmail, setTypeInputEmail] = useState(false);
  const [domainsEmail, setDomainsEmail] = useState(['gmail.com', 'hotmail.com', 'outlook.com'])
  const [alertInput1, setAlerInput1] = useState(false);
  const [alertInput2, setAlerInput2] = useState(false);
  useEffect(() => {
    initEmailInfo(user.uid);
  }, []);
  async function initEmailInfo(uid) {
    const resLinksEmail = await getLinksBySocialMedia(uid, "email");
    if (resLinksEmail.length > 0) {
      const linkObject = [...resLinksEmail][0];
      setEmailLinkDocId(linkObject.docId);
      let fieldsData = link2FieldsEmail(linkObject.url);
      setEmailAddress(emailToString(fieldsData.email));
      if(fieldsData.email !== ""){
        setEmailExtention(stringToEmailExtention(fieldsData.email));
        if(!domainsEmail.includes(stringToEmailExtention(fieldsData.email)))
        setDomainsEmail([...domainsEmail, stringToEmailExtention(fieldsData.email)])
      }
      setEmailSubject(fieldsData.subject);
      setEmailBody(fieldsData.body);
    }
  }

  function addLink() {
    if (emailAddress !== "") {
      const newURL = linkEmail(emailAddress + '@' + emailExtention, emailSubject, emailBody);
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
      initEmailInfo(currentUser.uid);
      return newLink.docId;
    }
  }

/**
 * If the user has entered an email address, then update the link with the new email address, otherwise
 * delete the link.
 */
  function editLink(currentLinkDocId) {
    if (emailAddress) {
      const newURL = linkEmail(emailAddress + '@' + emailExtention, emailSubject, emailBody);
      const link = {
        title: "E-mail",
        socialmedia: "email",
        category: "primary",
        url: newURL,
        uid: currentUser.uid,
      };
      const res = updateLink(currentLinkDocId, link);
      link.docId = res.id;
    } else {
      deleteLink(emailLinkDocId);
    }
  }





  function handleOnSubmitEmail(e) {
    e.preventDefault();
    e.stopPropagation();
    handleButton();
  }
  function handleClickExtention(value) {
    for (let i = 0; i < domainsEmail.length; i++) {
      if(value === i){
        setEmailExtention(domainsEmail[i])
      }
    }
  }

  function handleOnChangeEmailAddress() {
    setEmailAddress(emailAddressRef.current.value);
  }
  function handleOnChangeEmailSubject() {
    if (emailSubjectRef.current.value.length <= 50)
    setEmailSubject(emailSubjectRef.current.value);
  }
  function handleOnChangeEmailBody() {
    if (emailBodyRef.current.value.length <= 100)
    setEmailBody(emailBodyRef.current.value);
  }
  function handleButton() {
    setState(11);
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
      setOpenEmail(false);
    }, 2000);
  }
  function handleAlertInput(type){
    if(type === 1){
      setAlerInput1(true);
      setAlerInput2(false);
    } else
    {
      setAlerInput2(true);
      setAlerInput1(false);
    }
  }
  return (
    <>
      <Form className={style} onSubmit={handleOnSubmitEmail}>
        <h2>Datos para el enlace de tu E-mail</h2>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column lg="4">
            Dirección de correo electrónico
          </Form.Label>
          <Col lg="3">
            <Form.Control
              className="input"
              type="text"
              name="email"
              autoComplete="off"
              placeholder="username"
              value={emailAddress}
              ref={emailAddressRef}
              onChange={handleOnChangeEmailAddress}
            />
          </Col>
          <Col lg="3">
            { typeInputEmail ?
              <InputGroup> 
                <InputGroup.Text id="">
                  {"@"}
                </InputGroup.Text>
                <Form.Control
                  className="input"
                  type="text"
                  name="emailExtention"
                  autoComplete="off"
                  placeholder="dominio.extensión"
                  value={emailExtention}
                  // ref={emailAddressRef}
                  onChange={(e) => setEmailExtention(e.target.value)}
                />
              </InputGroup>
              :
              <DropdownButton
              variant="outline-secondary"
              title={`@ ${emailExtention}`}
              // key= {3}
              id="2"
            >
              {
                domainsEmail.map((domain, index) => {
                  return <Dropdown.Item key={index} onClick={() => handleClickExtention(index)}> {domain} </Dropdown.Item>
                })
              }
            </DropdownButton>

          }
          
          
            </Col>
          <Col lg="2">
            <Form.Check 
             onClick={() => setTypeInputEmail(!typeInputEmail)}
              type="switch"
              id="custom-switch"
              label="Habilitar dominio personalizado"
            />
          </Col>
            {/* </InputGroup> */}
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
              onClick = { ()=> handleAlertInput(1) }
              isInvalid={emailSubject.length === 0 && alertInput1 ? true : false}
             isValid={emailSubject.length > 0 ? true : false}
            />
              <Form.Control.Feedback type={emailSubject.length === 0 ? "invalid" : "valid"} tooltip={false}>
              {`${emailSubject.length} carácteres, Máximo 50 carácteres `}            </Form.Control.Feedback>
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
              onClick = { ()=> handleAlertInput(2) }
              isInvalid={emailBody.length === 0 && alertInput2 ? true : false}
              isValid={emailBody.length > 0 ? true : false}
            />
             <Form.Control.Feedback type={emailBody.length === 0 ? "invalid" : "valid"} tooltip={false}>
             {`${emailBody.length} carácteres, Máximo 100 carácteres `}
            </Form.Control.Feedback>
          </Col>
        </Form.Group>
        {state === 10 ? (
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
