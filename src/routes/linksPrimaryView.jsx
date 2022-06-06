import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthProviders } from "../components/authProvider";
import { v4 as uuidv4 } from "uuid";
import {
  getLinksBySocialMedia,
  insertNewLink,
  updateLink,
} from "../firebase/firebase";
import DashboardWrapper from "../components/dashboardwrapper";
import style from "../styles/dashboardView.module.css";
import {
  linkEmail,
  linkPhoneNumberCall,
  linkWhatsApp,
} from "../utils/socialMediaLinks";
import { Accordion,  Col,  Form, Row } from "react-bootstrap";
import {
  link2FieldsEmail,
  link2FieldsPhone,
  link2FieldsWhatsapp,
} from "../utils/socialMediaFields";
import MessageInputs from "../components/messageInputs";

export default function LinksPrimaryView() {
  const navigate = useNavigate();
  const [stateAccordion, setStateAccordion] = useState("0");
  const [state, setState] = useState(0);
  const [currentUser, setCurrentUser] = useState({});
  const [socialmedia, setSocialmedia] = useState("");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const [currentLinkWhatsApp, setCurrentLinkWhatsApp] = useState({});
  const [currentLinkEmail, setCurrentLinkEmail] = useState({});
  const [currentLinkPhone, setCurrentLinkPhone] = useState({});

  const [openWhatsApp, setOpenWhatsApp] = useState(false);
  const [whatsappLinkDocId, setWhatsappLinkDocId] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [whatsappMsg, setWhatsappMsg] = useState("");

  const [openPhone, setOpenPhone] = useState(false);
  const [phoneLinkDocId, setPhoneLinkDocId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [openEmail, setOpenEmail] = useState(false);
  const [emailLinkDocId, setEmailLinkDocId] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");

  async function handleUserLoggeIn(user) {
    setCurrentUser(user);
    setState(2);
    initWhatsAppInfo(user.uid);
    initEmailInfo(user.uid);
    initPhoneInfo(user.uid);
  }
  function handleUserNotRegistered(user) {
    navigate("/iniciar-sesion");
  }
  function handleUserNotLoggedIn() {
    navigate("/iniciar-sesion");
  }


  async function initWhatsAppInfo(uid) {
    const resLinksWhatsapp = await getLinksBySocialMedia(uid, "whatsapp");
    if (resLinksWhatsapp.length > 0) {
      const linkObject = [...resLinksWhatsapp][0];
      console.log({ linkObject });
      setCurrentLinkWhatsApp(() => ({
        ...currentLinkWhatsApp,
        ...linkObject,
      }));
      setWhatsappLinkDocId(linkObject.docId);
      let fieldsData = link2FieldsWhatsapp(linkObject.url);
      setWhatsappNumber(fieldsData.phone);
      setWhatsappMsg(fieldsData.msg);
    }
  }

  async function initEmailInfo(uid) {
    const resLinksEmail = await getLinksBySocialMedia(uid, "email");
    if (resLinksEmail.length > 0) {
      const linkObject = [...resLinksEmail][0];
      console.log({ linkObject });
      setCurrentLinkEmail(() => ({
        ...currentLinkEmail,
        ...linkObject,
      }));
      setEmailLinkDocId(linkObject.docId);
      let fieldsData = link2FieldsEmail(linkObject.url);
      setEmailAddress(fieldsData.email);
      setEmailSubject(fieldsData.subject);
      setEmailBody(fieldsData.body);
    }
  }
  async function initPhoneInfo(uid) {
    const resLinksPhone = await getLinksBySocialMedia(uid, "phone");
    if (resLinksPhone.length > 0) {
      const linkObject = [...resLinksPhone][0];
      console.log({ linkObject });
      setCurrentLinkPhone(() => ({
        ...currentLinkPhone,
        ...linkObject,
      }));
      setPhoneLinkDocId(linkObject.docId);
      let fieldsData = link2FieldsPhone(linkObject.url);
      setPhoneNumber(fieldsData.number);
    }
  }

  function addLink() {
    if (title !== "" && url !== "") {
      console.log({ title, url });
      console.log("wp adlink");
      const newLink = {
        id: uuidv4(),
        title: title,
        url: url,
        socialmedia: socialmedia,
        uid: currentUser.uid,
      };
      const res = insertNewLink(newLink);
      newLink.docId = res.id;
      setTitle("");
      setUrl("");
      handleOpenMessageInputSocialMedia(socialmedia,true);
      setTimeout(() => {
        handleOpenMessageInputSocialMedia(socialmedia,false); 
      }, 2000); 
      setTimeout(()=>{
          setStateAccordion("0");
        }, 900);
      return newLink.docId;
    }
  }

  function update(currentLinkDocId) {
    if (title !== "" && url !== "") {
      console.log({ title, url });
      const link = {
        title: title,
        url: url,
        socialmedia: socialmedia,
        uid: currentUser.uid,
      };
      const res = updateLink(currentLinkDocId, link);
      link.docId = res.id;
      setTitle("");
      setUrl("");
      handleOpenMessageInputSocialMedia(socialmedia,true);
      setTimeout(() => {
        handleOpenMessageInputSocialMedia(socialmedia,false);
      }, 2000); 
      setTimeout(()=>{
          setStateAccordion("0");
      }, 900);
    }
  }

  async function editLinkBetter(currentLinkDocId) {
    update(currentLinkDocId);
  }

  const handleOnSubmitWhatsapp = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setTitle("WhatsApp");
    setSocialmedia("whatsapp");
    setUrl(linkWhatsApp(whatsappNumber, whatsappMsg));
    if (whatsappLinkDocId !== "") {
      editLinkBetter(whatsappLinkDocId);  
    } else {
      addLink();
    }
  };

  function handleOnChangeWhatsApp(e) {
    const value = e.target.value;
    if (e.target.name === "msg") {
      setWhatsappMsg(value);
    }
    if (e.target.name === "number") {
      setWhatsappNumber(value);
    }
  }

  function handleOnSubmitEmail(e) {
    e.preventDefault();
    e.stopPropagation();
    setTitle("E-mail");
    setSocialmedia("email");
    setUrl(linkEmail(emailAddress, emailSubject, emailBody));
    if (emailLinkDocId !== "") {
      editLinkBetter(emailLinkDocId);
    } else {
      console.log("agregar link");
      addLink();
    }
  }
  function handleOnChangeEmail(e) {
    const value = e.target.value;
    if (e.target.name === "email") {
      setEmailAddress(value);
    }
    if (e.target.name === "subject") {
      setEmailSubject(value);
    }
    if (e.target.name === "body") {
      setEmailBody(value);
    }
  }

  function handleOnSubmitPhone(e) {
    e.preventDefault();
    e.stopPropagation();
    setTitle("Phone");
    setSocialmedia("phone");
    // if (phoneNumber !== "") {
    setUrl(linkPhoneNumberCall(phoneNumber));
    if (phoneLinkDocId !== "") {
      console.log("actualizar link");
      editLinkBetter(phoneLinkDocId);
    } else {
      console.log("agregar link");
      addLink();
    }
    // }
  }
  function handleOnChangePhone(e) {
    const value = e.target.value;
    if (e.target.name === "number") {
      setPhoneNumber(value);
    }
  }


  function handleOpenMessageInputSocialMedia(socialmedia,state){
    switch (socialmedia) {
      case "whatsapp":
        setOpenWhatsApp(state);  
        break;
      case "email":
          setOpenEmail(state);  
          break;
      case "phone":
          setOpenPhone(state);  
          break;
      default:
        break;
    }

  }
  function handleSelection(eventKey, e){
    setStateAccordion(eventKey);
}



  if (state === 0) {
    return (
      <AuthProviders
        onUserLoggedIn={handleUserLoggeIn}
        onUserNotLoggedIn={handleUserNotRegistered}
        onUserNotRegistered={handleUserNotLoggedIn}
      ></AuthProviders>
    );
  }
  return (
    <DashboardWrapper>
       <h1>Enlaces principales</h1>
      <p>
        En este apartado tienes que personalizar la información de los enlaces que son
         imprescindible en tu perfil.
      </p>
      <Accordion onSelect={handleSelection}  activeKey={stateAccordion} className={style.accordionCustom}>
        <Accordion.Item eventKey="1" className={style.accordionItemCustom}>
          <Accordion.Header>WhatsApp</Accordion.Header>
          <Accordion.Body>
            <Form
              className={style.entryContainer}
              onSubmit={handleOnSubmitWhatsapp}
            >
              {(openWhatsApp)?(
                 <MessageInputs open={openWhatsApp} type={"success"} socialmedia={"WhatsApp"}></MessageInputs>
              ):""}
             <h2>WhatsApp</h2>
              <Form.Group
                as={Row}
                className="mb-3"
                controlId="formPlaintextEmail"
              >
                <Form.Label column sm="4">
                Número telefónico:
                </Form.Label>
                <Col sm="8">
                  <Form.Control
                    className="input"
                    type="text"
                    name="number"
                    value={whatsappNumber}
                    onChange={handleOnChangeWhatsApp}
                    autoComplete="off"
                    placeholder="70000000"
                  />
                </Col>
              </Form.Group>
              <Form.Group
                as={Row}
                className="mb-3"
                controlId="formPlaintextEmail"
              >
                <Form.Label column sm="4">
                Mensaje:
                </Form.Label>
                <Col sm="8">
                  <Form.Control
                    className="input"
                    type="text"
                    name="msg"
                    autoComplete="off"
                    placeholder="Escribe tu mensaje"
                    value={whatsappMsg}
                    onChange={handleOnChangeWhatsApp}
                  />
                </Col>
              </Form.Group>
              
                  <input className="btn-custom" type="submit" value="Guardar datos" />
                
            </Form>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2" className={style.accordionItemCustom}>
          <Accordion.Header>Correo electrónico</Accordion.Header>
          <Accordion.Body>
            <form
              className={style.entryContainer}
              onSubmit={handleOnSubmitEmail}
            >
              {(openEmail)?(
                 <MessageInputs open={openEmail} type={"success"} socialmedia={"Email"}></MessageInputs>
              ):""}
              <h2>E-mail</h2>
              <label htmlFor="email">Dirección de correo electrónico</label>
              <input
                className="input"
                type="text"
                name="email"
                autoComplete="off"
                placeholder="ejemplo@dominio.extensión"
                value={emailAddress}
                onChange={handleOnChangeEmail}
              />

              <label htmlFor="subject"> Asunto:</label>
              <input
                className="input"
                type="text"
                name="subject"
                autoComplete="off"
                placeholder="Escribe el asunto del correo"
                value={emailSubject}
                onChange={handleOnChangeEmail}
              />
              <label htmlFor="body"> Cuerpo:</label>
              <input
                className="input"
                type="text"
                name="body"
                autoComplete="off"
                placeholder="Escribe el mensaje del correo"
                value={emailBody}
                onChange={handleOnChangeEmail}
              />
              <input className="btn-custom" type="submit" value="Guardar datos" />
            </form>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="3" className={style.accordionItemCustom}>
          <Accordion.Header>Telefóno</Accordion.Header>
          <Accordion.Body>
            <form
              className={style.entryContainer}
              onSubmit={handleOnSubmitPhone}
            >
              {(openPhone)?(
                <MessageInputs open={openPhone} type={"success"} socialmedia={"cellphone"}></MessageInputs>
              ):""}
              <h2>Telefóno</h2>
              <label htmlFor="number">Número telefónico:</label>
              <input
                className="input"
                type="text"
                name="number"
                autoComplete="off"
                placeholder="70000000"
                value={phoneNumber}
                onChange={handleOnChangePhone}
              />
              <input className="btn-custom" type="submit" value="Guardar datos" />
            </form>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="4" className={style.accordionItemCustom}>
          <Accordion.Header>Mapas</Accordion.Header>
          <Accordion.Body></Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </DashboardWrapper>
  );
}
