import { useEffect, useRef, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import {
  getLinksBySocialMedia,
  insertNewLink,
  updateLink,
} from "../../firebase/firebase";
import { link2FieldsPhone } from "../../utils/socialMediaFields";
import { v4 as uuidv4 } from "uuid";
import MessageInputs from "../messageInputs";
import { linkPhoneNumberCall } from "../../utils/socialMediaLinks";

export const FormPhone = ({ style, user , handleAccordion }) => {
  const [currentUser, setCurrentUser] = useState(user);

  const [openPhone, setOpenPhone] = useState(false);
  const [phoneLinkDocId, setPhoneLinkDocId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const phoneNumberRef = useRef(null);

  useEffect(() => {
    initPhoneInfo(user.uid);
  }, []);

  async function initPhoneInfo(uid) {
    const resLinksPhone = await getLinksBySocialMedia(uid, "phone");
    if (resLinksPhone.length > 0) {
      const linkObject = [...resLinksPhone][0];
      
      setPhoneLinkDocId(linkObject.docId);
      let fieldsData = link2FieldsPhone(linkObject.url);
      setPhoneNumber(fieldsData.number);
    }
  }

  function addLink() {
    if (phoneNumber !== "") {
      const newURL=linkPhoneNumberCall(phoneNumber);
      const newLink = {
        id: uuidv4(),
        title: "Telefóno",
        socialmedia: "phone",
        url: newURL,
        uid: currentUser.uid,
      };
      const res = insertNewLink(newLink);
      newLink.docId = res.id;
      return newLink.docId;
    }
  }

  function editLink(currentLinkDocId) {
    if (phoneNumber) {
      const newURL=linkPhoneNumberCall(phoneNumber);
      const link = {
        title: "Telefóno",
        socialmedia: "phone",
        url: newURL,
        uid: currentUser.uid,
      };
      const res = updateLink(currentLinkDocId, link);
      link.docId = res.id;
    }
  }

  function handleOnSubmitPhone(e) {
    e.preventDefault();
    e.stopPropagation();
    if (phoneLinkDocId !== "") {
      editLink(phoneLinkDocId);
    } else {
      addLink();
    }
    handleMessageConfirmation();
    handleAccordion();
  }
  function handleOnChangePhoneNumber() {
    setPhoneNumber(phoneNumberRef.current.value);
  }
  function handleMessageConfirmation() {
    setOpenPhone(true);
    setTimeout(() => {
      setOpenPhone(false);
    }, 2000);
  }

  return (
    <>
      <Form className={style} onSubmit={handleOnSubmitPhone}>
        {openPhone ? (
          <MessageInputs
            open={openPhone}
            type={"success"}
            socialmedia={"teléfono de contacto"}
          ></MessageInputs>
        ) : (
          ""
        )}
        <h2>Telefóno</h2>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column lg="4">
            Número telefónico:
          </Form.Label>
          <Col lg="8">
            <Form.Control
              className="input"
              type="text"
              name="number"
              autoComplete="off"
              placeholder="70000000"
              value={phoneNumber}
              ref={phoneNumberRef}
              onChange={handleOnChangePhoneNumber}
            />
          </Col>
        </Form.Group>
        <input className="btn-custom" type="submit" value="Guardar datos" />
      </Form>
    </>
  );
};
