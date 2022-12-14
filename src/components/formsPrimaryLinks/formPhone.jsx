import { useEffect, useRef, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import {
  deleteLink,
  getLinksBySocialMedia,
  insertNewLink,
  updateLink,
  updateUser,
  updateUserContact,
} from "../../firebase/firebase";
import { link2FieldsPhone } from "../../utils/socialMediaFields";
import { v4 as uuidv4 } from "uuid";
import MessageInputs from "../messageInputs";
import { linkPhoneNumberCall } from "../../utils/socialMediaLinks";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
export const FormPhone = ({ style, user, handleAccordion }) => {
  const [currentUser, setCurrentUser] = useState(user);

  const [openPhone, setOpenPhone] = useState(false);
  const [phoneLinkDocId, setPhoneLinkDocId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const phoneNumberRef = useRef(null);
  const [removeLink, setRemoveLink] = useState(false);
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
      const newURL = linkPhoneNumberCall(phoneNumber);
      const newLink = {
        id: uuidv4(),
        title: "Llamar",
        category: "primary",
        socialmedia: "phone",
        url: newURL,
        uid: currentUser.uid,
      };
      const res = insertNewLink(newLink);
      newLink.docId = res.id;
      initPhoneInfo(currentUser.uid);
      return newLink.docId;
    }
  }

  function editLink(currentLinkDocId) {
    if (phoneNumber) {
      const newURL = linkPhoneNumberCall(phoneNumber);
      const link = {
        title: "Llamar",
        category: "primary",
        socialmedia: "phone",
        url: newURL,
        uid: currentUser.uid,
      };
      const res = updateLink(currentLinkDocId, link);
      link.docId = res.id;
    } else {
      deleteLink(phoneLinkDocId);
      // TODO actualizar el telefono de usuario por ""
    }
  }

  async  function handleOnSubmitPhone(e) {
    e.preventDefault();
    e.stopPropagation();
    if (
      phoneNumber.replace(" ", "") === "" ||
      /\s/.test(phoneNumber)
    ) {
      currentUser.personalPhone = "";
      setPhoneNumber("");
      removeLinkPhone(phoneLinkDocId);
      handleMessageRemoveLink();
    } else if (phoneLinkDocId !== "") {
      currentUser.personalPhone = phoneNumber;
      editLink(phoneLinkDocId);
      handleMessageConfirmation();
    } else {
      currentUser.personalPhone = phoneNumber;
      addLink();
      handleMessageConfirmation();
    }
    await updateUser(currentUser);
    await updateUserContact(currentUser);
    handleAccordion();
  }
  function removeLinkPhone(currentLinkDocId) {
    if (
      phoneNumber.replace(" ", "") === "" ||
      /\s/.test(phoneNumber)
    ) {
      deleteLink(currentLinkDocId);
      return;
    }
  }
  function handleOnChangePhoneNumber() {
    setPhoneNumber(phoneNumberRef.current.value);
  }
  function handleMessageConfirmation() {
    setOpenPhone(true);
    setRemoveLink(false);
    setTimeout(() => {
      setOpenPhone(false);
    }, 2000);
  }
  function handleMessageRemoveLink() {
    setOpenPhone(true);
    setRemoveLink(true);
    setTimeout(() => {
      setOpenPhone(false);
    }, 3000);
  }
  return (
    <>
      <Form className={style} onSubmit={handleOnSubmitPhone}>
        {openPhone ? (
          <MessageInputs
            open={openPhone}
            type={removeLink ? "danger" : "success"}
            socialmedia={"tel??fono de contacto"}
          ></MessageInputs>
        ) : (
          ""
        )}
        <h2>Datos para el enlace de tu telef??no de contacto</h2>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column lg="4">
            N??mero telef??nico:
          </Form.Label>
          {/* <Col lg="8">
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
          </Col> */}
          <Col lg="1">
            <PhoneInput
              placeholder="ingrese un n??mero telefonico"
              value={phoneNumber}
              
              onChange={setPhoneNumber}
            />
          </Col>
        </Form.Group>
        <input className="btn-custom" type="submit" value="Guardar datos" />
      </Form>
    </>
  );
};
