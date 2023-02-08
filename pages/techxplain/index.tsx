import TechxplainTable from "@/components/Organisms/TechxplainTable";
import Layout from "@/components/Templates/Layout";
import { Breadcrumb, BreadcrumbItem } from "@chakra-ui/breadcrumb";
import { Box, Flex, Heading, VStack } from "@chakra-ui/layout";
import { FC } from "react";
import { BsChevronRight } from "react-icons/bs";

const Techxplain: FC = () => {
  return (
    <Layout title="Techxplain | HTX CMS 2021">
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
                TechXplain
              </Heading>
            </BreadcrumbItem>
          </Breadcrumb>
        </Flex>
        <TechxplainTable />
      </VStack>
    </Layout>
  );
};
export default Techxplain;
