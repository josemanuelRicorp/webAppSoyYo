import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  auth,
  getUserInfo,
  insertNewLink,
  registerNewUser,
  userExists,
} from "../firebase/firebase";
import { linkEmail } from "../utils/socialMediaLinks";
export function AuthProviders({
  children,
  onUserLoggedIn,
  onUserNotRegistered,
  onUserNotLoggedIn,
}) {
  useEffect(() => {
    //onAuthStateChanged
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        await userExists(user.uid).then(async (isRegistered) => {
          if (isRegistered == null || isRegistered == undefined) {
            // alert("ERROR DE CONEXION, INTENTA EN UNOS MINUTOS");
            // console.log('FALLA INTERNET', )
            return (window.location = "/admin#/iniciar-sesion");
          } else if (isRegistered) {
            const userInfo = await getUserInfo(user.uid);
            if (userInfo.processCompleted) {
              onUserLoggedIn(userInfo);
            } else {
              onUserNotRegistered(userInfo);
            }
          } else {
            console.log({ xd: user});

            await registerNewUser({
              uid: user.uid,
              displayName: user.displayName,
              email: user.email,
              profilePicture: "gs://soyyo-5ff46.appspot.com/default/user.png",
              theme: "color6",
              username: "",
              career: "",
              qrCodeURL: "",
              description: "",
              personalPhone: "",
              publicId: uuidv4(),
              processCompleted: false,
            }).then((res) => {
              console.log({ res });
              addLinkEmail(user.uid, user.email);
            });

            onUserNotRegistered(user);
          }
        });
      } else {
        onUserNotLoggedIn(user);
      }
    });

    function addLinkEmail(uid, email) {
      if (email !== "") {
        const newURL = linkEmail(email, "", "");
        const newLink = {
          id: uuidv4(),
          title: "Email",
          socialmedia: "email",
          category: "primary",
          url: newURL,
          uid: uid,
        };
        insertNewLink(newLink).then(console.log("email insertado"));
      }
    }
  }, [onUserLoggedIn, onUserNotRegistered, onUserNotLoggedIn]);

  return <div>{children}</div>;
}
