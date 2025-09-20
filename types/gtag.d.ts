declare global {
  function gtag(...args: any[]): void;

  interface Window {
    gtag: typeof gtag;
    dataLayer: any[];
  }
}

export {};