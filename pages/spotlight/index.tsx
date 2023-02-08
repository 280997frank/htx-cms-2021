import SpotlightTable from "@/components/Organisms/SpotlightTable";
import Layout from "@/components/Templates/Layout";
import withAuth from "@/utils/withAuth";
import { Breadcrumb, BreadcrumbItem } from "@chakra-ui/breadcrumb";
import { Box, Flex, Heading, VStack } from "@chakra-ui/layout";
import { FC } from "react";
import { BsChevronRight } from "react-icons/bs";

const Spotlight: FC = () => {
  return (
    <Layout title="Spotlight | HTX CMS 2021">
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
                Spotlight
              </Heading>
            </BreadcrumbItem>
          </Breadcrumb>
        </Flex>
        <SpotlightTable />
      </VStack>
    </Layout>
  );
};
export default withAuth(Spotlight);
