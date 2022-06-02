import style from "../styles/publicLink.module.css";
export default function PublicLink({ url, title }) {
  return (
    <a  href={url} className={style.publicLinkContainer} rel="noreferrer"  target="_blank" >
      <div>
      {title}
      </div>
    </a>
  );
}
