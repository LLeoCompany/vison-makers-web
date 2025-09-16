import "@/styles/globals.css";
import "@/styles/style.scss";
import type { AppProps } from "next/app";
import { ConsultationProvider } from "@/contexts/ConsultationContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ConsultationProvider>
      <Component {...pageProps} />
    </ConsultationProvider>
  );
}
