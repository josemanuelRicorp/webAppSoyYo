import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthProviders } from "../components/authProvider";
import Loading from "../components/loading";
import { existUsername, storage, updateUser } from "../firebase/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import style from "../styles/chooseUsername.module.css";
import QRCode from "qrcode";

export default function ChooseUserNameView() {
  const navigate = useNavigate();
  const [state, setState] = useState(0);
  const [currentUser, setCurrentUser] = useState({});
  const [username, setUsername] = useState("");
  function handleUserLoggeIn(user) {
    navigate("/");
  }
  function handleUserNotRegistered(user) {
    setCurrentUser(user);
    setState(3);
  }
  function handleUserNotLoggedIn() {
    navigate("/iniciar-sesion");
  }

  function handleInputUsername(e) {
    setUsername(e.target.value);
  }
  function generarQR(usercito) {
    console.log('usercito', usercito.username)
    QRCode.toDataURL("https://soyyo.digital/u/#/" + usercito.publicId).then((data) => {
      usercito.qrCodeURL = data;
      updateUser(usercito).then(navigate("/"));

    });
  }
  async function handleContinue() {
    if (username !== "") {
      const exists = await existUsername(username);
      if (exists) {
        setState(5);
      } else {
        const tmp = { ...currentUser };
        tmp.username = username;
        tmp.processCompleted = true;
        console.log('generarQR(currentUser.publicId);', currentUser.publicId);
        await updateUser(tmp).then(() => {
          generarQR(tmp);
        });
      }
    }
  }

  if (state === 3 || state === 5) {
    return (
      <div className={style.chooseUsernameContainer}>
        <h1>¬°Bienvenido {currentUser.displayName}!</h1>
        <p>
          Para cerrar el proceso de registro, por favor escoja un nombre de
          usuario.
        </p>
        {state === 5 ? (
          <p className="span-info-user">Ese nombre de usuario ya existe, por favor elija otro</p>
        ) : (
          ""
        )}
        <div>
          <input className="input" type="text" onChange={handleInputUsername} />
        </div>
        <div>
          <button className="btn-custom mt-2" onClick={handleContinue}>
            Continuar
          </button>
        </div>
      </div>
    );
  }
  // if (state === 6) {
  //   return (
  //     <div className={style.chooseUsernameContainer}>
  //       <h1>
  //         Puedes dirigirte al tablero para crear tus propios enlaces de contacto
  //       </h1>
  //       <Link to="/dashboard">Continuar...</Link>
  //     </div>
  //   );
  // }

  return (
    <AuthProviders
      onUserLoggedIn={handleUserLoggeIn}
      onUserNotRegistered={handleUserNotRegistered}
      onUserNotLoggedIn={handleUserNotLoggedIn}
    >
      <Loading></Loading>
    </AuthProviders>
  );
}
