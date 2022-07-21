import { Alert, Fade } from "react-bootstrap";

export default function MessageInputsCustoms({ open, type }) {
  return (
    <Fade in={open} timeout={400}>
      <div>
        <Alert variant={type}>
          El enlace de tu sitio{" "}
          {type === "success"
            ? " se guardo exitosamente"
            : type === "danger"
            ? " no fue guardado"
            : ""}
          .
        </Alert>
      </div>
    </Fade>
  );
}