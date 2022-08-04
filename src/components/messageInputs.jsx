import { Alert, Fade } from "react-bootstrap";

export default function MessageInputs({ open, type, socialmedia }) {
  return (
    <Fade in={open} timeout={400}>
      <div>
        <Alert variant={type}>
          El enlace de tu <strong>{socialmedia}</strong>{" "}
          {type === "success"
            ? " se guardo exitosamente"
            : type === "danger"
            ? " fue eliminado correctamente"
            : ""}
          .
        </Alert>
      </div>
    </Fade>
  );
}
