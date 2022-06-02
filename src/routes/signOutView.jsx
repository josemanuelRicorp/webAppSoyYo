import { useNavigate } from "react-router-dom";
import { AuthProviders } from "../components/authProvider";
import { logout } from "../firebase/firebase";

export default function SignOutView() {
  const navigate = useNavigate();
  async function handleUserLoggeIn(user) {
    
    await logout().then(()=>{ window.location.reload();});
    // localStorage.clear();
    // window.location.replace("https://www.delftstack.com");
    // window.location.replace("https://treelinkcv.web.app/");
   
  }
  function handleUserNotRegistered(user) {
    navigate("/login");
  }
  function handleUserNotLoggedIn() {
    navigate("/login");
  }

  return( 
    <AuthProviders
      onUserLoggedIn={handleUserLoggeIn}
      onUserNotLoggedIn={handleUserNotLoggedIn}
      onUserNotRegistered={handleUserNotRegistered}
    >    </AuthProviders>
  )
}

