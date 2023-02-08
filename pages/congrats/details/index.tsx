import { FC, ReactElement, useState } from "react";
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
import CongratsForm from "@/components/Organisms/CongratsForm";

const CongratsDetails: FC = (): ReactElement => {
  const [isEdit, setIsEdit] = useState("");
  return (
    <Layout title="">
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
              <Link href="/congrats" passHref>
                <Heading as="h1" size="xl" marginBottom="8" color="gray.300">
                  Congratulations
                </Heading>
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Heading as="h1" size="xl" marginBottom="8">
              {isEdit === "EXCEED"
                ? "eXceeding eXpectations"
                : isEdit === "THANK"
                ? "Thanks-A-Latte"
                : "New"}
            </Heading>
          </BreadcrumbItem>
        </Breadcrumb>
        <CongratsForm
          onChange={(val: any) => {
            if (val) {
              setIsEdit(val);
            } else {
              setIsEdit("");
            }
          }}
        />
      </VStack>
    </Layout>
  );
};
export default CongratsDetails;
