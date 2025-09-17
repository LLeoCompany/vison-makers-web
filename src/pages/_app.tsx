import "@/styles/globals.css";
import "@/styles/style.scss";
import "@/styles/toss-inspired.css";
import type { AppProps } from "next/app";
import { ConsultationProvider } from "@/contexts/ConsultationContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ConsultationProvider>
      <Component {...pageProps} />
    </ConsultationProvider>
  );
}
