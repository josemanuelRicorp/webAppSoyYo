import DashboardWrapper, { getUID } from "../components/dashboardwrapper";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../firebase/firebase";
import { AuthProviders } from "../components/authProvider";
import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import style from "../styles/editProfileView.module.css";
import {
  existUsername,
  getProfilePhotoUrl,
  updateUser,
  insertContact,
} from "../firebase/firebase";
import { Col, Row, Stack } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import ImageCropper from "../components/imageCropper";
import Loading from "../components/loading";
import { HiCheck } from "react-icons/hi";
import { CgClose } from "react-icons/cg";
import { FaPen } from "react-icons/fa";
import VCard from "vcard-creator";
import { v4 as uuidv4 } from "uuid";
export default function EditProfileView() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({});
  const [state, setState] = useState(0);
  const [profileUrl, setProfileUrl] = useState(null);
  const [show, setShow] = useState(false);
  const [username, setUsername] = useState("");
  const [publicId, setPublicId] = useState("");
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

  const myCanvasProfile = useRef();

  async function handleUserLoggeIn(user) {
    setCurrentUser(user);
    const url = await getProfilePhotoUrl(user.profilePicture);
    setProfileUrl(url);
    setUsername(user.username);
    setPublicId(user.publicId);
    setDisplayName(user.displayName);
    setCareer(user.career);
    setDescription(user.description);
    getCanvasProfile(url);
    setState(2);
  }
  function handleUserNotRegistered(user) {
    navigate("/iniciar-sesion");
  }
  function handleUserNotLoggedIn() {
    navigate("/iniciar-sesion");
  }

  async function loadPhoto() {
    const url = await getProfilePhotoUrl(currentUser.profilePicture);
    getCanvasProfile(url);
  }
  function handleOnHide() {
    loadPhoto();
    setTimeout(() => {
      setShow(false);
    }, 1000);
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
    if (e.target.name === "username" && value.length <= 15) {
      setUsername(value);
    }
  }
  function handleChangeDisplayName(e) {
    const value = e.target.value;
    if (e.target.name === "displayName" && value.length <= 20) {
      setDisplayName(value);
    }
  }
  function handleChangeCareer(e) {
    const value = e.target.value;
    if (e.target.name === "career" && value.length <= 20) {
      setCareer(value);
    }
  }

  function handleChangeDescription(e) {
    const value = e.target.value;
    if (e.target.name === "description" && value.length <= 60) {
      setDescription(value);
    }
  }

  function handleSuccessEditUsername() {
    if (username.length > 0) {
      handleUpdateUsername();
      setEditUsername(false);
    }
  }
  function handleSuccessEditDisplayName() {
    if (displayName.length > 0) {
      handleUpdateDisplayName();
      setEditDisplayName(false);
    }
  }
  function handleSuccessEditCareer() {
    if (career.length > 0) {
      handleUpdateCareer();
      setEditCareer(false);
    }
  }

  function handleSuccessEditDescription() {
    if (description.length > 0) {
      handleUpdateDescription();
      setEditDescription(false);
    }
  }

  async function handleUpdateUsername() {
    if (username !== "") {
      const exists = await existUsername(username);
      if (exists) {
        setState(5);
      } else {
        currentUser.username = username;
        await updateUser(currentUser).then(createContact());
        setState(6);
      }
    }
  }
  async function handleUpdateDisplayName() {
    currentUser.displayName = displayName;
    await updateUser(currentUser).then(createContact());
  }
  async function handleUpdateCareer() {
    currentUser.career = career;
    await updateUser(currentUser).then(createContact());
  }

  async function handleUpdateDescription() {
    currentUser.description = description;
    await updateUser(currentUser).then(createContact());
  }

  function handleLink() {
    let link = "https://soyyo.digital/u/#/" + publicId;
    return link;
  }
  async function createContact() {
    var myVCard = new VCard();
    const url = await getProfilePhotoUrl(currentUser.profilePicture);
    let image64 = await getBase64Image(url);
    let website = handleLink();
    if (
      currentUser.displayName !== "" ||
      currentUser.displayName !== null ||
      currentUser.displayName !== undefined
    ) {
      myVCard.addName(currentUser.displayName);
    }
    if (
      currentUser.email !== "" ||
      currentUser.email !== null ||
      currentUser.email !== undefined
    ) {
      myVCard.addEmail(currentUser.email, "PREF;WORK");
    }
    if (
      currentUser.personalPhone !== "" ||
      currentUser.personalPhone !== null ||
      currentUser.personalPhone !== undefined
    ) {
      myVCard.addPhoneNumber(currentUser.personalPhone, "WORK");
    }
    // if(address !== "" || address !== null || address!== undefined){
    //   myVCard.addAddress(address);
    // }
    if (
      currentUser.career !== "" ||
      currentUser.career !== null ||
      currentUser.career !== undefined
    ) {
      myVCard.addJobtitle(currentUser.career);
    }
    if (website !== "" || website !== null || website !== undefined) {
      myVCard.addURL(website);
    }
    if (image64 !== "" || image64 !== null || image64 !== undefined) {
      myVCard.addPhoto(image64);
    }
    const file = new Blob([myVCard.toString()], { type: "text/x-vcard" });
    file.name =
      currentUser.displayName.replaceAll(" ", "") +
      "-" +
      currentUser.publicId +
      ".vcf";
    console.log(currentUser);
    uploadFiles(file);
  }

  async function getBase64Image(urlImage) {
    var img = new Image();
    img.crossOrigin = "anonymous";
    img.src = urlImage;
    return new Promise((resolve) => {
      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL("image/png");
        resolve(dataURL.replace(/^data:image\/(png|jpg);base64,/, ""));
      };
    });
  }

  async function getCanvasProfile(url) {
    if (
      myCanvasProfile.current === undefined ||
      myCanvasProfile.current == null
    ) {
      return;
    }
    const context = myCanvasProfile.current.getContext("2d");
    const image = new Image();
    image.src = url;
    image.onload = () => {
      context.canvas.width = image.width;
      context.canvas.height = image.height;
      context.drawImage(image, 0, 0);
    };
  }

  const uploadFiles = (file) => {
    if (!file) return;
    const storageRef = ref(storage, `/contact/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const prog = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        // setProgress(prog);
      },
      (err) => console.log(err),
      function () {
        getDownloadURL(uploadTask.snapshot.ref).then((iconUrl) => {
          // setIconFile(iconUrl);
        });
      }
    );
  };

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
            <div className={style.profilePicture} width={100}>
              <canvas
                className={style.profilePictureImg}
                ref={myCanvasProfile}
                id="canvas-profile"
              ></canvas>
            </div>
          </div>
          <div>
            <button
              className="btn-custom btn-responsive"
              onClick={() => setShow(true)}
            >
              Cambiar foto de perfil
            </button>
            <ImageCropper
              user={currentUser}
              show={show}
              handleOnHide={handleOnHide}
            ></ImageCropper>
          </div>
        </div>
        <div className={style.containerPersonalData}>
          <Row className={style.rows}>
            <Col md lg={5}>
              <strong>Nombre de usuario</strong>
            </Col>
            <Col md lg={7} className={style.cols}>
              {editUsername ? (
                <>
                  <Stack direction="horizontal" gap={2}>
                    <InputGroup>
                      <Form.Control
                        ref={usernameRef}
                        type="text"
                        autoComplete="off"
                        placeholder="Escribe tu nombre de usuario"
                        name="username"
                        className="me-auto"
                        maxLength="20"
                        value={username}
                        onChange={handleChangeUsername}
                        isInvalid={username.length === 0 ? true : false}
                        isValid={username.length > 0 ? true : false}
                      />
                      <Form.Control.Feedback
                        type={username.length === 0 ? "invalid" : "valid"}
                        tooltip={false}
                      >
                        {`${username.length} carácteres, Máximo 15 carácteres `}
                      </Form.Control.Feedback>
                    </InputGroup>
                    <button
                      type="button"
                      className="btn-custom negative small"
                      onClick={handleCancelEditUsername}
                    >
                      <CgClose />
                    </button>
                    <div className="vr" />
                    <button
                      className="btn-custom small"
                      onClick={handleSuccessEditUsername}
                      type="button"
                    >
                      <HiCheck />
                    </button>
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
                    <span>
                      <FaPen className={style.iconEdit}></FaPen>
                    </span>
                    {/*  <span><FaPen className={style.iconEdit}></FaPen></span> */}
                  </button>
                  {username}
                </>
              )}
            </Col>
          </Row>
          <Row className={style.rows}>
            <Col md lg={5}>
              <strong>Profesión</strong>
            </Col>
            <Col md lg={7} className={style.cols}>
              {editCareer ? (
                <Stack direction="horizontal" gap={2}>
                  <InputGroup>
                    <Form.Control
                      className="me-auto"
                      placeholder="Escribe tu profesión"
                      name="career"
                      type="text"
                      maxLength="40"
                      autoComplete="off"
                      ref={careerRef}
                      value={career}
                      onChange={handleChangeCareer}
                      isInvalid={career.length === 0 ? true : false}
                      isValid={career.length > 0 ? true : false}
                    />
                    <Form.Control.Feedback
                      type={career.length === 0 ? "invalid" : "valid"}
                      tooltip={false}
                    >
                          {`${career.length} carácteres, Máximo 40 carácteres `}
                    </Form.Control.Feedback>
                  </InputGroup>
                  <button
                    type="button"
                    className="btn-custom negative small"
                    onClick={handleCancelEditCareer}
                  >
                    <CgClose />
                  </button>
                  <div className="vr" />
                  <button
                    className="btn-custom small"
                    onClick={handleSuccessEditCareer}
                    type="button"
                  >
                    <HiCheck />
                  </button>
                </Stack>
              ) : (
                <>
                  <button className={style.btnEdit} onClick={handleEditCareer}>
                    <span>
                      <FaPen className={style.iconEdit}></FaPen>
                    </span>
                  </button>
                  {career}
                </>
              )}
            </Col>
          </Row>
          <Row className={style.rows}>
            <Col md lg={5}>
              <strong>Enlace del perfil</strong>
            </Col>
            <Col md lg={7} className={style.cols}>
              <a
                className={style.link}
                rel="noreferrer"
                target="_blank"
                href={handleLink()}
              >
                Abrir perfil
              </a>
            </Col>
          </Row>

          <Row className={style.rows}>
            <Col md lg={5}>
              <strong>Nombre público</strong>
            </Col>
            <Col md lg={7} className={style.cols}>
              {editDisplayName ? (
                <Stack direction="horizontal" gap={2}>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      autoComplete="off"
                      placeholder="Escribe tu nombre"
                      name="displayName"
                      maxLength="40"
                      className="me-auto"
                      ref={displayNameRef}
                      value={displayName}
                      onChange={handleChangeDisplayName}
                      isInvalid={displayName.length === 0 ? true : false}
                      isValid={displayName.length > 0 ? true : false}
                    />
                    <Form.Control.Feedback
                      type={displayName.length === 0 ? "invalid" : "valid"}
                      tooltip={false}
                    >
                          {`${displayName.length} carácteres, Máximo 40 carácteres `}
                    </Form.Control.Feedback>
                  </InputGroup>
                  <button
                    type="button"
                    className="btn-custom negative small"
                    onClick={handleCancelEditDisplayName}
                  >
                    <CgClose />
                  </button>
                  <div className="vr" />
                  <button
                    className="btn-custom small"
                    onClick={handleSuccessEditDisplayName}
                    type="button"
                  >
                    <HiCheck />
                  </button>
                </Stack>
              ) : (
                <>
                  <button
                    className={style.btnEdit}
                    onClick={handleEditDisplayName}
                  >
                    <span>
                      <FaPen className={style.iconEdit}></FaPen>
                    </span>
                  </button>
                  {displayName}
                </>
              )}
            </Col>
          </Row>

          <Row className={style.rows}>
            <Col md lg={5}>
              <strong>Acerca de mi</strong>
            </Col>

            <Col md lg={7} className={style.cols}>
              {editDescription ? (
                <Stack direction="horizontal" gap={2}>
                  <InputGroup>
                    <Form.Control
                      className="me-auto"
                      as="textarea"
                      style={{ height: "100px" }}
                      maxLength="150"
                      resizable="false"
                      rows={3}
                      cols={50}
                      name="description"
                      autoComplete="off"
                      placeholder="Escribe una breve descripción acerca de tí"
                      ref={descriptionRef}
                      onChange={handleChangeDescription}
                      value={description}
                      isInvalid={description.length === 0 ? true : false}
                      isValid={description.length > 0 ? true : false}
                    />
                    <Form.Control.Feedback
                      type={description.length === 0 ? "invalid" : "valid"}
                      tooltip={false}
                    >
                          {`${description.length} carácteres, Máximo 40 carácteres `}
                    </Form.Control.Feedback>
                  </InputGroup>
                  <button
                    type="button"
                    className="btn-custom negative small"
                    onClick={handleCancelEditDescription}
                  >
                    <CgClose />
                  </button>
                  <div className="vr" />
                  <button
                    className="btn-custom small"
                    onClick={handleSuccessEditDescription}
                    type="button"
                  >
                    <HiCheck />
                  </button>
                </Stack>
              ) : (
                <>
                  <button
                    className={style.btnEdit}
                    onClick={handleEditDescription}
                  >
                    <span>
                      <FaPen className={style.iconEdit}></FaPen>
                    </span>
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
