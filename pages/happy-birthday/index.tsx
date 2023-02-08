import React, { FC } from "react";

import { Box, Heading, VStack } from "@chakra-ui/layout";
import { Breadcrumb, BreadcrumbItem } from "@chakra-ui/react";
import { BsChevronRight } from "react-icons/bs";
import Layout from "@/components/Templates/Layout";
import withAuth from "@/utils/withAuth";
import Table from "@/components/Organisms/HappyBirthdayTable";

const HappyBirthday: FC = () => {
  return (
    <Layout title="Happy Birthday">
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
              Happy Birthday
            </Heading>
          </BreadcrumbItem>
        </Breadcrumb>
        <Table />
      </VStack>
    </Layout>
  );
};

export default withAuth(HappyBirthday);
