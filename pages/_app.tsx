import Head from 'next/head';
import { SessionProvider } from 'next-auth/react';
import { Inter } from '@next/font/google';

import type { AppProps } from 'next/app';

import '../styles/globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  preload: true,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <SessionProvider session={pageProps.session}>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
          />
        </Head>
        <style jsx global>{`
          html {
            font-family: ${inter.style.fontFamily};
          }
        `}</style>
        <Component {...pageProps} />
      </SessionProvider>
    </>
  );
}

export default MyApp;
