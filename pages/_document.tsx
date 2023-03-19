import { Head, Html, Main, NextScript } from 'next/document'
import React from 'react'

const Document = () => {
  return (
    <Html lang='en'>
      <Head>
        <link rel="apple-touch-icon" sizes="180x180" href="/meta/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/meta/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/meta/favicon-16x16.png" />
        <link rel="manifest" href="/meta/site.webmanifest" />
        <link rel="mask-icon" href="/meta/safari-pinned-tab.svg" color="#5bbad5" />
        <link rel="shortcut icon" href="/meta/favicon.ico" />
        <meta name="msapplication-TileColor" content="#ffc40d" />
        <meta name="msapplication-config" content="/meta/browserconfig.xml" />
        <meta name="theme-color" content="#ffffff" />

      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

export default Document
