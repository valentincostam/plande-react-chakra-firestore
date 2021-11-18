import { ChakraProvider } from '@chakra-ui/react';
import Layout from '@/components/Layout';
import { AuthProvider } from '@/lib/auth';
import theme from 'theme';
import { Global, css } from '@emotion/react';
import Head from 'next/head';

function GlobalStyle({ children }) {
  return (
    <>
      <Head>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      <Global
        styles={css`
          #__next {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
          }
        `}
      />
      {children}
    </>
  );
}

export default function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider resetCSS={true} theme={theme}>
      <AuthProvider>
        <Layout>
          <GlobalStyle />
          <Component {...pageProps} />
        </Layout>
      </AuthProvider>
    </ChakraProvider>
  );
}
