import React, { FC, ReactNode } from "react";
import { Box } from "@chakra-ui/react";
import Head from "next/head";

import Sidebar from "@/components/Organisms/Sidebar";

type LayoutProps = {
  children: ReactNode;
  title: string;
};

const Layout: FC<LayoutProps> = ({ children, title }) => {
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box as="main">
        <Sidebar />
        <Box as="section" marginLeft="250px">
          {children}
        </Box>
      </Box>
    </div>
  );
};

export default Layout;
