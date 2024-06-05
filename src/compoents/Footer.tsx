import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <div className="footer-outer">
      <div className="footer">
        <div className="footer-top">
          <b className="footer-logo">
            <Link href="/">레오소프트(LeoSoft)</Link>
          </b>
          <div className="footer-right">
            <div className="map">
              <img src="/images/icon-map.png" /> 인천광역시 연수구 인천타워대로
              323, B동 30층 브이457호(송도동, 송도 센트로드)
            </div>
            <div className="number">
              <div>
                <img src="/images/icon-phone.png" />
                010-8739-5727
              </div>
              <div>
                {/* <img src="/images/icon-printshop.png" /> */}
                사업자 정보 : 응용 소프트워에 개발 및 공급업
              </div>
            </div>

            <div className="number">
              <div>대표자 : 이성욱</div>
              <div>
                {/* <img src="/images/icon-printshop.png" /> */}
                E-Mail : lucas@leocompany.net
              </div>
            </div>

            <div className="sns">
              <span>Social Media</span>
              <div>
                {/* <img src="/images/icon-facebook.png" /> */}
                {/* <img src="/images/icon-tw.png" /> */}
                {/* <img src="/images/icon-in.png" /> */}
                {/* <img src="/images/icon-youtube.png" /> */}
                {/* <img src="/images/icon-in.png" /> */}
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
