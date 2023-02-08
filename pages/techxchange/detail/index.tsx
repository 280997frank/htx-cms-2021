import { FC, ReactElement } from "react";
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  Heading,
  VStack,
} from "@chakra-ui/react";
import { BsChevronRight } from "react-icons/bs";
import { BreadcrumbLink } from "@chakra-ui/breadcrumb";
import Link from "next/link";
import Layout from "@/components/Templates/Layout";
import TechxchangeForm from "@/components/Organisms/TechxchangeForm";
import { useRouter } from "next/router";

const TechxchangeDetails: FC = (): ReactElement => {
  const router = useRouter();
  const { id, title }: any = router.query;
  return (
    <Layout title="Techxchange Input | HTX 2021">
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
              <Link href="/techxchange" passHref>
                <Heading as="h1" size="xl" marginBottom="8" color="gray.300">
                  TechXchange
                </Heading>
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Heading as="h1" size="xl" marginBottom="8">
              {id && title ? decodeURIComponent(title) : "New"}
            </Heading>
          </BreadcrumbItem>
        </Breadcrumb>
        <TechxchangeForm />
      </VStack>
    </Layout>
  );
};
export default TechxchangeDetails;
