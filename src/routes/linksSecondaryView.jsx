import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthProviders } from "../components/authProvider";
import {  getLinks} from "../firebase/firebase";
import DashboardWrapper from "../components/dashboardwrapper";
import style from "../styles/dashboardView.module.css";
import { Accordion } from "react-bootstrap";
import { FormFacebook, FormInstagram, FormLinkedIn, FormTikTok, FormTwitch, FormTwitter } from "../components/formsSecundaryLinks";

export default function LinksSecondaryView() {
  const navigate = useNavigate();
  const [stateAccordion, setStateAccordion] = useState("0");
  const [currentUser, setCurrentUser] = useState({});
  const [state, setState] = useState(0);
  const [links, setLinks] = useState([]);

  async function handleUserLoggeIn(user) {
    setCurrentUser(user);
    setState(2);
    const resLinks = await getLinks(user.uid);
    setLinks([...resLinks]);
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
      <div>
        <h1>Enlaces secundarios</h1>
        <p>
          En este apartado tienes que personalizar la información de los enlaces
          que quieres tener en tu perfil.
        </p>
        <Accordion
          onSelect={handleSelection}
          activeKey={stateAccordion}
          className={style.accordionCustom}
        >
          <Accordion.Item eventKey="1" className={style.accordionItemCustom}>
            <Accordion.Header>Linkedin</Accordion.Header>
            <Accordion.Body>
              <FormLinkedIn user={currentUser} style={style.entryContainer} closeAccordion={closeAccordion} />
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2" className={style.accordionItemCustom}>
            <Accordion.Header>Facebook</Accordion.Header>
            <Accordion.Body>
              <FormFacebook user={currentUser} style={style.entryContainer} closeAccordion={closeAccordion} />
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="3" className={style.accordionItemCustom}>
            <Accordion.Header>Instagram</Accordion.Header>
            <Accordion.Body>
            <FormInstagram user={currentUser} style={style.entryContainer} closeAccordion={closeAccordion} />
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="4" className={style.accordionItemCustom}>
            <Accordion.Header>Tiktok</Accordion.Header>
            <Accordion.Body>
            <FormTikTok user={currentUser} style={style.entryContainer}  closeAccordion={closeAccordion}/>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="5" className={style.accordionItemCustom}>
            <Accordion.Header>Twitter</Accordion.Header>
            <Accordion.Body>
            <FormTwitter user={currentUser} style={style.entryContainer} closeAccordion={closeAccordion} />
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="6" className={style.accordionItemCustom}>
            <Accordion.Header>Twitch</Accordion.Header>
            <Accordion.Body>
            <FormTwitch user={currentUser} style={style.entryContainer}  closeAccordion={closeAccordion}/>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    </DashboardWrapper>
  );
}
