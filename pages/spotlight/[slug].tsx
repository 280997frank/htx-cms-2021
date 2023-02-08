import { SpotlightForm } from "@/components/Organisms/SpotlightForm";
import Layout from "@/components/Templates/Layout";
import withAuth from "@/utils/withAuth";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/breadcrumb";
import { Box, Flex, Heading, VStack } from "@chakra-ui/layout";
import Link from "next/link";
import { FC, useState } from "react";
import { BsChevronRight } from "react-icons/bs";

const Spotlight: FC = () => {
  const [breadcrumbItem, setBreadcrumItem] = useState("New");
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
              <BreadcrumbLink>
                <Link href="/spotlight" passHref>
                  <Heading as="h1" size="xl" marginBottom="8" color="gray.300">
                    Spotlight
                  </Heading>
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <Heading as="h1" size="xl" marginBottom="8">
                {breadcrumbItem}
              </Heading>
            </BreadcrumbItem>
          </Breadcrumb>
        </Flex>
        <SpotlightForm
          breadcrumbItem={(item: string) => setBreadcrumItem(item)}
        />
      </VStack>
    </Layout>
  );
};
export default withAuth(Spotlight);
