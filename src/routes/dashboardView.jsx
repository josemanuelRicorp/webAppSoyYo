import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthProviders } from "../components/authProvider";
import DashboardWrapper from "../components/dashboardwrapper";
import { db } from "../firebase/firebase";
import style from '../styles/dashboardView.module.css';

export default function DashboardView() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({});
  const [state, setState] = useState(0);
  //variables para guardar redes primarias y secundarias
  const [links, setLinks] = useState({
    publicProfile: 0,
    whatsapp: 0,
    shareRRSS: 0,
    email: 0,
    phone: 0,
    maps: 0,
    linkedin: 0,
    facebook: 0,
    instagram: 0,
    tiktok: 0,
    twitter: 0,
    twitch: 0,
    qrOffline: 0,
  });
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

  async function getVista(idUser) {
    const docRef = doc(db, "VisitsCounter", idUser);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setLinks(docSnap.data());
    } else {
      // doc.data() will be undefined in this case
      console.error("No such document!");
    }
  }
  useEffect(() => {
    if (currentUser.publicId) {
      getVista(currentUser.publicId);
    }
  }, [currentUser]);

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
      <h1>Tablero</h1>
      <span>
        En este apartado puedes ver las interacciones que tuvo tu perfil.
      </span>
      <Row sm={2}>
        <Col sm={12} >
          <Card className={`mt-3 text-center ${style.cards}`}>
            <Card.Body>
              <Card.Title>{links.publicProfile}</Card.Title>
              <Card.Text><small>Visitas del perfil</small></Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
           <Card className={`mt-3 text-center ${style.cards}`}>
            <Card.Body>
              <Card.Title>{links.whatsapp}</Card.Title>
              <Card.Text>Whatsapp</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
           <Card className={`mt-3 text-center ${style.cards}`}>
            <Card.Body>
              <Card.Title>{links.email}</Card.Title>
              <Card.Text>Email</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
           <Card className={`mt-3 text-center ${style.cards}`}>
            <Card.Body>
              <Card.Title>{links.phone}</Card.Title>
              <Card.Text>Teléfono</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
           <Card className={`mt-3 text-center ${style.cards}`}>
            <Card.Body>
              <Card.Title>{links.facebook}</Card.Title>
              <Card.Text>Facebook</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
           <Card className={`mt-3 text-center ${style.cards}`}>
            <Card.Body>
              <Card.Title>{links.maps}</Card.Title>
              <Card.Text>Localización</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
           <Card className={`mt-3 text-center ${style.cards}`}>
            <Card.Body>
              <Card.Title>{links.linkedin}</Card.Title>
              <Card.Text>Linkedin</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
           <Card className={`mt-3 text-center ${style.cards}`}>
            <Card.Body>
              <Card.Title>{links.instagram}</Card.Title>
              <Card.Text>Instagram</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col className="ml-3 mr-3">
           <Card className={`mt-3 text-center ${style.cards}`}>
            <Card.Body>
              <Card.Title>{links.tiktok}</Card.Title>
              <Card.Text>Tiktok</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
           <Card className={`mt-3 text-center ${style.cards}`}>
            <Card.Body>
              <Card.Title>{links.twitter}</Card.Title>
              <Card.Text>Twitter</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
           <Card className={`mt-3 text-center ${style.cards}`}>
            <Card.Body>
              <Card.Title>{links.twitch}</Card.Title>
              <Card.Text>Twitch</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </DashboardWrapper>
  );
}
