import React, { useState } from "react";
import { useRouter } from "next/router";
import Header from "@/compoents/Header";
import Footer from "@/compoents/Footer";

const Sub = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    duration: "",
    details: "",
  });
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    setLoading(true); // 로딩 시작
    console.log("Submitting form with data:", formData);

    const response = await fetch("/api/sendInquireSlackMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();
    setLoading(false); // 로딩 종료

    if (response.ok) {
      alert("문의가 정상적으로 접수되었습니다");
      router.push("/"); // 루트 페이지로 이동
    } else {
      console.error("Error sending message to Slack:", result.error);
      alert(`Error: ${result.error}`);
    }
  };

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
            <div className={`form-list ${loading ? "loading" : ""}`}>
              <div className="form-item">
                <span>이름</span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              <div className="form-item">
                <span>연락처</span>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              <div className="form-item">
                <span>이메일</span>
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              <div className="form-item">
                <span>작업 기간</span>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              <div className="form-item">
                <span>작업 내용</span>
                <input
                  type="text"
                  name="details"
                  value={formData.details}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>
            {loading && <div className="loading-bar">Loading...</div>}
            <p className="information">
              *<span>개인정보 처리 방침</span>에 동의시에만 상담 신청이
              가능합니다.
            </p>
            <button type="button" onClick={handleSubmit} disabled={loading}>
              상담신청
            </button>
          </div>
        </div>
      </div>
      <Footer />
      <style jsx>{`
        .form-list.loading {
          opacity: 0.5;
          pointer-events: none;
        }
        .loading-bar {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 24px;
          color: #333;
        }
      `}</style>
    </div>
  );
};

export default Sub;
