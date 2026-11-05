import Script from "next/script";

// Pixels de rastreamento da página pública. Só entram IDs no formato esperado (a API também valida):
// nada digitado pelo dono vira código solto na página.
const META = /^\d{5,20}$/;
const GA = /^G-[A-Z0-9]{4,15}$/;

export default function Pixels({ meta, ga }: { meta?: string; ga?: string }) {
  const metaOk = meta && META.test(meta) ? meta : null;
  const gaOk = ga && GA.test(ga) ? ga : null;
  if (!metaOk && !gaOk) return null;

  return (
    <>
      {metaOk && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${metaOk}');fbq('track','PageView');`}
        </Script>
      )}
      {gaOk && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaOk}`} strategy="afterInteractive" />
          <Script id="ga-config" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${gaOk}');`}
          </Script>
        </>
      )}
    </>
  );
}
