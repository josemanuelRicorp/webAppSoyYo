import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthProviders } from "../components/authProvider";
import DashboardWrapper from "../components/dashboardwrapper";

export default function DashboardView(){
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState({});
    const [state, setState] = useState(0);

    async function handleUserLoggeIn(user) {
        setCurrentUser(user);
        setState(2);
      }
      function handleUserNotRegistered(user) {
        navigate("/iniciar-sesion");
      }
      function handleUserNotLoggedIn() {
        navigate("/iniciar-sesion");
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
           <h1>Tablero de link</h1>
           <div>

           </div>
          
        </DashboardWrapper>
      );
    }
    