import ManageUserTable from "@/components/Organisms/ManageUsersTable";
import Layout from "@/components/Templates/Layout";
import { UseSuperAdmin } from "@/utils";
import withAuth from "@/utils/withAuth";
import { Breadcrumb, BreadcrumbItem } from "@chakra-ui/breadcrumb";
import { Box, Flex, Heading, VStack } from "@chakra-ui/layout";
import { useRouter } from "next/router";
import { FC } from "react";
import { BsChevronRight } from "react-icons/bs";

const ManageUsers: FC = () => {
  const router = useRouter();
  const isSuperAdmin = UseSuperAdmin();
  if (isSuperAdmin !== null && !isSuperAdmin) router.push("/");

  return (
    <Layout title="Manage Users | HTX CMS 2021">
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
                Manage Users
              </Heading>
            </BreadcrumbItem>
          </Breadcrumb>
        </Flex>
        <ManageUserTable />
      </VStack>
    </Layout>
  );
};
export default withAuth(ManageUsers);
