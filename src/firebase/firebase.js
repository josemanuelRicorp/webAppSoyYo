import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL, getBytes,uploadBytesResumable } from 'firebase/storage';
import { getFirestore, collection, addDoc, getDocs, doc, getDoc, query, where, setDoc, deleteDoc, collectionGroup, updateDoc } from 'firebase/firestore';
import VCard from "vcard-creator";
const firebaseConfig = {
    apiKey: process.env.REACT_APP_apiKey,
    authDomain: process.env.REACT_APP_authDomain,
    projectId: process.env.REACT_APP_projectId,
    storageBucket: process.env.REACT_APP_storageBucket,
    messagingSenderId: process.env.REACT_APP_messagingSenderId,
    appId: process.env.REACT_APP_appId
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);


export async function userExists(uid) {
    try {
        const docRef = doc(db, "users", uid);
        const res = await getDoc(docRef);
        return res.exists();
    } catch (error) {
        console.error(error);
    }
}

export async function existUsername(username) {
    try {
        const users = [];
        const docsRef = collection(db, 'users');
        const q = query(docsRef, where("username", "==", username));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            users.push(doc.data());
        });
        return users.length > 0 ? users[0].uid : null;
    } catch (error) {
        console.error(error);
    }
}

//return uid
export async function existUserByPublicId(publicId) {
    try {
        const users = [];
        const docsRef = collection(db, 'users');
        const q = query(docsRef, where("publicId", "==", publicId));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            users.push(doc.data());
        });
        return users.length > 0 ? users[0].uid : null;
    } catch (error) {
        console.error(error);
    }
}

export async function registerNewUser(user) {
    try {
        const collectionRef = collection(db, 'users');
        const docRef = doc(collectionRef, user.uid);
        await setDoc(docRef, user);
    } catch (error) {
        console.error(error);
    }
}
export async function logout() {
    try {
        await auth.signOut();
    } catch (error) {
        console.error(error);
    }
}


export async function updateUser(user) {
    try {
        const collectionRef = collection(db, 'users');
        const docRef = doc(collectionRef, user.uid);
        await updateDoc(docRef, user).then((res) => { console.log("User editado") });
    } catch (error) {
        console.error(error);
    }
}
export async function getUserInfo(uid) {
    try {
        const docRef = doc(db, 'users', uid);
        const document = await getDoc(docRef);
        return document.data();
    } catch (error) {
        console.error(error);
    }
}


export async function insertNewLink(link) {
    try {
        const docRef = collection(db, "links");
        const res = await addDoc(docRef, link);
        return res;
    } catch (error) {
        console.error(error);
    }
}

export async function insertNewLinkCustoms(link) {
    try {
      const docRef = collection(db, "links_customs");
      const res = await addDoc(docRef, link);
      return res;
    } catch (error) {
      console.error(error);
    }
  }
  

 

export async function getLinks(uid) {
    const links = [];
    try {
        const collectionRef = collection(db, "links");
        const q = query(collectionRef, where("uid", "==", uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            const link = { ...doc.data() };
            link.docId = doc.id;
            links.push(link);
        });
        return links;
    } catch (error) {
        console.error(error);
    }
}

export async function getLinksCustoms(uid) {
    const links = [];
    try {
      const collectionRef = collection(db, "links_customs");
      const q = query(collectionRef, where("uid", "==", uid));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const link = { ...doc.data() };
        link.docId = doc.id;
        links.push(link);
      });
      return links;
    } catch (error) {
      console.error(error);
    }
  }





export async function getLinksBySocialMedia(uid, socialmedia) {
    const links = [];
    try {
        const collectionRef = collection(db, "links");
        const q = query(collectionRef, where("uid", "==", uid), where("socialmedia", "==", socialmedia));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            const link = { ...doc.data() };
            link.docId = doc.id;
            links.push(link);
        });
        return links;
    } catch (error) {
        console.error(error);
    }
}

export async function getLinksSocialMedia(uid) {
    const links = [];
    let whatsapp = {}, facebook = {};

    try {
        const collectionRef = collection(db, "links");
        const q = query(collectionRef, where("uid", "==", uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            const link = { ...doc.data() };
            link.docId = doc.id;
            links.push(link);
        });
        whatsapp = links.find((item) => item.socialmedia === "whatsapp");
        facebook = links.find((item) => item.socialmedia === "facebook");

        return { whatsapp, facebook };
    } catch (error) {
        console.error(error);
    }
}



export async function updateLink(docId, link) {
    try {
        const docRef = doc(db, 'links', docId);
        const res = await setDoc(docRef, link).then(() => { console.log("actualizado :D") });
        return res;
    } catch (error) {
        console.error(error);
        return error;
    }
}
export async function updateCustomLink(docId, link) {
    try {
      const docRef = doc(db, "links_customs", docId);
      const res = await setDoc(docRef, link).then(() => {
        console.log("actualizado :D");
      });
      return res;
    } catch (error) {
      console.error(error);
      return error;
    }
  }
export async function deleteLinks(uid, media) {
    console.log('Delete links', "ANTES DEL TRY")
    try {
        const d = query(collection(db, 'links'), where('uid', '==', uid), where('socialmedia', '==', media));
        const docSnap = await getDocs(d);
        docSnap.forEach((doc) => {
            console.log(doc.data())
            deleteDoc(doc.ref);
        });
        // const q = query(docRef, where("uid", "=", { uid }))
        // const res = await deleteDoc(docRef);
        // return res;
    } catch (error) {
        console.error(error);
    }
}


export async function deleteLink(docId) {
    try {
        const docRef = doc(db, 'links', docId);
        const res = await deleteDoc(docRef);
        return res;
    } catch (error) {
        console.error(error);
    }
}

export async function deleteCustomLink(docId) {
    try {
      const docRef = doc(db, "links_customs", docId);
      const res = await deleteDoc(docRef);
      return res;
    } catch (error) {
      console.error(error);
    }
  }









export async function setDefaultProfilePhoto() {
    try {
        const imageRef = ref(storage, `gs://treelinkcv.appspot.com/images/user.png`);
        return imageRef;
    } catch (error) {
        console.error(error);
    }
}

export async function setUserProfilePhoto(uid, file) {
    try {
        const imageRef = ref(storage, `images/${uid}`);
        const resUpload = await uploadBytes(imageRef, file);
        return resUpload;
    } catch (error) {
        console.error(error);
    }
}
export async function getProfilePhotoUrl(profilePicture) {
    try {
        const imageRef = ref(storage, profilePicture);
        const url = await getDownloadURL(imageRef);
        return url;
    } catch (error) {
        console.error(error);
    }
}
export async function getUserPublicProfileInfo(uid) {
    try {
        const profileInfo = await getUserInfo(uid);
        const linksInfo = await getLinks(uid);
        return {
            profileInfo: profileInfo,
            linksInfo: linksInfo
        }
    } catch (error) {
        console.error(error);
    }
}


export async function insertUserContact(link) {
    try {
      const docRef = collection(db, "users_contact");
      const res = await addDoc(docRef, link);
      return res;
    } catch (error) {
      console.error(error);
    }
  }

  export async function updateUserContact(user) {
    try {
        var myVCard = new VCard();
        const url = await getProfilePhotoUrl(user.profilePicture);
        let image64 = await getBase64Image(url);
        let website = "https://soyyo.digital/u/#/" + user.publicId;
        if (
            user.displayName !== "" ||
            user.displayName !== null ||
            user.displayName !== undefined
        ) {
            myVCard.addName(user.displayName);
        }
        if (
            user.email !== "" ||
            user.email !== null ||
            user.email !== undefined
        ) {
            myVCard.addEmail(user.email, "PREF;WORK");
        }
        if (
            user.personalPhone !== "" ||
            user.personalPhone !== null ||
            user.personalPhone !== undefined
        ) {
            myVCard.addPhoneNumber(user.personalPhone, "WORK");
        }
        if (
            user.career !== "" ||
            user.career !== null ||
            user.career !== undefined
        ) {
            myVCard.addJobtitle(user.career);
        }
        if (website !== "" || website !== null || website !== undefined) {
            myVCard.addURL(website);
        }
        if (image64 !== "" || image64 !== null || image64 !== undefined) {
            myVCard.addPhoto(image64);
        }
        const file = new Blob([myVCard.toString()], { type: "text/x-vcard" });
        file.name =
            user.displayName.replaceAll(" ", "") +
            "-" +
            user.publicId +
            ".vcf";

        if (!file) return;
        const storageRef = ref(storage, `/contact/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
        "state_changed",
        (snapshot) => {
            const prog = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
        },
        (err) => console.log(err),
        function () {
            getDownloadURL(uploadTask.snapshot.ref).then((iconUrl) => {
            });
        }
        );

    } catch (error) {
      console.error(error);
    }
  }



  export async function createUserContact(displayName, email, profilePicture, publicId) {
    try {
        var myVCard = new VCard();
        const url = await getProfilePhotoUrl(profilePicture);
        let image64 = await getBase64Image(url);
        let website = "https://soyyo.digital/u/#/" + publicId;
        if (
            displayName !== "" ||
            displayName !== null ||
            displayName !== undefined
        ) {
            myVCard.addName(displayName);
        }
        if (
            email !== "" ||
            email !== null ||
            email !== undefined
        ) {
            myVCard.addEmail(email, "PREF;WORK");
        }
        if (website !== "" || website !== null || website !== undefined) {
            myVCard.addURL(website);
        }
        if (image64 !== "" || image64 !== null || image64 !== undefined) {
            myVCard.addPhoto(image64);
        }
        const file = new Blob([myVCard.toString()], { type: "text/x-vcard" });
        file.name =
            displayName.replaceAll(" ", "") +
            "-" +
            publicId +
            ".vcf";
        if (!file) return;
        const storageRef = ref(storage, `/contact/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
        "state_changed",
        (snapshot) => {
            const prog = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
        },
        (err) => console.log(err),
        function () {
            getDownloadURL(uploadTask.snapshot.ref).then((iconUrl) => {
            });
        }
        );
    } catch (error) {
      console.error(error);
    }
  }


  async function getBase64Image(urlImage) {
    var img = new Image();
    img.crossOrigin = "anonymous";
    img.src = urlImage;
    return new Promise((resolve) => {
      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL("image/png");
        resolve(dataURL.replace(/^data:image\/(png|jpg);base64,/, ""));
      };
    });
  }