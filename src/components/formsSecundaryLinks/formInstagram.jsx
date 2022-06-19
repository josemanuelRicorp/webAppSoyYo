import { useEffect, useRef, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { getLinksBySocialMedia, insertNewLink, updateLink } from "../../firebase/firebase";
import { link2FieldsInstagram } from "../../utils/socialMediaFields";
import { linkInstagram } from "../../utils/socialMediaLinks";
import MessageInputs from "../messageInputs";
import { v4 as uuidv4 } from "uuid";

export const FormInstagram= ({ style, user, closeAccordion }) => {
    const [currentUser, setCurrentUser] = useState(user);
    const [instagramUsername, setInstagramUsername] = useState("");
    const [openInstagram, setOpenInstagram] = useState(false);
    const [instagramLinkDocId, setInstagramLinkDocId] = useState("");
    const usernameRef = useRef(null);

 
    useEffect(() => {
        initInstagram(user.uid);
      }, []);

    async function initInstagram(uid) {
        const resLinks = await getLinksBySocialMedia(uid, "instagram");
        if (resLinks.length > 0) {
          const linkObject = [...resLinks][0];
        
          setInstagramLinkDocId(linkObject.docId);
          let fieldsData = link2FieldsInstagram(linkObject.url);
          setInstagramUsername(fieldsData.username);
        }
      }
      function addLink() {
        if (instagramUsername!== "") {
            const newURL =linkInstagram(instagramUsername);
          const newLink = {
            id: uuidv4(),
            title: "Instagram",
            url: newURL,
            socialmedia: "instagram",
            uid: currentUser.uid,
          };
          const res = insertNewLink(newLink);
          newLink.docId = res.id;
          handleMessageConfirmation();
            closeAccordion();
        }
      }
    
      function editLink(currentLinkDocId) {
        if (instagramUsername) {
            const newURL =linkInstagram(instagramUsername);
          const link = {
            title: "Instagram",
            url: newURL,
            socialmedia: "instagram",
            uid: currentUser.uid,
          };
          const res = updateLink(currentLinkDocId, link);
          link.docId = res.id;
          handleMessageConfirmation();
          closeAccordion();
        }
      }

      function handleOnSubmitInstagram(e) {
        e.preventDefault();
        e.stopPropagation();
               if (instagramLinkDocId !== "") {
            editLink(instagramLinkDocId);
          } else {
            addLink();
          }
      }
      function onChangeInstagramUsername(){
        setInstagramUsername(usernameRef.current.value);
      }
      function handleMessageConfirmation() {
        setOpenInstagram( true);
        setTimeout(() => {
            setOpenInstagram( false);
        }, 3000);
      }

return(
    <>
     <Form
                className={style}
                autoComplete={"off"}
                onSubmit={handleOnSubmitInstagram}
              >
                  {openInstagram ? (
                <MessageInputs
                  open={openInstagram}
                  type={"success"}
                  socialmedia={"Instagram"}
                ></MessageInputs>
              ) : (
                ""
              )}
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column lg="4">
                    instagram.com/
                  </Form.Label>
                  <Col lg="8">
                    <Form.Control
                      className="input"
                      type="text"
                      name="username"
                      value={instagramUsername}
                      ref={usernameRef}
                      onChange={onChangeInstagramUsername}
                      autoComplete="off"
                      placeholder="Nombre de usuario"
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