import DashboardWrapper from "../components/dashboardwrapper";
import { AuthProviders } from "../components/authProvider";
import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import style from "../styles/editProfileDesignView.module.css";
import color1 from "../assets/img/imgColors/color1.png";
import color2 from "../assets/img/imgColors/color2.png";
import color3 from "../assets/img/imgColors/color3.png";
import color4 from "../assets/img/imgColors/color4.png";
import color5 from "../assets/img/imgColors/color5.png";
import color6 from "../assets/img/imgColors/color6.png";
import color7 from "../assets/img/imgColors/color7.png";
import color8 from "../assets/img/imgColors/color8.png";
import color9 from "../assets/img/imgColors/color9.png";

import {
  existUsername,
  getProfilePhotoUrl,
  updateUser,
} from "../firebase/firebase";
import "../styles/theme.css";

import { Button, ButtonGroup, Col, Form, Row, Stack } from "react-bootstrap";
import Loading from "../components/loading";
import MessageTheme from "../components/others/messageTheme";

export default function EditProfileDesignView() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({});
  const [state, setState] = useState(0);
  const [theme, setTheme] = useState("color1");
  const [themeSaved, setThemeSaved] = useState("");
  const [openTheme, setOpenTheme] = useState(false);
  const [urlImg, setUrlImg] = useState(`${color1}`);

  const darkTones = [
    { normal: "color1" },
    { normal: "color2" },
    { normal: "color7" },
  ];
  const lightTones = [
    { normal: "color8" },
    { normal: "color3" },
    { normal: "color4" },
  ];
  const vibrantTones = [
    { normal: "color5" },
    { normal: "color6" },
    { normal: "color9" },
  ];

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

  function handleImagePath(color) {
    switch (color) {
      case "color1":
        setUrlImg(color1);
        break;
      case "color2":
        setUrlImg(color2);
        break;
      case "color3":
        setUrlImg(color3);
        break;
      case "color4":
        setUrlImg(color4);
        break;
      case "color5":
        setUrlImg(color5);
        break;
      case "color6":
        setUrlImg(color6);
        break;
      case "color7":
        setUrlImg(color7);
        break;
      case "color8":
        setUrlImg(color8);
        break;
      case "color9":
        setUrlImg(color9);
        break;
      default:
        break;
    }
  }

  function handleOnClick(color, item) {
    handleImagePath(color);
    setTheme(color);
  }

  function handleOnSubmitTheme(e) {
    e.preventDefault();
    e.stopPropagation();
    setThemeSaved(theme);
    handleUpdateTheme();
  }

  async function handleUpdateTheme() {
    // const tmp = { ...currentUser };
    currentUser.theme = theme;
    await updateUser(currentUser);
    // setCurrentUser(...tmp);
    handleMessageConfirmation();
  }

  function handleMessageConfirmation() {
    setOpenTheme(true);
    setTimeout(() => {
      setOpenTheme(false);
    }, 2000);
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
        <h1>Editar diseño del perfil</h1>
        <div className={style.containerPersonalData}>
          <Row className={style.rows}>
            {openTheme ? (
              <MessageTheme open={openTheme} type={"success"}></MessageTheme>
            ) : (
              ""
            )}
            <Col>
              <Form onSubmit={handleOnSubmitTheme}>
                <Row>
                  <Col lg="4">
                    <div>
                      <h5>Tonos fuertes</h5>
                      <div className={style.gridContainer}>
                        {darkTones.map((item, i) => (
                          <button
                            key={i}
                            className={`${style.gridItem} ${item.normal}`}
                            type="button"
                            onClick={() => {
                              handleOnClick(item.normal, i);
                            }}
                          >
                            {/* {i + 1} */}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h5>Tonos suaves</h5>
                      <div className={style.gridContainer}>
                        {lightTones.map((item, i) => (
                          <button
                            key={i}
                            className={`${style.gridItem} ${item.normal}`}
                            type="button"
                            onClick={() => {
                              handleOnClick(item.normal, i);
                            }}
                          ></button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h5>Tonos vibrantes</h5>
                      <div className={style.gridContainer}>
                        {vibrantTones.map((item, i) => (
                          <button
                            key={i}
                            className={`${style.gridItem} ${item.normal}`}
                            type="button"
                            onClick={() => {
                              handleOnClick(item.normal, i);
                            }}
                          ></button>
                        ))}
                      </div>
                    </div>
                  </Col>
                  <Col>
                    <div>
                      <h5>Prediseño</h5>
                      <div className={style.imageContainer}>
                        <img
                          className={style.imgPreview}
                          src={urlImg}
                          alt="profile_photo"
                        />
                      </div>
                    </div>

                    <div>
                      <div className={`${style.containerBtnSave} mt-3`}>
                        <input
                          className={`btn-custom ${style.btnSave}`}
                          type="submit"
                          value="Guardar datos"
                          // style={{ width: "100%" }}
                        />
                      </div>
                    </div>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </div>
      </div>
    </DashboardWrapper>
  );
}
