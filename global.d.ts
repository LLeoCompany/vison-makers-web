// Global type declarations for analytics tracking

// Google Analytics gtag
declare function gtag(...args: any[]): void;

// Facebook Pixel
declare function fbq(...args: any[]): void;

interface Window {
  gtag: typeof gtag;
  fbq: typeof fbq;
  dataLayer: any[];
}
