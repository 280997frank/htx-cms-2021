import { ManageUserForm } from "@/components/Organisms/ManageUserForm";
import Layout from "@/components/Templates/Layout";
import { UseSuperAdmin } from "@/utils";
import withAuth from "@/utils/withAuth";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/breadcrumb";
import { Box, Flex, Heading, VStack } from "@chakra-ui/layout";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC, useState } from "react";
import { BsChevronRight } from "react-icons/bs";

const ManageUserFormPage: FC = () => {
  const [breadcrumbItem, setBreadcrumItem] = useState("New");
  const router = useRouter();
  const isSuperAdmin = UseSuperAdmin();
  if (isSuperAdmin !== null && !isSuperAdmin) router.push("/");

  return (
    <Layout title="Manage User | HTX CMS 2021">
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
                <Link href="/manage-users" passHref>
                  <Heading as="h1" size="xl" marginBottom="8" color="gray.300">
                    Manage Users
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
        <ManageUserForm
          breadcrumbItem={(item: string) => setBreadcrumItem(item)}
        />
      </VStack>
    </Layout>
  );
};
export default withAuth(ManageUserFormPage);
