import { useNavigate } from "react-router-dom";
import { AuthProviders } from "../components/authProvider";
import { logout } from "../firebase/firebase";

export default function SignOutView() {
  const navigate = useNavigate();
  async function handleUserLoggeIn(user) {
    await logout().then(()=>{ window.location.reload();});
 }
  function handleUserNotRegistered(user) {
    navigate("/iniciar-sesion");
  }
  function handleUserNotLoggedIn() {
    navigate("/iniciar-sesion");
  }

  return( 
    <AuthProviders
      onUserLoggedIn={handleUserLoggeIn}
      onUserNotLoggedIn={handleUserNotLoggedIn}
      onUserNotRegistered={handleUserNotRegistered}
    >    </AuthProviders>
  )
}

