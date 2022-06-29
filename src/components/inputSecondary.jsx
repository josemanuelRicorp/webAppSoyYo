import { useState } from "react";
import style from "../styles/inputSecondary.module.css";
import { FaTiktok, FaTwitterSquare } from "react-icons/fa";
import {
  RiLinkedinFill,
  RiFacebookBoxFill,
  RiInstagramLine,
  RiTwitchFill,
} from "react-icons/ri";

export const InputSecondary = ({ socialmedia }) => {
  const [currentSocialIcon, setcurrentSocialIcon] = useState(2);

  function handleSocialMedia() {
    switch (currentSocialIcon) {
      case "Linkedin":
        return <RiLinkedinFill className={style.secondaryLinkIcon} />;
      case "facebook":
        return <RiFacebookBoxFill className={style.secondaryLinkIcon} />;
      case "instagram":
        return <RiInstagramLine className={style.secondaryLinkIcon} />;
      case "tiktok":
        return <FaTiktok className={style.secosndaryLinkIcon} />;
      case "twitter":
        return <FaTwitterSquare className={style.secondaryLinkIcon} />;
      case "twitch":
        return <RiTwitchFill className={style.secondaryLinkIcon} />;
      default:
        return <RiLinkedinFill className={style.secondaryLinkIcon} />;
    }
  }

  return (
    <>
      <div>
        <div className={style.socialIconRow}>
          <div className={style.socialICon}>
            {handleSocialMedia()}
          </div>
          <div className={style.marginLeft}>
            <div className={style.socialFormControl}>
                <label className={style.socialLabel}>
                    {socialmedia}
                </label>
                <div className={style.socialInputBase}>
                    <div className={style.socialInputBaseStart}>
                    <p className={style.socialInputBaseStartIcon}>@</p>
                    </div>
                    <input className={style.socialInput} type="text"/>
                </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};
