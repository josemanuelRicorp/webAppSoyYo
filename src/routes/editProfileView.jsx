import DashboardWrapper from "../components/dashboardwrapper";
import { AuthProviders } from "../components/authProvider";
import { Link, useNavigate } from "react-router-dom";
import {  useRef, useState } from "react";
import style from "../styles/editProfileView.module.css";
import {
  existUsername,
  getProfilePhotoUrl,
  updateUser,
} from "../firebase/firebase";
import {  Col, Form, Modal, Row, Stack } from "react-bootstrap";
import ImageCropper from "../components/imageCropper";
import { IoWarningOutline } from "react-icons/io5";
import Loading from "../components/loading";
import { HiCheck } from "react-icons/hi";
import { CgClose } from "react-icons/cg";




export default function EditProfileView() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({});
  const [state, setState] = useState(0);
  const [profileUrl, setProfileUrl] = useState(null);

  const [show, setShow] = useState(false);
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [career, setCareer] = useState("");
  const [description, setDescription] = useState("");

  const [editUsername, setEditUsername] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState(false);
  const [editCareer, setEditCareer] = useState(false);
  const [editDescription, setEditDescription] = useState(false);

  const usernameRef = useRef(null);
  const displayNameRef = useRef(null);
  const careerRef = useRef(null);
  const descriptionRef = useRef(null);



  async function handleUserLoggeIn(user) {
    setCurrentUser(user);
    const url = await getProfilePhotoUrl(user.profilePicture);
    setProfileUrl(url);
    setUsername(user.username);
    setDisplayName(user.displayName);
    setCareer(user.career);
    setDescription(user.description);
    setState(2);
  }
  function handleUserNotRegistered(user) {
    navigate("/iniciar-sesion");
  }
  function handleUserNotLoggedIn() {
    navigate("/iniciar-sesion");
  }

  async function loadPhoto(){
    const url = await getProfilePhotoUrl(currentUser.profilePicture);
    setProfileUrl(url);
  }
  function handleOnHide(){
    setShow(false);
    loadPhoto();
  } 

  function handleEditUsername() {
    setEditUsername(true);
  }
  function handleEditDisplayName() {
    setEditDisplayName(true);
  }
  function handleEditCareer() {
    setEditCareer(true);
  }
  function handleEditDescription() {
    setEditDescription(true);
  }

  function handleCancelEditUsername() {
    setUsername(currentUser.username);
    setEditUsername(false);
  }
  function handleCancelEditDisplayName() {
    setDisplayName(currentUser.displayName);
    setEditDisplayName(false);
  }
  function handleCancelEditCareer() {
    setCareer(currentUser.career);
    setEditCareer(false);
  }
  function handleCancelEditDescription() {
    setDescription(currentUser.description);
    setEditDescription(false);
  }

  function handleChangeUsername(e) {
    const value = e.target.value;
    if (e.target.name === "username") {
      setUsername(value);
    }
  }
  function handleChangeDisplayName(e) {
    const value = e.target.value;
    if (e.target.name === "displayName") {
      setDisplayName(value);
    }
  }
  function handleChangeCareer(e) {
    const value = e.target.value;
    if (e.target.name === "career") {
      setCareer(value);
    }
  }
  function handleChangeDescription(e) {
    const value = e.target.value;
    if (e.target.name === "description") {
      setDescription(value);
    }
  }

  function handleSuccessEditUsername() {
    handleUpdateUsername();
    setEditUsername(false);
  }
  function handleSuccessEditDisplayName() {
    handleUpdateDisplayName();
    setEditDisplayName(false);
  }
  function handleSuccessEditCareer() {
    handleUpdateCareer();
    setEditCareer(false);
  }
  function handleSuccessEditDescription() {
    handleUpdateDescription();
    setEditDescription(false);
  }

  async function handleUpdateUsername() {
    if (username !== "") {
      const exists = await existUsername(username);
      if (exists) {
        setState(5);
      } else {
        const tmp = { ...currentUser };
        tmp.username = username;  
        await updateUser(tmp);
        setState(6);
      }
    }
  }
  async function handleUpdateDisplayName() {
    if (displayName !== "") {
      const tmp = { ...currentUser };
      tmp.displayName = displayName;
      await updateUser(tmp);
    }
  }
  async function handleUpdateCareer() {
    if (career !== "") {
      const tmp = { ...currentUser };
      tmp.career = career;
      await updateUser(tmp);
    }
  }
  async function handleUpdateDescription() {
    if (description !== "") {
      const tmp = { ...currentUser };
      tmp.description = description;
      await updateUser(tmp);
    }
  }
  
function handleLink(){
  let link ="/u/"+ username;
  return link; 
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
        <div className={style.profilePictureContainer}>
          <div>
            <img src={profileUrl} alt="profile_photo" width={100} />
          </div>
          <div>
          <button className="btn-custom" onClick={() => setShow(true)}>
              Cambiar foto de perfil
            </button>
            <ImageCropper user={currentUser} show={show} handleOnHide={handleOnHide} ></ImageCropper>
        </div>
        </div>
        <div className={style.containerPersonalData}>
          <Row className={style.rows}>
            <Col>
              <strong>Nombre de usuario</strong>
            </Col>
            <Col>
              {editUsername ? (
                <>
                  <Stack direction="horizontal" gap={2}>
                    <input
                    ref={usernameRef}
                    type="text"
                    autoComplete="off"
                    placeholder="Escribe tu nombre de usuario"
                    name="username"
                    className="me-auto"
                    value={username}
                    onChange={handleChangeUsername}
                    />
                    <button
                    type="button"
                    className="btn-custom negative small"
                    onClick={handleCancelEditUsername}>
                    <CgClose/></button>            
                    <div className="vr" />
                    <button
                    className="btn-custom small"
                    onClick={handleSuccessEditUsername}
                    type="button"
                  ><HiCheck/></button>
                </Stack>
                <Row>
                {state === 5 ? (
                    <p>
                      Ese nombre de usuario ya existe, por favor escoje otro.
                    </p>
                  ) : (
                    ""
                  )}
                </Row>
                </>
              ) : (
                <>
                  <button
                    className={style.btnEdit}
                    onClick={handleEditUsername}
                  >
                  <span className="material-icons">edit</span>
                  </button>
                  {username}
                </>
              )}
                 
            </Col>
          </Row>


          <Row className={style.rows} >
            <Col><strong>Enlace del perfil</strong></Col>
            <Col>
            <Link rel="noreferrer"  target="_blank" to={handleLink()}>Visita tu perfil dando clic al enlace.</Link>
            </Col>
          </Row>

          <Row className={style.rows}>
            <Col>
              <strong>Nombre público</strong>
            </Col>
            <Col>
              {editDisplayName ? (      
                <Stack direction="horizontal" gap={2}>
                   <input 
                    type="text"
                    autoComplete="off"
                    placeholder="Escribe tu nombre"
                    name="displayName"
                    className="me-auto"
                    ref={displayNameRef}
                    value={displayName}
                    onChange={handleChangeDisplayName}
                  />   
                  <button
                    type="button"
                    className="btn-custom negative small"
                    onClick={handleCancelEditDisplayName}>
                  <CgClose/></button>
                  <div className="vr" />
                  <button
                    className="btn-custom small"
                    onClick={handleSuccessEditDisplayName}
                    type="button"
                  ><HiCheck/></button>
              </Stack>
              ) : (
                <>
                  <button
                    className={style.btnEdit}
                    onClick={handleEditDisplayName}>
                    <span className="material-icons">edit</span>
                  </button>
                  {displayName}
                </>
              )}
            </Col>
          </Row>


          <Row className={style.rows}>
            <Col>
              <strong>Profesión</strong>
            </Col>
            <Col>
              {editCareer ? (
                <Stack direction="horizontal" gap={2}>
                  <input
                    className="me-auto"
                    placeholder="Escribe tu profesión"
                    name="career"
                    type="text"
                    autoComplete="off"
                    ref={careerRef}
                    value={career}
                    onChange={handleChangeCareer}/>
                    <button
                    type="button"
                    className="btn-custom negative small"
                    onClick={handleCancelEditCareer}>
                  <CgClose/></button>
                  <div className="vr" />
                  <button
                    className="btn-custom small"
                    onClick={handleSuccessEditCareer}
                    type="button"
                  ><HiCheck/></button>
                </Stack>
              ) : (
                <>
                  <button className={style.btnEdit} onClick={handleEditCareer}>
                    <span className="material-icons">edit</span>
                  </button>
                  {career}
                </>
              )}
            </Col>
          </Row>
          <Row className={style.rows}>
            <Col>
              <strong>Acerca de mi</strong>
            </Col>
            
            <Col>
              {editDescription ? (
                <Stack direction="horizontal" gap={2}>
                  <textarea
                  className="me-auto"
                  type="textarea"
                  style={{ height: '100px' }}
                  resizable="false"
                  rows={3}
                  cols={50}
                  name="description"
                  autoComplete="off"
                  placeholder="Escribe una breve descripción acerca de tí"
                  ref={descriptionRef}
                  onChange={handleChangeDescription}
                  value={description}>
                  </textarea>
                <button
                    type="button"
                    className="btn-custom negative small"
                    onClick={handleCancelEditDescription}>
                  <CgClose/>
                </button>
                <div className="vr" />
                <button
                    className="btn-custom small"
                    onClick={handleSuccessEditDescription}
                    type="button"
                  ><HiCheck/>
                  </button>
                </Stack>
              ) : (
                <>
                  <button
                    className={style.btnEdit}
                    onClick={handleEditDescription}
                  >
                    <span className="material-icons">edit</span>
                  </button>
                  {description}
                </>
              )}
            </Col>
          </Row>
        </div>
      </div>
    </DashboardWrapper>
  );
}
