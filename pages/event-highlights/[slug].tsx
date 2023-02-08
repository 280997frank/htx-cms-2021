import EventHighlighForm from "@/components/Organisms/EventHighlightForm";
import withAuth from "@/utils/withAuth";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/breadcrumb";
import { Box, Heading, VStack } from "@chakra-ui/layout";
import Layout from "components/Templates/Layout";
import Link from "next/link";
import React, { FC } from "react";
import { BsChevronRight } from "react-icons/bs";

const EventHighlightDetail: FC = () => {
  return (
    <Layout title="Event Highlighs">
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
              <Link href="/event-highlights" passHref>
                <Heading as="h1" size="xl" marginBottom="8" color="gray.300">
                  Event Highlights
                </Heading>
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Heading as="h1" size="xl" marginBottom="8">
              Title
            </Heading>
          </BreadcrumbItem>
        </Breadcrumb>
        <EventHighlighForm />
      </VStack>
    </Layout>
  );
};

export default withAuth(EventHighlightDetail);
