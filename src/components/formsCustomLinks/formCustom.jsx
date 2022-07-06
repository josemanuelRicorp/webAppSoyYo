import { useEffect, useRef, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { linkWhatsApp } from "../../utils/socialMediaLinks";
import MessageInputs from "../messageInputs";
import { v4 as uuidv4 } from "uuid";
import {
  getLinksBySocialMedia,
  insertNewLink,
  updateLink,
} from "../../firebase/firebase";
import { link2FieldsWhatsapp } from "../../utils/socialMediaFields";

export const FormCustom = ({ style, user }) => {

  const [currentUser, setCurrentUser] = useState(user);

  const [openCustom, setOpenCustom] = useState(false);
  const [customLinkDocId, setCustomLinkDocId] = useState("");
  const [customUrl, setCustomUrl] = useState("");
  const customUrlRef = useRef(null);




  useEffect(() => {
    initWhatsAppInfo(user.uid);
  }, []);

  async function initWhatsAppInfo(uid) {
    const resLinksWhatsapp = await getLinksBySocialMedia(uid, "whatsapp");
    if (resLinksWhatsapp.length > 0) {
      const linkObject = [...resLinksWhatsapp][0];
      
      let fieldsData = link2FieldsWhatsapp(linkObject.url);      
    }
  }

  function addLink() {
    if (customUrl!== "") {
      const newLink = {
        id: uuidv4(),
        title: "WhatsApp",
        category: "primary",
        socialmedia: "whatsapp",
        url: customUrl,
        uid: currentUser.uid,
      };
      const res = insertNewLink(newLink);
      newLink.docId = res.id;
      return newLink.docId;
    }
  }


  const handleOnSubmitCustom = (e) => {
    e.preventDefault();
    e.stopPropagation();
   
      addLink();
    handleMessageConfirmation();
  };
  
  function handleOnChangeCustomUrl() {
    setCustomUrl(customUrlRef.current.value);
  }

  function handleMessageConfirmation() {
    setOpenCustom( true);
    setTimeout(() => {
      setOpenCustom( false);
    }, 3000);
  }
 

  return (
    <>
      <Form className={style} onSubmit={handleOnSubmitCustom}>
        {openCustom ? (
          <MessageInputs
            open={openCustom}
            type={"success"}
            socialmedia={" "}
          ></MessageInputs>
        ) : (
          ""
        )}
        <h2>Datos para los enlaces personales</h2>
       
        <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
          <Form.Label column lg="4">
            URL :
          </Form.Label>
          <Col lg="8">
            <Form.Control
              className="input"
              type="text"
              name="msg"
              autoComplete="off"
              placeholder="Inserte el enlace"
              value={customUrl}
              ref={customUrlRef}
              onChange={handleOnChangeCustomUrl}
            />
          </Col>
        </Form.Group>
        <input className="btn-custom" type="submit" value="Guardar datos" />
      </Form>
    </>
  );
};
