import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <div className="head">
      <h2 className="logo">
        <Link href="/">VisonMakers</Link>
      </h2>
      <ul className="menu">
        <li>
          <Link href="#content02">서비스소개</Link>
        </li>
        <li>
          <Link href="#content03">가격</Link>
        </li>
        <li>
          <Link href="#content04">상품</Link>
        </li>
        <li>
          <Link href="#content05">기업후기</Link>
        </li>
        <li className="button-box">
          <button type="button">
            <Link href="/sub">비용상담</Link>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Header;
