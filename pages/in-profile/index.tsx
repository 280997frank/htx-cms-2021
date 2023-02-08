import InProfileTable from "@/components/Organisms/InProfileTable";
import Layout from "@/components/Templates/Layout";
import withAuth from "@/utils/withAuth";
import { Breadcrumb, BreadcrumbItem } from "@chakra-ui/breadcrumb";
import { Box, Flex, Heading, Text, VStack } from "@chakra-ui/layout";
import { FC } from "react";
import { BsChevronRight } from "react-icons/bs";

const InProfile: FC = () => {
  return (
    <Layout title="In Profile | HTX CMS 2021">
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
              <Heading as="h1" size="xl" marginBottom="8">
                In Profile
              </Heading>
            </BreadcrumbItem>
          </Breadcrumb>
        </Flex>
        <InProfileTable />
      </VStack>
    </Layout>
  );
};
export default withAuth(InProfile);
