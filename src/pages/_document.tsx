import { createGetInitialProps } from "@mantine/next";
import Document, { Head, Html, Main, NextScript } from "next/document";

const getInitialProps = createGetInitialProps();

export default class _Document extends Document {
  static getInitialProps = getInitialProps;

  render() {
    return (
      <Html>
        <Head>
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
          <meta
            name="description"
            content="Visualize statistics for your Destiny 2 characters"
          />
        </Head>
        <body className="scroll-smooth selection:bg-sky-50 selection:text-blue-400 font-inter bg-zinc-900 text-white max-w-7xl mx-auto">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}