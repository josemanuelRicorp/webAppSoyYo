import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
  } from "firebase/auth";
  import { useState } from "react";
  import { Link, useNavigate } from "react-router-dom";
  import { auth } from "../firebase/firebase";
  import style from "../styles/registerView.module.css";
  import styleForm from "../styles/loginRegisterForms.module.css";
  import Loading from "../components/loading";
  
  export default function RegisterView() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [state, setCurrentState] = useState(0);
    const navigate = useNavigate();
  
    const validatePassword = () => {
      let isValid = true;
      if (password !== "" && confirmPassword !== "") {
        if (password !== confirmPassword) {
          isValid = false;
          setError("Passwords does not match");
        }
      }
      return isValid;
    };
  
    const register = (e) => {
      e.preventDefault();
      setError("");
      if (validatePassword()) {
        createUserWithEmailAndPassword(auth, email, password)
          .then(() => {
            sendEmailVerification(auth.currentUser)
              .then(() => { 
                setError("Perfil creado correctamente.");          
              })
              .catch((err) => alert(err.message));
          })
          .catch((err) => setError(err.message));
      }
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    };
  
    return (
      <div className={style.registerView}>
        <div className={styleForm.auth}>
          <h1>Registrarse</h1>
          {error && <div className="auth__error">{error}</div>}
          <form onSubmit={register} name="registration_form">
            <input
              type="email"
              value={email}
              placeholder="Ingresa tu correo electrónico"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
  
            <input
              type="password"
              value={password}
              required
              placeholder="Ingresa tu contraseña"
              onChange={(e) => setPassword(e.target.value)}
            />
  
            <input
              type="password"
              value={confirmPassword}
              required
              placeholder="Confirmar contraseña"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
  
            <button type="submit">Registrarse</button>
          </form>
          <p>
            ¿Ya tienes una cuenta?
            <Link to="/iniciar-sesion">Iniciar Sesión</Link>
          </p>
        </div>
      </div>
    );
  }