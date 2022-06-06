import { Link } from "react-router-dom";
import style from "../styles/dashboardwrapper.module.css";
import logo from "../assets/img/logo.svg";
// import logo from "../assets/img/soyyo.png";
import { Container, Nav, Navbar, Stack } from "react-bootstrap";
import { FaLocationArrow } from "react-icons/fa";
export default function DashboardWrapper({ children }) {
  return (
    <div>
      <Navbar className={style.nav} bg="light" collapseOnSelect expand="lg" sticky="top" >
        <Container>
          <Link to="/" className={`navbar-brand ${style.logo}`} >
              <img src={logo} alt="Logotipo"  />  
          </Link>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav" >
            <Nav className="me-auto">
              <Link to="/enlaces/principales">Enlaces principales</Link>
              <Link to="/enlaces/secundarios">Enlaces secundarios</Link>
              <Link to="/perfil">Perfil</Link>
              <Link to="/cerrar-sesion">Salir</Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className={style.main}>
        {children}
      </Container>
      <footer className={style.footer}>
        <Container >
          <div>
          <img src={logo} alt="Logotipo"  />  
          </div>
          <Stack gap={2}>
          <div className=""> 
          <FaLocationArrow/> Av. Irala, Edificio Irala 452.
          </div>
          <div className="">
          MTCORP           
          </div>
          <div className="">
            2022 - DERECHOS RESERVADOS
          </div>
          <div className="">
            PROYECTO DE: CLADERA
          </div>
          </Stack>
        </Container>

      </footer>
    </div>
  );
}
