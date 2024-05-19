import React from "react";

const Header = () => {
  return (
    <div className="head">
      <h2 className="logo">
        <a href="/">VisonMakers</a>
      </h2>
      <ul className="menu">
        <li>
          <a href="#content02">서비스소개</a>
        </li>
        <li>
          <a href="#content03">가격</a>
        </li>
        <li>
          <a href="#content04">상품</a>
        </li>
        <li>
          <a href="#content05">기업후기</a>
        </li>
        <li className="button-box">
          <button type="button">
            <a href="/sub">비용상담</a>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Header;
