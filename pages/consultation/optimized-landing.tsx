/**
 * 최적화된 상담신청 랜딩 페이지
 * AIDA 모델과 마케팅 이론을 적용한 고전환율 페이지
 */

import React from "react";
import Head from "next/head";
import { GetServerSideProps } from "next";
import { OptimizedConsultationLanding } from "@/components/consultation/OptimizedConsultationLanding";
import { ConsultationProvider } from "@/contexts/ConsultationContext";

// SEO 및 성능 최적화를 위한 메타데이터
const pageMetadata = {
  title: "웹사이트 제작비 50% 절약 - 무료 상담 신청 | LeoFitTech",
  description:
    "대기업 절반 가격으로 같은 품질의 웹사이트를 제작해드립니다. 5분 상담으로 맞춤 견적을 확인하세요. 24시간 내 연락, 100% 무료 상담.",
  keywords:
    "웹사이트 제작, 홈페이지 제작, 온라인 쇼핑몰, 무료 상담, 견적, 저렴한 가격",
  ogImage: "/images/og-consultation-landing.jpg",
  canonicalUrl: "https://LeoFitTech.co.kr/consultation/optimized-landing",
};

interface OptimizedLandingPageProps {
  utm: {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  };
  userAgent: string;
  referrer: string;
}

const OptimizedLandingPage: React.FC<OptimizedLandingPageProps> = ({
  utm,
  userAgent,
  referrer,
}) => {
  return (
    <>
      <Head>
        {/* 기본 메타데이터 */}
        <title>{pageMetadata.title}</title>
        <meta name="description" content={pageMetadata.description} />
        <meta name="keywords" content={pageMetadata.keywords} />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={pageMetadata.canonicalUrl} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageMetadata.title} />
        <meta property="og:description" content={pageMetadata.description} />
        <meta property="og:image" content={pageMetadata.ogImage} />
        <meta property="og:url" content={pageMetadata.canonicalUrl} />
        <meta property="og:site_name" content="LeoFitTech" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageMetadata.title} />
        <meta name="twitter:description" content={pageMetadata.description} />
        <meta name="twitter:image" content={pageMetadata.ogImage} />

        {/* 성능 최적화 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />

        {/* 폰트 최적화 - 중요한 폰트만 preload */}
        <link
          rel="preload"
          href="/fonts/pretendard-bold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        {/* Critical CSS 인라인 */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            /* Critical CSS for above-the-fold content */
            .consultation-landing {
              font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;
              line-height: 1.6;
              color: #2D3748;
            }

            .hero-section {
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              background: linear-gradient(135deg, #FFF5F2 0%, #FFE8E1 100%);
              padding: 2rem 1rem;
            }

            .main-headline {
              font-size: clamp(2rem, 6vw, 4rem);
              font-weight: 900;
              line-height: 1.2;
              margin-bottom: 1rem;
              text-align: center;
            }

            .highlight {
              color: #FF6B35;
              position: relative;
            }

            .cta-button {
              display: inline-flex;
              align-items: center;
              gap: 0.5rem;
              padding: 1rem 2rem;
              background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
              color: white;
              border: none;
              border-radius: 0.75rem;
              font-size: 1.125rem;
              font-weight: 700;
              cursor: pointer;
              transition: all 0.3s ease;
              text-decoration: none;
            }

            .cta-button:hover {
              transform: translateY(-2px);
              box-shadow: 0 8px 24px rgba(255, 107, 53, 0.4);
            }

            .container {
              max-width: 1200px;
              margin: 0 auto;
              padding: 0 1rem;
            }

            .animate-in {
              animation: slideInUp 0.8s ease-out;
            }

            @keyframes slideInUp {
              from {
                opacity: 0;
                transform: translateY(30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            /* 로딩 상태 스타일 */
            .loading-skeleton {
              background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
              background-size: 200% 100%;
              animation: loading 1.5s infinite;
            }

            @keyframes loading {
              0% { background-position: 200% 0; }
              100% { background-position: -200% 0; }
            }
          `,
          }}
        />

        {/* 구조화된 데이터 (JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Service",
              name: "웹사이트 제작 서비스",
              description: pageMetadata.description,
              provider: {
                "@type": "Organization",
                name: "LeoFitTech",
                url: "https://LeoFitTech.co.kr",
                logo: "https://LeoFitTech.co.kr/logo.png",
                contactPoint: {
                  "@type": "ContactPoint",
                  telephone: "+82-2-1234-5678",
                  contactType: "customer service",
                  availableLanguage: "Korean",
                },
              },
              offers: {
                "@type": "Offer",
                description: "웹사이트 제작 무료 상담",
                price: "0",
                priceCurrency: "KRW",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.9",
                reviewCount: "247",
                bestRating: "5",
              },
            }),
          }}
        />

        {/* 마케팅 픽셀 및 추적 코드 */}
        {/* Google Analytics 4 */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'GA_MEASUREMENT_ID', {
                send_page_view: false,
                custom_map: {
                  'custom_parameter_1': 'utm_source',
                  'custom_parameter_2': 'utm_medium',
                  'custom_parameter_3': 'utm_campaign'
                }
              });

              // 랜딩 페이지 진입 이벤트
              gtag('event', 'page_view', {
                page_title: 'Optimized Consultation Landing',
                page_location: window.location.href,
                utm_source: '${utm.source || ""}',
                utm_medium: '${utm.medium || ""}',
                utm_campaign: '${utm.campaign || ""}',
                utm_term: '${utm.term || ""}',
                utm_content: '${utm.content || ""}',
                user_agent: '${userAgent}',
                referrer: '${referrer}'
              });
            `,
          }}
        />

        {/* Facebook Pixel */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', 'FB_PIXEL_ID');
              fbq('track', 'PageView');
              fbq('track', 'ViewContent', {
                content_type: 'landing_page',
                content_name: 'consultation_landing',
                utm_source: '${utm.source || ""}',
                utm_medium: '${utm.medium || ""}',
                utm_campaign: '${utm.campaign || ""}'
              });
            `,
          }}
        />

        {/* Google Ads 전환 추적 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              gtag('config', 'AW-CONVERSION_ID');
            `,
          }}
        />

        {/* Hotjar 또는 기타 히트맵 도구 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:HOTJAR_ID,hjsv:6};
                a=o.getElementsByTagName('head')[0];
                r=o.createElement('script');r.async=1;
                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                a.appendChild(r);
              })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
            `,
          }}
        />
      </Head>

      {/* 메인 콘텐츠 */}
      <ConsultationProvider>
        <main className="optimized-landing-page">
          <OptimizedConsultationLanding />
        </main>
      </ConsultationProvider>

      {/* 지연 로딩 스타일시트 */}
      <link
        rel="stylesheet"
        href="/styles/consultation-landing.css"
        media="print"
        onLoad={(e) => {
          (e.currentTarget as HTMLLinkElement).media = "all";
        }}
      />

      {/* 서비스 워커 등록 (선택사항) */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js')
                  .then(function(registration) {
                    console.log('SW registered: ', registration);
                  })
                  .catch(function(registrationError) {
                    console.log('SW registration failed: ', registrationError);
                  });
              });
            }
          `,
        }}
      />
    </>
  );
};

// 서버사이드 props 수집
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, query } = context;

  // UTM 파라미터 추출
  const utm = {
    source: query.utm_source as string,
    medium: query.utm_medium as string,
    campaign: query.utm_campaign as string,
    term: query.utm_term as string,
    content: query.utm_content as string,
  };

  // 사용자 에이전트 및 참조자 정보
  const userAgent = req.headers["user-agent"] || "";
  const referrer = req.headers.referer || "";

  // A/B 테스트 변형 할당 (서버사이드)
  const userSegment = determineUserSegment(userAgent, referrer);

  // 성능 추적을 위한 서버 시간 기록
  const serverTime = Date.now();

  return {
    props: {
      utm,
      userAgent,
      referrer,
      userSegment,
      serverTime,
    },
  };
};

// 사용자 세그먼트 결정 (서버사이드)
function determineUserSegment(userAgent: string, referrer: string): string {
  // 모바일 디바이스 체크
  const isMobile = /Mobile|Android|iPhone|iPad/i.test(userAgent);

  // 트래픽 소스 체크
  if (referrer.includes("google.com")) {
    return isMobile ? "mobile_google" : "desktop_google";
  }

  if (referrer.includes("facebook.com") || referrer.includes("fb.com")) {
    return isMobile ? "mobile_facebook" : "desktop_facebook";
  }

  if (referrer.includes("naver.com")) {
    return isMobile ? "mobile_naver" : "desktop_naver";
  }

  // 직접 방문
  if (!referrer) {
    return isMobile ? "mobile_direct" : "desktop_direct";
  }

  return isMobile ? "mobile_other" : "desktop_other";
}

export default OptimizedLandingPage;
