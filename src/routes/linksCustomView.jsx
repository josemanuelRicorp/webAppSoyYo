/* eslint-disable jsx-a11y/alt-text */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthProviders } from "../components/authProvider";
import { deleteCustomLink,getLinksCustoms } from "../firebase/firebase";
import DashboardWrapper from "../components/dashboardwrapper";
import style from "../styles/dashboardView.module.css";
import { Accordion, Stack } from "react-bootstrap";
import { FormCustom } from "../components/formsCustomLinks/formCustom";
import { ModalForm } from "../components/formsCustomLinks/modalForm";
import { FaTrash } from "react-icons/fa";
export default function LinksCustomView() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({});
  const [stateAccordion, setStateAccordion] = useState("0");
  const [state, setState] = useState(0);
  const [links, setLinks] = useState([]);
  const [show, setShow] = useState(false);
  const [linkCustom, setLinkCustom] = useState({});
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

  const updateItem = (link_custom) => {
    setShow(true);
    setLinkCustom(link_custom);
    return linkCustom;
  };
  const deleteItem = (indexItem, link) => {
    deleteCustomLink(link.docId);
    setLinks((prevState) =>
      prevState.filter((todo, index) => index !== indexItem)
    );
  };
  function handleOnHide() {
    setShow(false);
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
                  <p>{link.url}</p>
                  <button
                    type="button"
                    className="btn-custom small"
                    onClick={() => updateItem(link)}
                  >
                    Editar
                  </button>

                  {/* <div className={style.btn}> */}
                  <button
                    type="button"
                    className="btn-custom negative small ms-2"
                    onClick={() => deleteItem(key, link)}
                  >
                    Eliminar
                  </button>
                  {/* </div> */}
                </Accordion.Body>
              </Accordion.Item>
            ))}
            <ModalForm
              user={linkCustom}
              show={show}
              handleOnHide={handleOnHide}
            ></ModalForm>
          </Accordion>
        </>
      ) : (
        ""
      )}
    </div>
  </DashboardWrapper>
  );
}
