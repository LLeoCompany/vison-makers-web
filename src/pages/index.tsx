import React, { useState } from "react";
import {
  FullpageContainer,
  FullpageSection,
} from "@shinyongjun/react-fullpage";
import "@shinyongjun/react-fullpage/css";
import Link from "next/link";
import Image from "next/image";
import Header from "@/compoents/Header";
import Footer from "@/compoents/Footer";
import { Fade, Slide } from "react-awesome-reveal";

// 3
const Index = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  return (
    <div className="main">
      <Header />
      <FullpageContainer
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
      >
        <FullpageSection name="content01">
          <div className="content content01">
            <div className="title-page">
              <div className="title-box">
                <Fade direction="up">
                  <h2>
                    기획부터 디자인, 개발까지{" "}
                    <span className="primaryColor">한 번에</span>
                  </h2>
                </Fade>
                <Fade direction="up" delay={500}>
                  <p>
                    초기비용 <span className="primaryColor">0원</span>으로 바로
                    시작하세요
                  </p>
                </Fade>
              </div>
              <div className="img-box">
                <Image
                  fetchPriority="high"
                  src="/images/visonmarker-visual.png"
                  alt="Visual Marker"
                  width={500}
                  height={300}
                  className="object-contain"
                />
                <div className="btn-list">
                  <button type="button">
                    <Link href="/sub">5초만에 상담받기</Link>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </FullpageSection>
        <FullpageSection name="content02">
          <div className="content content02">
            <Fade direction="left">
              <Image
                fetchPriority="high"
                src="/images/visual-item.png"
                alt="Visual Item"
                width={500}
                height={300}
                className="object-contain"
              />
            </Fade>
            <Fade direction="right">
              <div className="text-box">
                <h2 className="title">외주시장 90% 실패 이유?</h2>
                <p className="sub-text">
                  개발때문이 아닙니다.
                  <br /> 개발실력이 아무리 뛰어나도 기획이 미비하면,
                  <br /> 잘못된 결과가 발생합니다.
                  <br /> 저희는 프로젝트당 담당 기획자 배정해서, 대표님의
                  아이디어를
                  <br />
                  정확하고 꼼꼼히 구현시켜 드립니다.
                </p>
              </div>
            </Fade>
          </div>
        </FullpageSection>
        <FullpageSection name="content03">
          <div className="content content03 pc">
            <div className="content-box">
              <Fade direction="up">
                <h2 className="title">프로젝트 진행 과정</h2>
              </Fade>
              <div className="list">
                <Fade direction="up" delay={100} className="itemOuter">
                  <div className="item">
                    <Image
                      fetchPriority="high"
                      src="/images/Search.png"
                      alt="Search"
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                    <b>1차- 무료 컨설팅</b>
                    <p>
                      고객의 기대, 프로젝트 범위, 예산 및 일정에 대해 논의
                      합니다.
                      <br />
                      초기 아이디어를 이해하고 프로젝트의 가능성을 평가합니다.
                    </p>
                  </div>
                </Fade>
                <Fade direction="up" delay={200} className="itemOuter">
                  <div className="item">
                    <Image
                      fetchPriority="high"
                      src="/images/Folder.png"
                      alt="Folder"
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                    <b>
                      2차- 전문 기획자와
                      <br />
                      상세 기획
                    </b>
                    <p>
                      구체적인 기획안을 작성하여 프로젝트의 목표와 세부 실행
                      계획을 명확히 합니다.
                    </p>
                  </div>
                </Fade>
                <Fade direction="up" delay={300} className="itemOuter">
                  <div className="item">
                    <Image
                      fetchPriority="high"
                      src="/images/Wallet.png"
                      alt="Wallet"
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                    <b>
                      3차- 기획 컨펌 및<br />
                      피드백
                    </b>
                    <p>
                      상세 기획안을 고객에게 제시하고, 그들의 피드백을 받아 추가
                      개선을 진행합니다.
                    </p>
                  </div>
                </Fade>
                <Fade direction="up" delay={400} className="itemOuter">
                  <div className="item">
                    <Image
                      fetchPriority="high"
                      src="/images/Search.png"
                      alt="Search"
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                    <b>
                      4차- 최종기획,
                      <br />
                      디자인 컨펌
                    </b>
                    <p>
                      수정된 기획안에 대한 최종 승인을 얻어 개발 단계로
                      진행합니다.
                    </p>
                  </div>
                </Fade>
                <Fade direction="up" delay={500} className="itemOuter">
                  <div className="item">
                    <Image
                      fetchPriority="high"
                      src="/images/Bookmark.png"
                      alt="Bookmark"
                      width={22}
                      height={28}
                      className="object-contain"
                    />
                    <b>5차- 개발 및 테스트</b>
                    <p>
                      개발된 소프트웨어는 내부 및 외부 테스트를 거쳐 기능과
                      성능을 검증합니다.
                    </p>
                  </div>
                </Fade>
                <Fade direction="up" delay={600} className="itemOuter">
                  <div className="item">
                    <Image
                      fetchPriority="high"
                      src="/images/Category.png"
                      alt="Category"
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                    <b>6차- 품질 관리 및 검증</b>
                    <p>
                      최종 제품의 품질을 확보하기 위해 종합적인 품질 검사를
                      실시합니다.
                    </p>
                  </div>
                </Fade>
                <Fade direction="up" delay={700} className="itemOuter">
                  <div className="item">
                    <Image
                      fetchPriority="high"
                      src="/images/Category.png"
                      alt="Category"
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                    <b>7차- 배포 및 후속 지원</b>
                    <p>
                      완성된 프로젝트를 배포하고, 고객에게 필요한 훈련을
                      제공합니다. 지속적인 지원 및 유지 보수를 통해 고객 만족을
                      유지합니다.
                    </p>
                  </div>
                </Fade>
              </div>
            </div>
          </div>
        </FullpageSection>
        <FullpageSection name="content04">
          <div className="content content04">
            <div className="content-box">
              <div className="title-box">
                <Fade direction="up">
                  <h2 className="title">
                    비용결제 <span className="primaryColor">ZERO</span>!
                  </h2>
                </Fade>
                <Fade delay={100} direction="up">
                  <p className="sub-text">
                    프로젝트 시작부터 매월 안정적인 금액을 납부하면서 <br />
                    대표님의 비즈니스를 성장시킬 수 있습니다.
                  </p>
                </Fade>
              </div>
              <div className="list">
                <Fade delay={200} direction="up">
                  <div className="item">
                    <div>
                      <Image
                        fetchPriority="high"
                        src="/images/Piggybank-2.png"
                        alt="Piggybank"
                        width={100}
                        height={90}
                      />
                      <div className="text">
                        <h2>2천만원 이하</h2>
                        <span>12개월 분납 가능</span>
                      </div>
                    </div>
                    <div>
                      <Image
                        fetchPriority="high"
                        src="/images/Isolation_Mode.png"
                        alt="Isolation Mode"
                        width={100}
                        height={50}
                        className="object-contain"
                      />
                      <div className="text">
                        <h2>2천만원 이상</h2>
                        <span>
                          선납금 30% 이후
                          <br />
                          12개월 분납 가능
                        </span>
                      </div>
                    </div>
                  </div>
                </Fade>
              </div>
            </div>
          </div>
        </FullpageSection>
        <FullpageSection name="content05">
          <div className="content content05">
            <div className="content-box">
              <div className="title-box">
                <Fade direction="up">
                  <h2 className="title">
                    당신의 창의력이 만든 서비스, 세상이 알지 못한다면?
                    <br />
                    스타트업의 초기 자본은 무엇보다 중요합니다.
                  </h2>
                </Fade>
                <Fade direction="up" delay={200}>
                  <p className="sub-text">
                    하지만 그 중에서도 마케팅에의 투자는 선택이 아닌 필수입니다.
                    <br />
                    당신의 혁신적인 서비스가 시장에서 살아남고 성장하려면,
                    대중의 인식과 관심이 절대적입니다. <br />
                    초기 투자를 마케팅에 적극적으로 활용하여, <br />
                    당신의 서비스가 고객의 마음을 사로잡을 기회를 만드세요.
                  </p>
                </Fade>
              </div>
              <div className="img-box">
                <Image
                  fetchPriority="high"
                  src="/images/visonmarker-visual.png"
                  alt="Visual Marker"
                  width={500}
                  height={300}
                  className="object-contain"
                />
                <button type="button">
                  <Link href="/sub">5초만에 상담받기</Link>
                </button>
              </div>
            </div>
          </div>
        </FullpageSection>
        <FullpageSection isAutoHeight>
          <Footer />
        </FullpageSection>
      </FullpageContainer>
    </div>
  );
};

export default Index;
