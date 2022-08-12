import { useState } from "react";
import { Modal } from "react-bootstrap";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaMapMarked } from "react-icons/fa";
import { FaKeyboard } from "react-icons/fa";
import { BsFillMouseFill } from "react-icons/bs";
export const ModalMapDescription = ({ show, handleOnHide,  titleDescription, imageUrl }) => {
  const [descriptions, setDescriptions] = useState([
    { name: 'Marcador  de Ubicación',icon: FaMapMarkerAlt,  description: 'Para cambiar la posición del marcador puedes arrastrarlo por el mapa hasta encontrar la posición deseada o dar clic en el mapa en la posición deseada'},
    { name: 'Mapa', icon: FaMapMarked, description: 'Arrastre la pantalla del mapa para cambiar de lugar'},
    { name: 'Teclas',icon: FaKeyboard, description: 'Use las teclas arriba, abajo, izquierda y derecha para mover el marcador de posición'},
    { name: 'Rueda del raton',icon: BsFillMouseFill, description: 'Use la rueda del raton para acercar o alejar el mapa'}
    ]);
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
          <Modal.Header closeButton >
            <Modal.Title>{ titleDescription }</Modal.Title>
          </Modal.Header>
          <Modal.Body width="auto" height="100" className="my-5">
            {/* <img
              src={require(`${imageUrl}`)}
              width="100%"
            /> */}
            {
              descriptions.map( (description,index) => 
                <div key={index} className="card my-2 py-2">
                <h5 className="card-title mx-4"> <description.icon> </description.icon> { "" } </h5>
                <div className="card-body">
                    <p className="card-text"> { description.description }</p>
                </div>
              </div>
              )
            }
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};