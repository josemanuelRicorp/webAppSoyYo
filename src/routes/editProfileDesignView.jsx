import DashboardWrapper from "../components/dashboardwrapper";
import { AuthProviders } from "../components/authProvider";
import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import style from "../styles/editProfileDesignView.module.css";
import {
  existUsername,
  getProfilePhotoUrl,
  updateUser,
} from "../firebase/firebase";
import "../styles/theme.css";

import { Button, ButtonGroup, Col, Form, Row, Stack } from "react-bootstrap";
import Loading from "../components/loading";

export default function EditProfileDesignView() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({});
  const [state, setState] = useState(0);
  const [profileUrl, setProfileUrl] = useState(null);

  const [publicId, setPublicId] = useState("");
  const [username, setUsername] = useState("");
  const [editUsername, setEditUsername] = useState(false);
  const [theme, setTheme] = useState("default");
  const [bg, setBg] = useState("first");
  const [bgHover, setBgHover] = useState("firstHover");

  const usernameRef = useRef(null);

  async function handleUserLoggeIn(user) {
    setCurrentUser(user);
    const url = await getProfilePhotoUrl(user.profilePicture);
    setProfileUrl(url);

    setState(2);
  }
  function handleUserNotRegistered(user) {
    navigate("/iniciar-sesion");
  }
  function handleUserNotLoggedIn() {
    navigate("/iniciar-sesion");
  }

  function handleEditUsername() {
    setEditUsername(true);
  }
  function handleCancelEditUsername() {
    setUsername(currentUser.username);
    setEditUsername(false);
  }
  function handleChangeUsername(e) {
    const value = e.target.value;
    if (e.target.name === "username") {
      setUsername(value);
    }
  }
  function handleSuccessEditUsername() {
    handleUpdateUsername();
    setEditUsername(false);
  }

  async function handleUpdateUsername() {
    if (username !== "") {
      const exists = await existUsername(username);
      if (exists) {
        setState(5);
      } else {
        const tmp = { ...currentUser };
        tmp.theme = theme;
        await updateUser(tmp);
        setState(6);
      }
    }
  }
  function handleSave() {
    console.log("hola");
    console.log({ theme });

    handleUpdateUsername();
    console.log("actualizado");
  }
  function handleFirst() {
    setTheme("default");
    setBg("first");
    setBgHover("firstHover");
  }
  function handleSecond() {
    setTheme("dark");
    setBg("second");
    setBgHover("secondHover");
  }
  function handleThird() {
    setTheme("colors");
    setBg("third");
    setBgHover("thirdHover");
  }

  if (state !== 2) {
    return (
      <AuthProviders
        onUserLoggedIn={handleUserLoggeIn}
        onUserNotLoggedIn={handleUserNotLoggedIn}
        onUserNotRegistered={handleUserNotRegistered}
      >
        <Loading></Loading>
      </AuthProviders>
    );
  }
  return (
    <DashboardWrapper>
      <div className="main-container">
        <h1>Editar información del perfil</h1>
        <div className={style.containerPersonalData}>
          <Row className={style.rows}>
            <Row>
               <Button variant="secondary" onClick={handleSave}>
                Guardar
              </Button>
            </Row>
           
            <Col>
              <ButtonGroup vertical>
                <Button variant="secondary" onClick={handleFirst}>
                  Por defecto
                </Button>
                <Button variant="secondary" onClick={handleSecond}>
                  Oscuro
                </Button>
                <Button variant="secondary" onClick={handleThird}>
                  Colorido
                </Button>
              </ButtonGroup>
            </Col>
            <Col>
              <>
                <a
                  rel="noreferrer"
                  target="_blank"
                  href="https://www.linkedin.com/in/irma-mrkanovic-a4638094/"
                  // className={style.secondaryLink}
                  className={`${style.secondaryLink} ${bg} ${bgHover}`}
                >
                  <span className={style.secondaryLinkSpan}>
                    Tu link de contacto
                  </span>
                </a>
              </>
            </Col>
          </Row>
        </div>
      </div>
    </DashboardWrapper>
  );
}
