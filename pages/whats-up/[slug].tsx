import React, { FC, useState } from "react";
import Layout from "components/Templates/Layout";
import { Box, Heading, VStack } from "@chakra-ui/layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/breadcrumb";
import { BsChevronRight } from "react-icons/bs";
import Link from "next/link";
import withAuth from "@/utils/withAuth";
import WhatsupForm from "@/components/Organisms/WhatsupForm";

const WhatsupDetail: FC = () => {
  const [breadcrumbItem, setBreadcrumItem] = useState("New");

  return (
    <Layout title="What's Up Form">
      <VStack align="flex-start" minHeight="100vh" padding={["7", "10"]}>
        <Breadcrumb
          separator={
            <Box marginBottom="8" fontSize="md">
              <BsChevronRight />
            </Box>
          }
        >
          <BreadcrumbItem>
            <BreadcrumbLink>
              <Link href="/whats-up" passHref>
                <Heading as="h1" size="xl" marginBottom="8" color="gray.300">
                  What&apos;s Up
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
        <WhatsupForm
          breadcrumbItem={(item: string) => setBreadcrumItem(item)}
        />
      </VStack>
    </Layout>
  );
};

export default withAuth(WhatsupDetail);
