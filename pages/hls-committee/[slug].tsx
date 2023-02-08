import React, { useMemo, useEffect } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";

import {
  Box,
  Heading,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";
import { Formik } from "formik";
import { string } from "yup";
import CommitteeForm from "@/components/Organisms/HLSForm";
import { BsChevronRight } from "react-icons/bs";
import Layout from "@/components/Templates/Layout";
import { requiredString } from "@/constants/validationSchema";
import {} from "@/hooks/hls-committee";
import { createHlscomitteeInput } from "@/types/hls-committee";
import { useUploadFile } from "@/hooks/upload";
import { MediaFolderType } from "@/types/upload";

const HlsCommitteeAction = () => {
  const router = useRouter();
  const { slug } = router.query;

  return (
    <Layout title="HLS Committee">
      <Box padding={["7", "10"]}>
        <Breadcrumb
          separator={
            <Box marginBottom="8" fontSize="md">
              <BsChevronRight />
            </Box>
          }
        >
          <BreadcrumbItem>
            <NextLink href="/hls-committee" passHref>
              <BreadcrumbLink>
                <Heading as="h1" size="xl" marginBottom="8" color="gray.300">
                  HLS Committee
                </Heading>
              </BreadcrumbLink>
            </NextLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Heading as="h1" size="xl" marginBottom="8">
              Details
            </Heading>
          </BreadcrumbItem>
        </Breadcrumb>
        <CommitteeForm loading={false} slug={slug} />
      </Box>
    </Layout>
  );
};

export default HlsCommitteeAction;
