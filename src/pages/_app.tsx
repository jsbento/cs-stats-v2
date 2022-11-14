// src/pages/_app.tsx
import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import type { AppType } from "next/app";
import { trpc } from "../utils/trpc";
import Head from "next/head";
import Layout from "../components/layout/Layout";
import { MantineProvider } from "@mantine/core";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <Head>
        <title>CS:GO Stats</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <SessionProvider session={session}>
        <MantineProvider theme={{ colorScheme: "dark" }}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </MantineProvider>
      </SessionProvider>
    </>
  );
};

export default trpc.withTRPC(MyApp);
