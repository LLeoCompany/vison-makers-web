import React from "react";

const Footer = () => {
  return (
    <div className="footer-outer">
      <div className="footer">
        <div className="footer-top">
          <b className="footer-logo">
            <a href="/">VisonMakers</a>
          </b>
          <div className="footer-right">
            <div className="map">
              <img src="/images/icon-map.png" /> 경기 성남시 분당구 판교역로 166
            </div>
            <div className="number">
              <div>
                <img src="/images/icon-phone.png" />
                1899-1326
              </div>
              <div>
                <img src="/images/icon-printshop.png" />
                (02) 456-7890
              </div>
            </div>
            <div className="sns">
              <span>Social Media</span>
              <div>
                <img src="/images/icon-facebook.png" />
                <img src="/images/icon-tw.png" />
                <img src="/images/icon-in.png" />
                <img src="/images/icon-youtube.png" />
                <img src="/images/icon-in.png" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div>
          <span>About us</span>
          <span>Contact us</span>
          <span>Help</span>
          <span>Privacy Policy</span>
        </div>
        <span>Copyright © 2018 • VisionMakers</span>
      </div>
    </div>
  );
};

export default Footer;
