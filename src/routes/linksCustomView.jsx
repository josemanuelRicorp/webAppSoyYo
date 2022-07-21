/* eslint-disable jsx-a11y/alt-text */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthProviders } from "../components/authProvider";
import { getLinksCustoms } from "../firebase/firebase";
import DashboardWrapper from "../components/dashboardwrapper";
import style from "../styles/dashboardView.module.css";
import { Accordion, Stack } from "react-bootstrap";
import { FormCustom } from "../components/formsCustomLinks/formCustom";
// import { useEffect } from "react";
import { FaTrash } from "react-icons/fa";
export default function LinksCustomView() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({});
  const [stateAccordion, setStateAccordion] = useState("0");
  const [state, setState] = useState(0);
  const [links, setLinks] = useState([]);

  // useEffect(() => {
  //   cargarLista(currentUser);
  // });

  // async function cargarLista(currentUser) {
  //   const resLinks = await getLinksCustoms(currentUser.uid);
  //   setLinks([...resLinks]);
  // }

  async function handleUserLoggeIn(user) {
    setCurrentUser(user);
    setState(2);
    const resLinks = await getLinksCustoms(user.uid);
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

  function handledDeleteCustomLink(){
    
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
        <h1>Enlaces Personalizados</h1>
        <p>
          En este apartado podras agregar la información de los nuevos enlaces
          que quieras tener en tu perfil.
        </p>
        <Accordion
          onSelect={handleSelection}
          activeKey={stateAccordion}
          className={style.accordionCustom}
        >
          <FormCustom
            user={currentUser}
            style={style.entryContainer}
            handleAccordion={closeAccordion}
          ></FormCustom>
        </Accordion>
      </div>
      <br />
      <div>
        {links.length > 0 ? (
          <>
            <h2>Lista Enlaces Personales</h2>
            <Accordion
              onSelect={handleSelection}
              activeKey={stateAccordion}
              className={style.accordionCustom}
            >
              {links.map((link, key) => (
                <Accordion.Item
                  key={key}
                  eventKey={key}
                  className={style.accordionItemCustom}
                >
                  <Accordion.Header>
                    <img className={style.icono} src={link.icon} />
                    {link.website}
                  </Accordion.Header>
                  <Accordion.Body>
                  <Stack direction="horizontal" gap={3}>
      <div >{link.url}</div>
      <div >
      <button
                    className={style.btnEdit}
                    onClick={handledDeleteCustomLink}
                  >
                   
                    <span><FaTrash className={style.iconEdit}></FaTrash></span>
                    
                  </button>
      </div>
      
    </Stack>
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          </>
        ) : (
          ""
        )}
      </div>
    </DashboardWrapper>
  );
}
