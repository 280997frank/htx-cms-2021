import React, { FC } from "react";

import { Box, Heading, VStack } from "@chakra-ui/layout";
import { Breadcrumb, BreadcrumbItem } from "@chakra-ui/react";
import { BsChevronRight } from "react-icons/bs";

import Layout from "@/components/Templates/Layout";
import withAuth from "@/utils/withAuth";
import WhatsupTable from "@/components/Organisms/WhatsupTable";

const Whatsup: FC = () => {
  return (
    <Layout title="What's Up">
      <VStack align="flex-start" minHeight="100vh" padding={["7", "10"]}>
        <Breadcrumb
          separator={
            <Box marginBottom="8" fontSize="md">
              <BsChevronRight />
            </Box>
          }
        >
          <BreadcrumbItem>
            <Heading as="h1" size="xl" marginBottom="8">
              What&apos;s Up
            </Heading>
          </BreadcrumbItem>
        </Breadcrumb>
        <WhatsupTable />
      </VStack>
    </Layout>
  );
};
export default withAuth(Whatsup);
