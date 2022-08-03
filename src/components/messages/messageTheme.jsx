import { Alert, Fade } from "react-bootstrap";

export default function MessageTheme({ open, type }) {
  return (
    <Fade in={open} timeout={400}>
      <div>
        <Alert variant={type}>
          El tema de tu perfil{" "}
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