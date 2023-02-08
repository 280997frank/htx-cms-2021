import React, { useEffect, useMemo } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import {
  Box,
  Heading,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import { Formik, FormikHelpers, FormikProps, FormikValues } from "formik";
import { object, string } from "yup";
import { BsChevronRight } from "react-icons/bs";
import CustomTab from "@/components/Atoms/CustomTab";
import UserPersonalForm from "@/components/Organisms/UserPersonalForm";
import Layout from "@/components/Templates/Layout";
import UserWorkForm from "@/components/Organisms/UserWorkForm";
import { useUserDetail, useAddUser, useUpdateUser } from "@/hooks/users";
import {
  IUserCreatePayload,
  IUserInput,
  IUserUpdatePayload,
} from "@/types/users";
import { requiredString } from "@/constants/validationSchema";
import { useUploadFile } from "@/hooks/upload";
import { MediaFolderType } from "@/types/upload";

const emptyValues: IUserInput = {
  fullname: "",
  roles: "",
  country: "",
  aboutMe: "",
  email: "",
  phoneNumber: "",
  interests: [],
  profilePicture: "",
  isActive: true,
  connection: {
    facebook: { isActive: false, url: "" },
    linkedin: { isActive: false, url: "" },
    twitter: { isActive: false, url: "" },
    link: { isActive: false, url: "" },
  },
  company: {
    companyName: "",
    companyDescription: "",
    companyLogo: "",
    industry: "FMCG",
    position: "",
    companyWebsite: "",
  },
};

const validationSchema = object({
  fullname: requiredString,
  roles: requiredString,
  email: requiredString,
  connection: object({
    facebook: object({
      url: string().url("The value should be valid URL").nullable(),
    }),
    linkedin: object({
      url: string().url("The value should be valid URL").nullable(),
    }),
    twitter: object({
      url: string().url("The value should be valid URL").nullable(),
    }),
    link: object({
      url: string().url("The value should be valid URL").nullable(),
    }),
  }).nullable(),
  company: object({
    companyWebsite: string().url("The value should be valid URL").nullable(),
  }).nullable(),
});

const UsersAction = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { getUserDetail, loading, data } = useUserDetail(slug as string);
  const { addUser, loading: addLoading } = useAddUser();
  const { updateUser, loading: updateLoading } = useUpdateUser();
  const { uploadFile } = useUploadFile();

  useEffect(() => {
    if (slug !== "new" && slug !== undefined) {
      getUserDetail();
    }
  }, [slug, getUserDetail]);

  const initialValues = useMemo(() => {
    if (slug !== "new" && data) {
      const userDetail = data.getUserDetail;
      return { ...emptyValues, ...userDetail };
    } else {
      return emptyValues;
    }
  }, [slug, data]);

  const handleSubmit = async (values: IUserInput) => {
    let profilePicture = "";
    let companyLogo = "";

    if (values.profilePicture instanceof File) {
      // NOTE: upload separately and save the URL
      const uploadResult = await uploadFile({
        variables: {
          uploadFilesInput: {
            file: values.profilePicture,
            folder: MediaFolderType.USERS,
          },
        },
      });
      profilePicture = uploadResult.data?.uploadFile.url || "";
    } else {
      profilePicture = values.profilePicture;
    }

    if (values.company.companyLogo instanceof File) {
      // NOTE: upload separately and save the URL
      const uploadResult = await uploadFile({
        variables: {
          uploadFilesInput: {
            file: values.company.companyLogo,
            folder: MediaFolderType.COMPANY,
          },
        },
      });
      companyLogo = uploadResult.data?.uploadFile.url || "";
    } else {
      companyLogo = values.company.companyLogo;
    }

    if (slug === "new") {
      const newValues: IUserCreatePayload = {
        paramRegister: {
          ...values,
          profilePicture,
          company: { ...values.company, companyLogo },
        },
      };
      await addUser({
        variables: { paramRegister: { ...values, profilePicture } },
      });
    } else {
      const updateValues: IUserUpdatePayload = {
        params: {
          ...values,
          id: slug as string,
          profilePicture,
          company: { ...values.company, companyLogo },
        },
      };
      delete updateValues.params.email;
      await updateUser({
        variables: updateValues,
      });
    }
  };

  return (
    <Layout title="Users | ZodiacLive CMS">
      <Box padding={["7", "10"]}>
        <Breadcrumb
          separator={
            <Box marginBottom="8" fontSize="md">
              <BsChevronRight />
            </Box>
          }
        >
          <BreadcrumbItem>
            <NextLink href="/users" passHref>
              <BreadcrumbLink>
                <Heading as="h1" size="xl" marginBottom="8" color="gray.300">
                  Users
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

        <Formik
          onSubmit={handleSubmit}
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize
        >
          <Tabs variant="unstyled">
            <TabList>
              <CustomTab>PERSONAL</CustomTab>
              <CustomTab>WORK</CustomTab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <UserPersonalForm
                  loading={addLoading || updateLoading}
                  slug={slug as string}
                />
              </TabPanel>
              <TabPanel>
                <UserWorkForm loading={addLoading || updateLoading} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Formik>
      </Box>
    </Layout>
  );
};

export default UsersAction;
