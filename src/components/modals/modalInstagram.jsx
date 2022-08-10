import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";

export const ModalInstagram = ({ user, show, handleOnHide }) => {
  useEffect(() => {
    console.log(user);
  }, []);
  return (
    <>
      <div width="100%">
        <Modal
          size="xl"
          show={show}
          onHide={handleOnHide}
          backdrop="static"
          keyboard={false}
          aria-labelledby="example-modal-sizes-title-lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Guía para encontrar tu Nombre de Usuario</Modal.Title>
          </Modal.Header>
          <Modal.Body width="auto">
            <img
              src={require("../../assets/img/modals/instagram.png")}
              width="100%"
            />
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};