import React, { FC, useState } from "react";
import { Box, Heading, VStack } from "@chakra-ui/layout";
import { Breadcrumb, BreadcrumbItem, Flex } from "@chakra-ui/react";
import { BsChevronRight } from "react-icons/bs";
import withAuth from "@/utils/withAuth";

import Layout from "@/components/Templates/Layout";
import "react-day-picker/lib/style.css";
import HTXHousesTable from "@/components/Organisms/HTXHousesTable";
import HTXHousesChat from "@/components/Organisms/HTXHousesChat";

const HtxHouses: FC = () => {
  return (
    <Layout title="HTX HOUSES | HTX">
      <VStack align="flex-start" minHeight="100vh" padding={["7", "10"]}>
        <Flex width="100%" justifyContent="space-between">
          <Breadcrumb
            separator={
              <Box marginBottom="8" fontSize="md">
                <BsChevronRight />
              </Box>
            }
          >
            <BreadcrumbItem>
              <Heading as="h1" size="lg" marginBottom="8">
                HTX Houses
              </Heading>
            </BreadcrumbItem>
          </Breadcrumb>
        </Flex>
        <HTXHousesTable />
        <HTXHousesChat />
      </VStack>
    </Layout>
  );
};

export default withAuth(HtxHouses);
