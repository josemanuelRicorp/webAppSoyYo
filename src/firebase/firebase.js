import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL, getBytes } from 'firebase/storage';
import { getFirestore, collection, addDoc, getDocs, doc, getDoc, query, where, setDoc, deleteDoc, collectionGroup } from 'firebase/firestore';

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
        await setDoc(docRef, user).then((res) => { console.log("User editado")});
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
        const docRef = doc(db, 'links', docId);
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








