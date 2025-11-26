import "../styles/globals.css";
import "../styles/style.scss";
import "../styles/toss-inspired.css";
import type { AppProps } from "next/app";
import { ConsultationProvider } from "../contexts/ConsultationContext";
import Script from "next/script";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ConsultationProvider>
      <Component {...pageProps} />

      {/* Tawk.to 실시간 채팅 위젯 */}
      <Script
        id="tawk-to"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
            (function(){
              var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
              s1.async=true;
              s1.src='https://embed.tawk.to/69267dfff9a3691962cb1af5/1jav5oc0c';
              s1.charset='UTF-8';
              s1.setAttribute('crossorigin','*');
              s0.parentNode.insertBefore(s1,s0);
            })();
          `,
        }}
      />
    </ConsultationProvider>
  );
}
