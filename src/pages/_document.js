import { Html, Head, Main, NextScript } from 'next/document';

import TopHeader from '@/components/TopHeader';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />

        <NextScript />
        <TopHeader />
      </body>
    </Html>
  );
}
