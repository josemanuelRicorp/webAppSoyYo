import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthProviders } from "../components/authProvider";
import { v4 as uuidv4 } from "uuid";
import {
  getLinks,
  getLinksBySocialMedia,
  insertNewLink,
  updateLink,
} from "../firebase/firebase";
import DashboardWrapper from "../components/dashboardwrapper";
import style from "../styles/dashboardView.module.css";
import { Accordion, Button, Col, Form, Row } from "react-bootstrap";
import {
  linkFacebook,
  linkInstagram,
  linkLinkedin,
  linkTiktok,
  linkTwitch,
  linkTwitter,
} from "../utils/socialMediaLinks";
import {
  link2FieldsFacebook,
  link2FieldsInstagram,
  link2FieldsLinkedin,
  link2FieldsTiktok,
  link2FieldsTwitch,
  link2FieldsTwitter,
} from "../utils/socialMediaFields";

export default function LinksSecondaryView() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({});
  const [state, setState] = useState(0);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [socialmedia, setSocialmedia] = useState("");

  const [links, setLinks] = useState([]);

  const [linkedinUsername, setLinkedinUsername] = useState("");
  const [facebookUsername, setFacebookUsername] = useState("");
  const [instagramUsername, setInstagramUsername] = useState("");
  const [twitterUsername, setTwitterUsername] = useState("");
  const [tiktokUsername, setTiktokUsername] = useState("");
  const [twitchUsername, setTwitchUsername] = useState("");

  const [spotifyPodcast, setSpotifyPodcast] = useState("");
  const [youtubeChannel, setYoutubeChannel] = useState("");
  const [discordChannel, setDiscordChannel] = useState("");

  const [currentLinkLinkedin, setCurrentLinkLinkedin] = useState({});
  const [currentLinkFacebook, setCurrentLinkFacebook] = useState({});
  const [currentLinkInstagram, setCurrentLinkInstagram] = useState({});
  const [currentLinkTwitter, setCurrentLinkTwitter] = useState({});
  const [currentLinkTiktok, setCurrentLinkTiktok] = useState({});
  const [currentLinkTwitch, setCurrentLinkTwitch] = useState({});

  const [linkedinLinkDocId, setLinkedinLinkDocId] = useState("");
  const [facebookLinkDocId, setFacebookLinkDocId] = useState("");
  const [instagramLinkDocId, setInstagramLinkDocId] = useState("");
  const [twitterLinkDocId, setTwitterLinkDocId] = useState("");
  const [tiktokLinkDocId, setTiktokLinkDocId] = useState("");
  const [twitchLinkDocId, setTwitchLinkDocId] = useState("");

  async function handleUserLoggeIn(user) {
    setCurrentUser(user);
    setState(2);
    initLinkedin(user.uid);
    initFacebook(user.uid);
    initInstagram(user.uid);
    initTiktok(user.uid);
    initTwitter(user.uid);
    initTwitch(user.uid);
    const resLinks = await getLinks(user.uid);
    setLinks([...resLinks]);
  }
  function handleUserNotRegistered(user) {
    navigate("/iniciar-sesion");
  }
  function handleUserNotLoggedIn() {
    navigate("/iniciar-sesion");
  }

  async function initLinkedin(uid) {
    const resLinks = await getLinksBySocialMedia(uid, "linkedin");
    if (resLinks.length > 0) {
      const linkObject = [...resLinks][0];
      setCurrentLinkLinkedin(() => ({
        ...currentLinkLinkedin,
        ...linkObject,
      }));
      setLinkedinLinkDocId(linkObject.docId);
      let fieldsData = link2FieldsLinkedin(linkObject.url);
      setLinkedinUsername(fieldsData.username);
    }
  }

  async function initFacebook(uid) {
    const resLinks = await getLinksBySocialMedia(uid, "facebook");
    if (resLinks.length > 0) {
      const linkObject = [...resLinks][0];
      setCurrentLinkFacebook(() => ({
        ...currentLinkFacebook,
        ...linkObject,
      }));
      setFacebookLinkDocId(linkObject.docId);
      let fieldsData = link2FieldsFacebook(linkObject.url);
      setFacebookUsername(fieldsData.username);
    }
  }

  async function initInstagram(uid) {
    const resLinks = await getLinksBySocialMedia(uid, "instagram");
    if (resLinks.length > 0) {
      const linkObject = [...resLinks][0];
      setCurrentLinkInstagram(() => ({
        ...currentLinkInstagram,
        ...linkObject,
      }));
      setInstagramLinkDocId(linkObject.docId);
      let fieldsData = link2FieldsInstagram(linkObject.url);
      setInstagramUsername(fieldsData.username);
    }
  }

  async function initTiktok(uid) {
    const resLinks = await getLinksBySocialMedia(uid, "tiktok");
    if (resLinks.length > 0) {
      const linkObject = [...resLinks][0];
      setCurrentLinkTiktok(() => ({
        ...currentLinkTiktok,
        ...linkObject,
      }));
      setTiktokLinkDocId(linkObject.docId);
      let fieldsData = link2FieldsTiktok(linkObject.url);
      setTiktokUsername(fieldsData.username);
    }
  }

  async function initTwitter(uid) {
    const resLinks = await getLinksBySocialMedia(uid, "twitter");
    if (resLinks.length > 0) {
      const linkObject = [...resLinks][0];
      setCurrentLinkTwitter(() => ({
        ...currentLinkTwitter,
        ...linkObject,
      }));
      setTwitterLinkDocId(linkObject.docId);
      let fieldsData = link2FieldsTwitter(linkObject.url);
      setTwitterUsername(fieldsData.username);
    }
  }
  async function initTwitch(uid) {
    const resLinks = await getLinksBySocialMedia(uid, "twitch");
    if (resLinks.length > 0) {
      const linkObject = [...resLinks][0];
      setCurrentLinkTwitch(() => ({
        ...currentLinkTwitch,
        ...linkObject,
      }));
      setTwitchLinkDocId(linkObject.docId);
      let fieldsData = link2FieldsTwitch(linkObject.url);
      setTwitchUsername(fieldsData.username);
    }
  }

  function addLink() {
    if (title !== "" && url !== "") {
      const newLink = {
        id: uuidv4(),
        title: title,
        url: url,
        socialmedia: socialmedia,
        uid: currentUser.uid,
      };
      const res = insertNewLink(newLink);
      console.log([url, title, socialmedia]);
      newLink.docId = res.id;
      setTitle("");
      setUrl("");
      setSocialmedia("");
    }
  }

  function update(currentLinkDocId) {
    if (title !== "" && url !== "") {
      console.log({ title, url });
      const link = {
        title: title,
        url: url,
        socialmedia: socialmedia,
        uid: currentUser.uid,
      };
      const res = updateLink(currentLinkDocId, link);
      link.docId = res.id;
      setTitle("");
      setUrl("");
    }
  }
  async function editLink(currentLinkDocId) {
    update(currentLinkDocId);
  }

  function handleOnSubmitLinkedin(e) {
    e.preventDefault();
    e.stopPropagation();
    setTitle("Linkedin");
    setSocialmedia("linkedin");
    if (linkedinUsername !== "") {
      setUrl(linkLinkedin(linkedinUsername));
      if (linkedinLinkDocId !== "") {
        editLink(linkedinLinkDocId);
      } else {
        addLink();
      }
    }
  }

  function handleOnSubmitFacebook(e) {
    e.preventDefault();
    e.stopPropagation();
    setTitle("Facebook");
    setSocialmedia("facebook");
    if (facebookUsername !== "") {
      setUrl(linkFacebook(facebookUsername));
      if (facebookLinkDocId !== "") {
        editLink(facebookLinkDocId);
      } else {
        addLink();
      }
    }
  }

  function handleOnSubmitInstagram(e) {
    e.preventDefault();
    e.stopPropagation();
    setTitle("Instagram");
    setSocialmedia("instagram");
    if (instagramUsername !== "") {
      setUrl(linkInstagram(instagramUsername));
      if (instagramLinkDocId !== "") {
        editLink(instagramLinkDocId);
      } else {
        addLink();
      }
    }
  }
  function handleOnSubmitTiktok(e) {
    e.preventDefault();
    e.stopPropagation();
    setTitle("Tiktok");
    setSocialmedia("tiktok");
    if (tiktokUsername) {
      setUrl(linkTiktok(tiktokUsername));
      if (tiktokLinkDocId !== "") {
        editLink(tiktokLinkDocId);
      } else {
        addLink();
      }
    }
  }
  function handleOnSubmitTwitter(e) {
    e.preventDefault();
    e.stopPropagation();
    setTitle("Twitter");
    setSocialmedia("twitter");
    setUrl(linkTwitter(twitterUsername));
    if (twitterUsername) {
      if (twitterLinkDocId !== "") {
        editLink(twitterLinkDocId);
      } else {
        addLink();
      }
    }
  }

  function handleOnSubmitTwitch(e) {
    e.preventDefault();
    e.stopPropagation();
    setTitle("Twitch");
    setSocialmedia("twitch");
    setUrl(linkTwitch(twitchUsername));
    if (twitchLinkDocId !== "") {
      editLink(twitchLinkDocId);
    } else {
      addLink();
    }
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
        <h1>Enlaces secundarios</h1>
        <p>
        En este apartado tienes que personalizar la información de los enlaces
           que quieres tener en tu perfil.
        </p>
        <Accordion className={style.accordionCustom}>
          <Accordion.Item eventKey="1" className={style.accordionItemCustom}>
            <Accordion.Header>Linkedin</Accordion.Header>
            <Accordion.Body>
              <Form autoComplete={'off'} onSubmit={handleOnSubmitLinkedin}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextEmail"
                >
                  <Form.Label column sm="4">
                    linkedin.com/
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      className="input"
                      type="text"
                      placeholder="Nombre de usuario"
                      value={linkedinUsername}
                      onChange={(e) => {
                        setLinkedinUsername(e.target.value);
                      }}
                      autoComplete="off"
                      
                    />
                  </Col>
                </Form.Group>
                <Button type="submit">Guardar datos</Button>
              </Form>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2" className={style.accordionItemCustom}>
            <Accordion.Header>Facebook</Accordion.Header>
            <Accordion.Body>
              <Form autoComplete={'off'} onSubmit={handleOnSubmitFacebook}>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm="4">
                    facebook.com/
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      className="input"
                      type="text"
                      placeholder="Nombre de usuario"
                      value={facebookUsername}
                      onChange={(e) => {
                        setFacebookUsername(e.target.value);
                      }}
                      autoComplete="off"
                    />
                  </Col>
                </Form.Group>
                <Button type="submit">Guardar datos</Button>
              </Form>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="3" className={style.accordionItemCustom}>
            <Accordion.Header>Instagram</Accordion.Header>
            <Accordion.Body>
              <Form autoComplete={'off'} onSubmit={handleOnSubmitInstagram}>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm="4">
                    instagram.com/
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      className="input"
                      type="text"
                      value={instagramUsername}
                      onChange={(e) => {
                        setInstagramUsername(e.target.value);
                      }}
                      autoComplete="off"
                      placeholder="Nombre de usuario"
                    />
                  </Col>
                </Form.Group>
                <Button type="submit">Guardar datos</Button>
              </Form>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="4" className={style.accordionItemCustom}>
            <Accordion.Header>Tiktok</Accordion.Header>
            <Accordion.Body>
              <Form autoComplete={'off'} onSubmit={handleOnSubmitTiktok}>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm="4">
                    tiktok.com/
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      className="input"
                      type="text"
                      value={tiktokUsername}
                      onChange={(e) => {
                        setTiktokUsername(e.target.value);
                      }}
                      autoComplete="off"
                      placeholder="Nombre de usuario"
                    />
                  </Col>
                </Form.Group>
                <Button type="submit">Guardar datos</Button>
              </Form>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="5" className={style.accordionItemCustom}>
            <Accordion.Header>Twitter</Accordion.Header>
            <Accordion.Body>
              <Form autoComplete={'off'} onSubmit={handleOnSubmitTwitter}>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm="4">
                    twitter.com/
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      className="input"
                      type="text"
                      value={twitterUsername}
                      onChange={(e) => {
                        setTwitterUsername(e.target.value);
                      }}
                      autoComplete="off"
                      placeholder="Nombre de usuario"
                    />
                  </Col>
                </Form.Group>
                <Button type="submit">Guardar datos</Button>
              </Form>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="6" className={style.accordionItemCustom}>
            <Accordion.Header>Twitch</Accordion.Header>
            <Accordion.Body>
              <Form autoComplete={'off'} onSubmit={handleOnSubmitTwitch}>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm="4">
                    twitch.tv/
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      className="input"
                      type="text"
                      value={twitchUsername}
                      onChange={(e) => {
                        setTwitchUsername(e.target.value);
                      }}
                      autoComplete="off"
                      placeholder="Nombre de usuario"
                    />
                  </Col>
                </Form.Group>
                <Button type="submit">Guardar datos</Button>
              </Form>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    </DashboardWrapper>
  );
}
