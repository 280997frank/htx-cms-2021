import React, { useMemo, useEffect } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { object } from "yup";
import {
  Box,
  Heading,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";
import { Formik } from "formik";
import { string } from "yup";
import NotificationForm from "@/components/Organisms/NotificationForm";
import { BsChevronRight } from "react-icons/bs";
import Layout from "@/components/Templates/Layout";
import { requiredString } from "@/constants/validationSchema";
import {
  useAddNotification,
  useNotificationDetails,
  useUpdateNotification,
} from "@/hooks/notification";
import {
  INotificationInput,
  INotificationUpdatePayload,
} from "@/types/notification";
import { useUploadFile } from "@/hooks/upload";
import { MediaFolderType } from "@/types/upload";

const emptyValues: INotificationInput = {
  title: "",
  description: "",
  exhibitorId: "",
  url: "",
  sponsorLogoUrl: "",
};

const validationSchema = object({
  title: requiredString,
  exhibitorId: requiredString,
  url: string().url("The value should be valid url.").nullable(),
});

const NotificationAction = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { getNotificationDetail, data } = useNotificationDetails(
    slug as string
  );
  const { addNotification, loading: addLoading } = useAddNotification();
  const { updateNotification, loading: updateLoading } =
    useUpdateNotification();
  const { uploadFile } = useUploadFile();

  useEffect(() => {
    if (slug && slug !== "new") {
      getNotificationDetail();
    }
  }, [slug, getNotificationDetail]);

  const initialValues = useMemo(() => {
    if (slug !== "new" && data) {
      const notificationDetail: any = { ...data.detailNotification };
      delete notificationDetail.exhibitor;
      return {
        ...emptyValues,
        ...notificationDetail,
        exhibitorId: data.detailNotification.exhibitor?.id ?? "N/A",
      };
    } else {
      return emptyValues;
    }
  }, [slug, data]);

  const handleSubmit = async (values: INotificationInput) => {
    let sponsorLogoUrl = "";

    if (values.sponsorLogoUrl instanceof File) {
      // NOTE: upload separately and save the URL
      const uploadResult = await uploadFile({
        variables: {
          uploadFilesInput: {
            file: values.sponsorLogoUrl,
            folder: MediaFolderType.NOTIFICATION,
          },
        },
      });
      sponsorLogoUrl = uploadResult.data?.uploadFile.url || "";
    } else {
      sponsorLogoUrl = values.sponsorLogoUrl;
    }

    if (slug === "new") {
      addNotification({
        variables: {
          addNotificationInput: { ...values, sponsorLogoUrl },
        },
      });
    } else {
      updateNotification({
        variables: {
          editNotificationInput: {
            ...values,
            sponsorLogoUrl,
            id: slug as string,
          },
        },
      });
    }
  };

  return (
    <Layout title="Notification | ZodiacLive CMS">
      <Box padding={["7", "10"]}>
        <Breadcrumb
          separator={
            <Box marginBottom="8" fontSize="md">
              <BsChevronRight />
            </Box>
          }
        >
          <BreadcrumbItem>
            <NextLink href="/notification" passHref>
              <BreadcrumbLink>
                <Heading as="h1" size="xl" marginBottom="8" color="gray.300">
                  Notification
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
          <NotificationForm loading={addLoading || updateLoading} />
        </Formik>
      </Box>
    </Layout>
  );
};

export default NotificationAction;
