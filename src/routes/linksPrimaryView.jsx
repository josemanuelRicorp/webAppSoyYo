import {  useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthProviders } from "../components/authProvider";

import DashboardWrapper from "../components/dashboardwrapper";
import style from "../styles/dashboardView.module.css";

import { Accordion } from "react-bootstrap";
import { FormEmail, FormMap, FormPhone, FormWhatsapp } from "../components/formsPrimaryLinks";
import { MdEmail} from "react-icons/md";
import { RiMapPinUserLine} from "react-icons/ri";
import { AiOutlineWhatsApp, AiFillPhone } from "react-icons/ai";


export default function LinksPrimaryView() {
  const navigate = useNavigate();
  const [stateAccordion, setStateAccordion] = useState("0");
  const [state, setState] = useState(0);
  const [currentUser, setCurrentUser] = useState({});

  async function handleUserLoggeIn(user) {
    setCurrentUser(user);
    setState(2);
  }
  function handleUserNotRegistered(user) {
    navigate("/iniciar-sesion");
  }
  function handleUserNotLoggedIn() {
    navigate("/iniciar-sesion");
  }

  function handleSelection(eventKey, e) {
    setStateAccordion(eventKey);
  }
  function closeAccordion() {
    setTimeout(() => {
      setStateAccordion("0");
    }, 1400);
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
        En este apartado tienes que personalizar la información de los enlaces
        que son imprescindible en tu perfil.
      </p>
      <Accordion
        onSelect={handleSelection}
        activeKey={stateAccordion}
        className={style.accordionCustom}
      >
        <Accordion.Item eventKey="1" className={style.accordionItemCustom}>
          <Accordion.Header  translate="no" > <AiOutlineWhatsApp  className={style.linkIcon}></AiOutlineWhatsApp>  WhatsApp</Accordion.Header>
          <Accordion.Body>
          <FormWhatsapp user={currentUser} style={style.entryContainer}  handleAccordion={closeAccordion}/>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2" className={style.accordionItemCustom}>
          <Accordion.Header> <MdEmail  className={style.linkIcon}></MdEmail>  Correo electrónico</Accordion.Header>
          <Accordion.Body>
            <FormEmail user={currentUser} style={style.entryContainer} handleAccordion={closeAccordion} />
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="3" className={style.accordionItemCustom}>
          <Accordion.Header> <AiFillPhone className={style.linkIcon}></AiFillPhone>  Telefóno</Accordion.Header>
          <Accordion.Body>
          <FormPhone user={currentUser} style={style.entryContainer} handleAccordion={closeAccordion} />
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="4" className={style.accordionItemCustom}>
          <Accordion.Header> <RiMapPinUserLine className={style.linkIcon}></RiMapPinUserLine> Ubicación</Accordion.Header>
          <Accordion.Body>
          <FormMap user={currentUser} style={style.entryContainer} handleAccordion={closeAccordion} />

          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </DashboardWrapper>
  );
}
