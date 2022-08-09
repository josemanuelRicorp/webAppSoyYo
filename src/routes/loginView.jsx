import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  sendEmailVerification
} from "firebase/auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { AuthProviders } from "../components/authProvider";
import styleForm from "../styles/loginRegisterForms.module.css";
import style from "../styles/loginView.module.css";
import Loading from "../components/loading";

export default function LoginView() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
   const [state, setCurrentState] = useState(0);
  const navigate = useNavigate();
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
   const signInWithEmail = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        if (!auth.currentUser.emailVerified) {
          sendEmailVerification(auth.currentUser)
            .then(() => {
            })
            .catch((err) => alert(err.message));
        } else {
          navigate("/");
        }
      })
      .catch((err) => setError(err.message));
  };
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
    try {
      const res = await signInWithPopup(auth, facebookProvider);
    } catch (error) {
      if (
        error.code === "auth/popup-closed-by-user" ||
        error.code === "auth/cancelled-popup-request"
      ) {
        return;
      } else if (
        error.code === "auth/account-exists-with-different-credential"
      ) {
      } else {
        console.error(error);
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
        <div className={styleForm.auth}>
        <h1>Iniciar Sesión</h1>
        {error && <div className="auth__error">{error}</div>}
        <form onSubmit={signInWithEmail} name="login_form">
          <input
            type="email"
            value={email}
            required
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            value={password}
            required
            placeholder="Contraseña"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Iniciar Sesión</button>
        </form>
        <p>
          ¿Aún no tienes una cuenta?{" "}
          <Link to="/registrarse">Registrarse</Link>
        </p>
        <button className={style.provider} onClick={handleOnClickGoogle}>
          Entrar con Google
        </button>
        <button className={style.provider} onClick={handleOnClickFacebook}>
          Entrar con Facebook
        </button>
      </div>
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
