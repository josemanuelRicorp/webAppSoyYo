import { Link } from "react-router-dom";
import style from "../styles/dashboardwrapper.module.css";
// import logo from "../assets/img/logo.svg";
//import logo from "../assets/img/logoSoyYo.svg";
import logo from "../assets/img/logoSoyYo.svg";
import logoMtcorp from "../assets/img/logo-mt-corp.svg";
// import images from '../utils/images';
import { useState } from "react";
// import logo from "../assets/img/soyyo.png";
import {
  Container,
  Nav,
  Navbar,
  NavDropdown,
  Row,
  Stack,
} from "react-bootstrap";
import { FaLocationArrow } from "react-icons/fa";
import { AiOutlineMail } from "react-icons/ai";

import { TiSocialFacebook, TiSocialLinkedin } from "react-icons/ti";

export default function DashboardWrapper({ children }) {
  return (
    <div>
      <Navbar
        className={style.nav}
        bg="light"
        // collapseOnSelect
        expand="lg"
        sticky="top"
      >
        <Container>
          <Navbar.Brand>
            <Link to="/" className={`${style.logo}`}>
              {/* <img src={images[0].img}  alt={images[0].alt}  /> */}
              <img src={logo} alt="Logotipo" />
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse
            id="responsive-navbar-nav"
            className="justify-content-end"
          >
            <Nav className="mr-auto">
              <Link className="nav-link" to="/">
                Inicio
              </Link>
              <Link className="nav-link" to="/visitar-perfil">
                Perfil Público
              </Link>
              <NavDropdown
                title="Personalización del perfil"
                id="collasible-nav-dropdown"
              >
                <Link className="dropdown-item" to="/perfil/informacion">
                  Información personal del perfil
                </Link>
                <Link className="dropdown-item" to="/perfil/diseno">
                  Diseño del perfil
                </Link>
              </NavDropdown>
              <NavDropdown
                title="Personalización de los enlaces"
                id="collasible-nav-dropdown"
              >
                <NavDropdown title=" Enlaces principales" id="sub2" className="menu" >
                  <Link className="dropdown-item nav-link" to="/enlaces/principales/1">
                    Formulario WhatsApp
                  </Link>
                  <Link className="dropdown-item nav-link" to="/enlaces/principales/2">
                    Formulario e-mail de contacto
                  </Link>
                  <Link className="dropdown-item nav-link" to="/enlaces/principales/3">
                    Formulario teléfono de contacto
                  </Link>
                  <Link className="dropdown-item nav-link" to="/enlaces/principales/4">
                    Formulario ubicación de contacto
                  </Link>
                </NavDropdown>
                <NavDropdown title=" Enlaces secundarios" id="sub">
                  <Link className="dropdown-item" to="/enlaces/secundarios/1">
                    Formulario de LinkedIn
                  </Link>
                  <Link className="dropdown-item" to="/enlaces/secundarios/2">
                    Formulario de Facebook
                  </Link>
                  <Link className="dropdown-item" to="/enlaces/secundarios/3">
                    Formulario de Instagram
                  </Link>
                  <Link className="dropdown-item" to="/enlaces/secundarios/4">
                    Formulario de Tiktok
                  </Link>
                  <Link className="dropdown-item" to="/enlaces/secundarios/5">
                    Formulario de Twitter
                  </Link>
                  <Link className="dropdown-item" to="/enlaces/secundarios/6">
                    Formulario de Twitch
                  </Link>
                </NavDropdown>
                {/* <Link className="dropdown-item" to="/enlaces/principales">
                  Enlaces principales
                </Link>
                <Link className="dropdown-item" to="/enlaces/secundarios">
                  Enlaces secundarios
                </Link>
                 */}
                <Link className="dropdown-item" to="/enlaces/personalizados">
                  Enlaces personales
                </Link>
              </NavDropdown>
              {/* <Link className="nav-link" to="/visitar-perfil">
                Visitar perfil
              </Link> */}
              <Link className="nav-link" to="/cerrar-sesion">
                Salir
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className={style.main}>{children}</Container>
      <footer className={style.footer}>
        <Row></Row>
        <Container>
          <div>
            <img src={logoMtcorp} alt="Logotipo Mtcorp" />
          </div>
          <Stack gap={2}>
            <div className="">
              <a
                rel="noreferrer"
                target="_blank"
                // href="https://www.google.com/maps/@-17.7918585,-63.17895,16z"
                href="https://goo.gl/maps/9TUtb58UK1SQH91WA"
              >
                <FaLocationArrow className={style.customIcon} /> Av. Irala,
                Edificio Irala 452.
              </a>
            </div>
            <div className="">
              <a
                rel="noreferrer"
                target="_blank"
                href="mailto:contacto@mtcorplatam.com?subject=Servicio al cliente&body=Por favor, escribe tu consulta."
              >
                <AiOutlineMail className={style.customIcon} />
                contacto@mtcorplatam.com
              </a>
            </div>
            <div className={style.customLine}>
              <strong>MTCORP</strong>
            </div>
            <div className="">2022 - DERECHOS RESERVADOS</div>
            <div className="">
              PROYECTO DE :
              <a
                rel="noreferrer"
                target="_blank"
                href="https://nodabolivia.github.io/"
              >
                &nbsp; CLADERA
              </a>
            </div>
          </Stack>
          <hr className={style.separator} />
          <Stack className={style.copyright} direction="horizontal">
            <div>&#169;2022 MTCorp </div>
            <div className="ms-auto">
              <Stack direction="horizontal" gap={2}>
                <div>
                  <a
                    rel="noreferrer"
                    target="_blank"
                    href="https://www.facebook.com/mtcorplatam"
                  >
                    <TiSocialFacebook className={style.socialIcon} />
                  </a>
                </div>
                <div>
                  <a
                    rel="noreferrer"
                    target="_blank"
                    href="https://br.linkedin.com/company/mtcorp-latam"
                  >
                    <TiSocialLinkedin className={style.socialIcon} />
                  </a>
                </div>
                <div>
                  <a
                    rel="noreferrer"
                    target="_blank"
                    href="mailto:contacto@mtcorplatam.com?subject=Servicio al cliente&body=Por favor, escribe tu consulta."
                  >
                    <AiOutlineMail className={style.socialIcon} />
                  </a>
                </div>
              </Stack>
            </div>
          </Stack>
        </Container>
      </footer>
    </div>
  );
}
