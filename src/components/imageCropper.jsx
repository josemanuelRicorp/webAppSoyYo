import React, { useEffect, useRef, useState } from 'react';
import {  Col, Modal, Row, Spinner } from 'react-bootstrap';
import { BiFullscreen } from 'react-icons/bi';
import "cropperjs/dist/cropper.css";
import Cropper from "react-cropper";
import style from '../styles/imageCropper.module.css';
import defaultImg from '../assets/img/upload.png';
import { setUserProfilePhoto, updateUser } from '../firebase/firebase';


export default function ImageCropper( {show, handleOnHide, user}){

  const [currentUser, setCurrentUser] = useState(user);
  const [state, setState] = useState(9);
  const [image, setImage] = useState(defaultImg);
  const [cropper, setCropper] = useState();
  const fileRef = useRef(null);

useEffect(() => {
  console.log(currentUser);
  setImage(defaultImg);
  setState(9);
}, [handleOnHide]);

function handleOpenFilePicker() {
  if (fileRef.current) {
    fileRef.current.click();
  }
}

const handleChangeFile = (e) => {
    e.preventDefault();
    const files = e.target.files;
    const fileReader = new FileReader();
    if (fileReader && files && files.length > 0) {
      const reader = new FileReader();
      reader.onload =async function(){
        console.log({file:files[0]});
        setImage(reader.result);
        setState(10);
      }
      reader.readAsDataURL(files[0]);
    }
};

const getCropData = () => {
      if (typeof cropper !== "undefined") {
          setState(11);
          const fileReader = new FileReader();
          cropper.getCroppedCanvas().toBlob((blob)=>{
            fileReader.readAsArrayBuffer(blob);
            fileReader.onload = async function () {
              const imageData = fileReader.result;
              const res = await setUserProfilePhoto(currentUser.uid, imageData);
              if (res) {
                const tmpUser = { ...currentUser };
                tmpUser.profilePicture = res.metadata.fullPath;
                await updateUser(tmpUser).then(handleOnHide());
                setCurrentUser({ ...tmpUser });
                }
            }
          });
}};

return(
    <Modal
        size="lg"
        show={show}
        onHide={handleOnHide}
        backdrop="static"
        keyboard={false}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
          Actualizar foto de perfil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Row>
        <Col>
        <div>
      <div style={{ width: "100%" }}>
      {(state===9)?
      (
      <img style={{  width: "40%", display: 'flex', margin:'auto'}} src={image} onClick={handleOpenFilePicker} />
      ):(
        <Cropper
        style={{ height: 300, width: "100%" }}
        // zoomTo={0.5}
        zoomTo={0.3}
        initialAspectRatio={1}
        src={image}
        viewMode={1}
        minCropBoxHeight={10}
        minCropBoxWidth={10}
        background={false}
        autoCropArea={1}
        guides={false}
        responsive={false}
        dragMode="move"
        scalable={false}
        cropBoxResizable={false}
        checkOrientation={false} 
        onInitialized={(instance) => {
          setCropper(instance);
        }} />
      )
    }     
      </div>
    </div>
        </Col>
        </Row>        
        </Modal.Body>
        <Modal.Footer>
          <small><BiFullscreen/>Desplaza y arrastra la imagen para ajustarla.</small>
        <div style={{ width: "100%" }}>       
        <button className="btn-custom" onClick={handleOpenFilePicker}>
              Seleccionar archivo
            </button>
            <input accept="image/x-png,image/jpeg"
              className={style.fileInput}
              ref={fileRef}
              type="file"
              onChange={handleChangeFile}
            />
      
      {(state===11)? (
        <button style={{ float: "right" }} className="btn-custom disabled" disabled>
        <Spinner
        className="me-1"
        as="span"
        animation="grow"
        size="sm"
        role="status"
        aria-hidden="true"
        />
    Cargando
  </button>
      ):(
        <>
        {(state===9)?(
        <button style={{ float: "right" }} className="btn-custom disabled" disabled >
        Guardar</button>
        ):(
        <button style={{ float: "right" }} className="btn-custom" onClick={getCropData}  >
        Guardar
        </button>
        )}
        </>   
      )
    }
      </div>
        </Modal.Footer>
      </Modal>
);
}