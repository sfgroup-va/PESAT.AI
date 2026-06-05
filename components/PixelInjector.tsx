"use client";

import Script from "next/script";

// IDs are strictly validated upstream (sanitizePixelGoogle / sanitizePixelMeta),
// so interpolating them into the snippets below is injection-safe.
export function PixelInjector({ googleId, metaId }: { googleId?: string; metaId?: string }) {
  return (
    <>
      {googleId ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${googleId}`} strategy="afterInteractive" />
          <Script id="pesat-gtag-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${googleId}');`}
          </Script>
        </>
      ) : null}
      {metaId ? (
        <>
          <Script id="pesat-meta-pixel" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${metaId}');fbq('track','PageView');`}
          </Script>
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img height="1" width="1" style={{ display: "none" }} alt="" src={`https://www.facebook.com/tr?id=${metaId}&ev=PageView&noscript=1`} />
          </noscript>
        </>
      ) : null}
    </>
  );
}
