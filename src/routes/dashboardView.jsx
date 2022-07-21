import { doc, onSnapshot } from "firebase/firestore";
import { useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthProviders } from "../components/authProvider";
import DashboardWrapper from "../components/dashboardwrapper";
import { db } from "../firebase/firebase";

export default function DashboardView() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({});
  const [state, setState] = useState(0);
//variables para guardar redes primarias y secundarias
const [links, setLinks] = useState({
  whatsApp: 0,
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
  qrOffline: 0
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

  if (state === 0) {
    return (
      <AuthProviders
        onUserLoggedIn={handleUserLoggeIn}
        onUserNotLoggedIn={handleUserNotRegistered}
        onUserNotRegistered={handleUserNotLoggedIn}
      ></AuthProviders>
    );
  }


//obtener la lista de redes por usuario y mistrarlas en su perfil
const docRef = doc(db, 'VisitsCounter', currentUser.publicId)
onSnapshot(docRef, (doc) => {
  setLinks({
    whatsApp: doc.data().whatsapp,
    shareRRSS: doc.data().shareRRSS,
    email: doc.data().email,
    phone: doc.data().phone,
    maps: doc.data().maps,
    linkedin: doc.data().linkedin,
    facebook: doc.data().facebook,
    instagram: doc.data().instagram,
    tiktok: doc.data().tiktok,
    twitter: doc.data().twitter,
    twitch: doc.data().twitch,
    qrOffline: doc.data().qrOffline
  })
})


  return (
    <DashboardWrapper>
      <h1>Tablero</h1>
      <small>En este apartado puedes ver las interacciones que tuvo tu perfil.</small>
    <Row sm={2}>
        <Col>
          <Card className="mt-3 text-center">
            <Card.Body>
              <Card.Title>{links.whatsApp}</Card.Title>
              <Card.Text>Whatsapp</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="mt-3 text-center">
            <Card.Body>
              <Card.Title>{links.email}</Card.Title>
              <Card.Text>Email</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="mt-3 text-center">
            <Card.Body>
              <Card.Title>{links.phone}</Card.Title>
              <Card.Text>Teléfono</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="mt-3 text-center">
            <Card.Body>
              <Card.Title>{links.facebook}</Card.Title>
              <Card.Text>Facebook</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="mt-3 text-center">
            <Card.Body>
              <Card.Title>{links.maps}</Card.Title>
              <Card.Text>Maps</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="mt-3 text-center">
            <Card.Body>
              <Card.Title>{links.linkedin}</Card.Title>
              <Card.Text>Linkedin</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="mt-3 text-center">
            <Card.Body>
              <Card.Title>{links.instagram}</Card.Title>
              <Card.Text>Instagram</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col className="ml-3 mr-3">
          <Card className="mt-3 text-center">
            <Card.Body>
              <Card.Title>{links.tiktok}</Card.Title>
              <Card.Text>Tiktok</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="mt-3 text-center">
            <Card.Body>
              <Card.Title>{links.twitter}</Card.Title>
              <Card.Text>Twitter</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="mt-3 text-center">
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
