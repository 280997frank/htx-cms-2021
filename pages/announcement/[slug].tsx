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
import AnnouncementForm from "@/components/Organisms/AnnouncementForm";

const AnnouncementDetail: FC = () => {
  const [breadcrumbItem, setBreadcrumItem] = useState("New");
  return (
    <Layout title="Announcements Form">
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
              <Link href="/announcement" passHref>
                <Heading as="h1" size="xl" marginBottom="8" color="gray.300">
                  Announcements
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
        <AnnouncementForm
          breadcrumbItem={(item: string) => setBreadcrumItem(item)}
        />
      </VStack>
    </Layout>
  );
};

export default withAuth(AnnouncementDetail);
