import { asset, Head } from "$fresh/runtime.ts";

function GlobalTags() {
  return (
    <Head>
      <meta
        name="google-site-verification"
        content="KjKLOj9ZORFR8rAXjPzFmpCyz9h7ivARJzL_EKj3Udc"
      />
      {/* Enable View Transitions API */}
      <meta name="view-transition" content="same-origin" />

      {/* Tailwind v3 CSS file */}
      <link href={asset("/styles.css")} rel="stylesheet" />

      <link rel="preconnect" href={asset("https://fonts.googleapis.com")} />
      <link
        rel="preconnect"
        href={asset("https://fonts.gstatic.com")}
        crossOrigin="true"
      />

      <link
        rel="preconnect"
        href={asset("https://fonts.gstatic.com")}
        crossOrigin="true"
      />

      <link
        rel="preload"
        as="style"
        href={asset(
          "https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap",
        )}
      />

      <link
        rel="stylesheet"
        media="print"
        href={asset(
          "https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap",
        )}
      />

      <noscript>
        <link
          rel="stylesheet"
          href={asset(
            "https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap",
          )}
        />
      </noscript>

      {/* Web Manifest */}
      <link rel="manifest" href={asset("/site.webmanifest")} />
    </Head>
  );
}

export default GlobalTags;
