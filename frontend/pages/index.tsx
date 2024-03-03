import React from "react";
import Head from "next/head";
import { NextSeo } from "next-seo";
import { Header } from "../components/Header";
import { Welcome } from "../components/Welcome";

import Script from "next/script";
import {
  C_DESCRIPTION,
  C_SEO_DESCRIPTION,
  C_TITLE,
  C_URL,
  GA_ID,
} from "../config";

export default function Home(): JSX.Element {
  return (
    <div>
      <NextSeo
        title={C_TITLE}
        description={C_SEO_DESCRIPTION}
        canonical={C_URL}
        openGraph={{
          url: C_URL,
          title: C_TITLE,
          description: C_DESCRIPTION,
          images: [{ url: `${C_URL}images/thumbnail.png` }],
        }}
      />
      <Head>
        <title>{C_TITLE}</title>
        <link rel="icon" href="/fav.png" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css"
        />
        <script type="application/javascript" src="/snarkjs.min.js"></script>
      </Head>

      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      ></Script>
      <Script>
        {`
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', '${GA_ID}');`}
      </Script>
      <Header />
      <Welcome />
      {/* <Footer /> */}
    </div>
  );
}
