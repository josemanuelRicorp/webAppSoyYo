import { Alert, Fade } from "react-bootstrap";

export default function MessageDelete({ open, type, socialmedia }) {
  return (
    <Fade in={open} timeout={400}>
      <div>
        <Alert variant={type}>
          El enlace de tu <strong>{socialmedia}</strong>{" "}
          {type === "success"
            ? " se elimino exitosamente"
            : type === "danger"
            ? " no fue eliminado"
            : ""}
          .
        </Alert>
      </div>
    </Fade>
  );
}
