import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  auth,
  getUserInfo,
  registerNewUser,
  userExists,
} from "../firebase/firebase";
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
        console.log({"userAuthProvider":user});
        const isRegistered = await userExists(user.uid);
        console.log({"isRegisteredAuthProvider":isRegistered});

        if (isRegistered) {
          const userInfo = await getUserInfo(user.uid);
          if (userInfo.processCompleted) {
            onUserLoggedIn(userInfo);
          } else {
            onUserNotRegistered(userInfo);
          }
        } else {
          await registerNewUser({
            uid: user.uid,
            displayName: user.displayName,
            profilePicture: "gs://treelinkcv.appspot.com/default/user.png",
            username: "",
            career: "",
            description: "",
            publicId: uuidv4(),
            processCompleted: false,
          });
          onUserNotRegistered(user);
        }
      } else {
        onUserNotLoggedIn(user);
      }
    });
  }, [onUserLoggedIn, onUserNotRegistered, onUserNotLoggedIn]);

  return <div>{children}</div>;
}
