import { Head, Html, Main, NextScript } from 'next/document.js'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" type="image/svg+xml" href="/icons/favicon.svg" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/icons/favicon.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#18181b" />
        <meta
          name="description"
          content="Cellular automaton for wave simulation"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <link rel="mask-icon" href="/icons/mask-icon.svg" color="#16a34a" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icons/apple-touch-icon.png"
        />
      </Head>
      <body className="touch-pan-y select-none bg-zinc-900 text-zinc-100 [-webkit-tap-highlight-color:transparent] [-webkit-touch-callout:none]">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
