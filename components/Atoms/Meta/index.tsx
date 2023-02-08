import { ReactElement, FC } from "react";
import Head from "next/head";

const Meta: FC = (): ReactElement => {
  return (
    <Head key="meta">
      <meta charSet="utf-8" />
      <title>Content Management System</title>
      <link rel="icon" href="/public/favicon.ico" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="description" content="Content Management System" />
      <link rel="apple-touch-icon" href="/public/favicon.ico" />
      <link rel="manifest" href="/public/manifest.json" />
    </Head>
  );
};

export default Meta;
