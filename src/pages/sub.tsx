import Footer from "@/compoents/Footer";
import Header from "@/compoents/Header";
import React from "react";

const sub = () => {
  return (
    <div className="sub">
      <Header />
      <div className="content">
        <div className="content-box">
          <div className="left">
            <div className="text">
              <h2>상담신청</h2>
              <p>
                상담받기전, 간단한 정보를 입력해주세요! <br />
                디테일한 정보입력은 상담에 더욱 도움이 됩니다 :)
              </p>
            </div>
            <img src="/images/visual-item-02.png" />
          </div>
          <div className="form">
            <div className="form-list">
              <div className="form-item">
                <span>이름</span>
                <input type="text" />
              </div>
              <div className="form-item">
                <span>연락처</span>
                <input type="text" />
              </div>
              <div className="form-item">
                <span>이메일</span>
                <input type="text" />
              </div>
              <div className="form-item">
                <span>작업 기간</span>
                <input type="text" />
              </div>
              <div className="form-item">
                <span>작업 내용</span>
                <input type="text" />
              </div>
            </div>
            <p className="information">
              *<span>개인정보 처리 방침</span>에 동의시에만 상담 신청이
              가능합니다.
            </p>
            <button type="button">상담신청</button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default sub;
