import { useEffect, useRef, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { getLinksBySocialMedia, insertNewLink, updateLink } from "../../firebase/firebase";
import { link2FieldsFacebook } from "../../utils/socialMediaFields";
import { linkFacebook } from "../../utils/socialMediaLinks";
import MessageInputs from "../messageInputs";
import { v4 as uuidv4 } from "uuid";

export const FormFacebook = ({ style, user, closeAccordion }) => {
    const [currentUser, setCurrentUser] = useState(user);
    
    const [facebookUsername, setFacebookUsername] = useState("");
    const [openFacebook, setOpenFacebook] = useState(false);
    const [facebookLinkDocId, setFacebookLinkDocId] = useState("");
    const usernameRef = useRef(null);
    
    
    useEffect(() => {
        initFacebook(user.uid);
      }, []);
    
    async function initFacebook(uid) {
        const resLinks = await getLinksBySocialMedia(uid, "facebook");
        if (resLinks.length > 0) {
          const linkObject = [...resLinks][0];
          setFacebookLinkDocId(linkObject.docId);
          let fieldsData = link2FieldsFacebook(linkObject.url);
          setFacebookUsername(fieldsData.username);
        }
      }
      function addLink() {
        if (facebookUsername !== "") {
          const newURL = linkFacebook(facebookUsername);
          const newLink = {
            id: uuidv4(),
            title: "Facebook",
            socialmedia: "facebook",
            url: newURL,
            uid: currentUser.uid,
          };
          const res = insertNewLink(newLink);
          newLink.docId = res.id;
          handleMessageConfirmation();
          closeAccordion();
          return newLink.docId;
        }
      }
    
      function editLink(currentLinkDocId) {
        if (facebookUsername) {
            const newURL = linkFacebook(facebookUsername);
            const link = {
            title: "Facebook",
            socialmedia: "facebook",
            url: newURL,
            uid: currentUser.uid,
          };
          const res = updateLink(currentLinkDocId, link);
          link.docId = res.id;
          handleMessageConfirmation();
            closeAccordion();
        }
      }
      function handleOnSubmitFacebook(e) {
        e.preventDefault();
        e.stopPropagation();
        if (facebookLinkDocId !== "") {
            editLink(facebookLinkDocId);
        } else {
            addLink();
        }
      }
      function onChangeFacebookUsername(){
        setFacebookUsername(usernameRef.current.value);
      }
      function handleMessageConfirmation() {
        setOpenFacebook( true);
        setTimeout(() => {
            setOpenFacebook( false);
        }, 3000);
      }
return(
    <>
    <Form
                autoComplete={"off"}
                className={style}
                onSubmit={handleOnSubmitFacebook}
              >
                {openFacebook?(
                  <MessageInputs
                  open={openFacebook}
                  type="success"
                  socialmedia="Facebook"
                  ></MessageInputs>
                ):("")}
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column lg="4">
                    facebook.com/
                  </Form.Label>
                  <Col lg="8">
                    <Form.Control
                      className="input"
                      type="text"
                      name="username"
                      placeholder="Nombre de usuario"
                      value={facebookUsername}
                      ref={usernameRef}
                      onChange={onChangeFacebookUsername}
                      autoComplete="off"
                    />
                  </Col>
                </Form.Group>
                <input
                  className="btn-custom"
                  type="submit"
                  value="Guardar datos"
                />
              </Form>
    </>
)
}