import { useRef, useState } from "react";
import style from "../styles/inputSocialMedia.module.css";
import { FaTiktok, FaTwitterSquare } from "react-icons/fa";
import {
  RiLinkedinFill,
  RiFacebookBoxFill,
  RiInstagramLine,
  RiTwitchFill,
} from "react-icons/ri";

export const InputSocialMedia = ({ socialmedia,username, usernameRef, handleOnChange }) => {
  const [currentSocialIcon, setcurrentSocialIcon] = useState(socialmedia);
 
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
      <div className={style.inputContain}>
        <input
          type="text"
          id="fname"
          name="username"
          autoComplete="off"
          // placeholder="Nombre de usuario"
          value={username}
          onChange={handleOnChange}
          ref={usernameRef}
          aria-labelledby="placeholder-fname"
        />
        <label
          className={style.placeholderText}
          htmlFor="fname"
          id="placeholder-fname"
        >
          <div className={style.text}>
            
           @usuario{socialmedia}
          </div>
        </label>
      </div>
      {/* <div className={style.maginTop}>
        <div>
          <div>
            <div className={style.container}>
              <div>
                <div className={style.socialRow}>
                  <div className={style.socialIcon}>{handleSocialMedia()}</div>
                  <div className={style.marginLeft}>
                        <div className={style.socialTextField}>
                            <label className={style.socialLabel}>{socialmedia}</label>
                            <div className={style.socialInputContainer}>
                                <div className={style.socialInputStart}>
                                    <p className={style.socialInputStartIcon}>@</p>
                                </div>
                                <input className={style.socialInput}  type="text"/>
                                <fieldset className={style.socialFieldset}>
                                    <legend className={style.socialLegend}>
                                        <span className={style.socialLegendSpan} >{socialmedia}</span>
                                    </legend>
                                </fieldset>

                            </div>
                        </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
};
