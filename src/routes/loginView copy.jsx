import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  fetchSignInMethodsForEmail,
  EmailAuthProvider
} from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { AuthProviders } from "../components/authProvider";

import style from "../styles/loginView.module.css";
import Loading from "../components/loading";

export default function LoginView() {
  const [currentUser, setCurrentUser] = useState(null);
  /**
   * STATE
   * 0: inicializado
   * 1: loading
   * 2: login completo
   * 3: login pero sin registro
   * 4: no hay nadie logueado
   * 5: ya existe el username
   * 6: nuevo username, click para continuar
   * 7: username no existe
   * 8: loaded
   */
  const [state, setCurrentState] = useState(0);
  const navigate = useNavigate();

  async function handleOnClickGoogle() {
    const googleProvider = new GoogleAuthProvider();
    try {
      await signInWithGoogle(googleProvider);
    } catch (error) {
      console.error(error);
    }
  }
  async function signInWithGoogle(googleProvider) {
    try {
      const res = await signInWithPopup(auth, googleProvider);
    } catch (error) {
      if (
        error.code === "auth/popup-closed-by-user" ||
        error.code === "auth/cancelled-popup-request"
      )
        return;
      else console.error(error);
      console.log({ error });
    }
  }
  async function handleOnClickFacebook() {
    const facebookProvider = new FacebookAuthProvider();
    try {
      await signInWithFacebook(facebookProvider);
    } catch (error) {
      console.error(error);
    }
  }
  async function signInWithFacebook(facebookProvider) {
    let existingEmail = null,
      pendinCredentials = null;
    try {
      const res = await signInWithPopup(auth, facebookProvider);
      console.log(res);
    } catch (error) {
      console.error(error);
      if (error.code == "auth/account-exists-with-different-credential") {
        existingEmail = error.email;
        pendinCredentials = error.credential;
        fetchSignInMethodsForEmail(auth, existingEmail).then((signInMethods) => {
          if (
            signInMethods.indexOf(
              EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD
            ) != -1
          ) {
            // User can sign in with email/password.
            console.log(" sign in with  email/password.");
          }
          if (
            signInMethods.indexOf(
              EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD
            ) != -1
          ) {
            // User can sign in with email/link.
            console.log(" sign in with email/link.");
          }
        });
      }
    }
  }

  function handleUserLoggeIn(user) {
    navigate("/");
  }
  function handleUserNotRegistered(user) {
    navigate("/asignar-alias");
  }
  function handleUserNotLoggedIn() {
    setCurrentState(4);
  }

  if (state === 4) {
    return (
      <div className={style.loginView}>
        <h1>Administración de SoyYo</h1>
        <button className={style.provider} onClick={handleOnClickGoogle}>
          Entrar con Google
        </button>
        <button className={style.provider} onClick={handleOnClickFacebook}>
          Entrar con Facebook
        </button>
      </div>
    );
  }

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
