import React from 'react'
import Head from "next/head";
import { NextSeo } from "next-seo";
import Script from 'next/script';
import { GA_ID } from '../config';
import { Header } from '../components/Header';
import { Welcome } from '../components/Welcome';

export default function NotFound(): JSX.Element {
  return (
    <div className="text-black">
      <NextSeo
        title="404"
        description="404 page for all our missing pages"
        canonical="https://github.io/404"
        openGraph={{
          url: "https://github.io/404",
        }}
      />
      <Head>
        <title>404</title>
        <link rel="icon" href="/favicon.ico" />
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
      {/* <div className="flex flex-col mx-auto text-center justify-center text-white h-screen bg-primary-300">
        <div className="flex justify-center items-end">
          <div className="flex flex-col">
          </div>
          <div className="flex flex-col p-8 text-center">
            <div className="flex gap-4 mt-4 mb-8 mx-auto">
              404
            </div>
            <div className="flex gap-2">
            </div>
          </div>

        </div>
      </div> */}
    </div>
  );
}
