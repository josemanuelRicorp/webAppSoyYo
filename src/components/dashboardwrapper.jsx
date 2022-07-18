import { Link } from "react-router-dom";
import style from "../styles/dashboardwrapper.module.css";
// import logo from "../assets/img/logo.svg";
//import logo from "../assets/img/logoSoyYo.svg";
import logo from "../assets/img/logoSoyYo.svg";
import logoMtcorp from "../assets/img/logo-mt-corp.svg";
// import images from '../utils/images';

// import logo from "../assets/img/soyyo.png";
import { Container, Nav, Navbar, Row, Stack } from "react-bootstrap";
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
            <Nav
            // className="me-auto my-2 my-lg-0"
            >
              <Link to="/perfil">Perfil</Link>
              <Link to="/diseno">Diseño</Link>
              <Link to="/enlaces/principales">Enlaces principales</Link>
              <Link to="/enlaces/secundarios">Enlaces secundarios</Link>
              <Link to="/cerrar-sesion">Salir</Link>
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
