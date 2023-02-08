import React, { FC } from "react";

import { Box, Heading, VStack } from "@chakra-ui/layout";
import { Breadcrumb, BreadcrumbItem } from "@chakra-ui/react";
import { BsChevronRight } from "react-icons/bs";
import Layout from "@/components/Templates/Layout";
import withAuth from "@/utils/withAuth";
import Table from "@/components/Organisms/EventHighlightTable";

const EventHighlight: FC = () => {
  return (
    <Layout title="Event Highlight">
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
              Event Highlights
            </Heading>
          </BreadcrumbItem>
        </Breadcrumb>
        <Table />
      </VStack>
    </Layout>
  );
};

export default withAuth(EventHighlight);
