import { useNavigate } from "react-router-dom";
import { AuthProviders } from "../components/authProvider";

export default function VisitProfile() {
  const navigate = useNavigate();
  async function handleUserLoggeIn(user) {
    window.open(handlerProfile(user.publicId),  '_blank');
    navigate("/");
 }
  function handleUserNotRegistered(user) {
    navigate("/iniciar-sesion");
  }
  function handleUserNotLoggedIn() {
    navigate("/iniciar-sesion");
  }
  function handlerProfile(publicId){
    let link = "https://soyyo.digital/u/#/" + publicId;
    return link;
  }
  return( 
    <AuthProviders
      onUserLoggedIn={handleUserLoggeIn}
      onUserNotLoggedIn={handleUserNotLoggedIn}
      onUserNotRegistered={handleUserNotRegistered}
    ></AuthProviders>
  )
}

