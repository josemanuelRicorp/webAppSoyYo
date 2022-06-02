import { Link } from "react-router-dom";
import style from "../styles/dashboardwrapper.module.css";
import logo from "../assets/img/logo.svg";
// import logo from "../assets/img/soyyo.png";
import { Container, Nav, Navbar } from "react-bootstrap";
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
              <Link to="/links/1">Enlaces principales</Link>
              <Link to="/links/2">Enlaces secundarios</Link>
              <Link to="/profile">Perfil</Link>
              <Link to="/signout">Salir</Link>
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
          <div>  <FaLocationArrow/> Av. Irala, Edificio Irala 452.</div>
          <div> MTCORP</div>
          <div>2022 - DERECHOS RESERVADOS </div>
          <div> PROYECTO DE: CLADERA</div>

        </Container>

      </footer>
    </div>
  );
}
