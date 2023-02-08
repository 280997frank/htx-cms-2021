import { FC, useMemo, useCallback, useEffect } from "react";
import Head from "next/head";
import { Formik } from "formik";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  Heading,
  VStack,
  Breadcrumb,
  BreadcrumbItem,
  Box,
} from "@chakra-ui/react";
import { boolean, object, string } from "yup";
import { BsChevronRight } from "react-icons/bs";
import { useUploadFile, useUploadMultipleFile } from "@/hooks/upload";

import Layout from "@/components/Templates/Layout";
import AboutEventForm from "@/components/Organisms/AboutEventForm";

import {
  requiredString,
  requiredNumber,
  requiredFile,
} from "@/constants/validationSchema";

import withAuth from "@/utils/withAuth";

import {
  AboutEventInitialValues,
  AboutEventDetail,
  AboutEventEditValues,
} from "@/types/aboutEvent";
import { MediaFolderType } from "@/types/upload";

import { aboutEventInitialValues } from "@/constants/form";
import { useAboutEventDetail, useAboutEventUpdate } from "@/hooks/aboutEvent";

dayjs.extend(customParseFormat);

const formatToInitialValues = (
  values?: AboutEventDetail
): AboutEventInitialValues => {
  if (values) {
    return {
      id: values.getAboutEvent.id,
      eventDescription: values.getAboutEvent.eventDescription,
      logo: values.getAboutEvent.logo,
      socialFacebook: values.getAboutEvent.socialFacebook,
      socialFacebookActive: values.getAboutEvent.socialFacebookActive,
      socialLinkedin: values.getAboutEvent.socialLinkedin,
      socialLinkedinActive: values.getAboutEvent.socialLinkedinActive,
      socialTwitter: values.getAboutEvent.socialTwitter,
      socialTwitterActive: values.getAboutEvent.socialTwitterActive,
      eventStart: dayjs(values.getAboutEvent.eventStart).format("DD/MM/YYYY"),
      eventStartTime: dayjs(values.getAboutEvent.eventStart).format("HH:mm"),
      eventStartZone: values.getAboutEvent.eventStartZone,
      eventEnd: dayjs(values.getAboutEvent.eventEnd).format("DD/MM/YYYY"),
      eventEndTime: dayjs(values.getAboutEvent.eventEnd).format("HH:mm"),
      eventEndZone: values.getAboutEvent.eventEndZone,
      eventStartZoneName: values.getAboutEvent.eventStartZoneName,
      eventEndZoneName: values.getAboutEvent.eventEndZoneName,
    };
  }

  return aboutEventInitialValues;
};

const validationSchema = object({
  id: requiredString,
  eventDescription: requiredString,
  logo: requiredFile,
  socialFacebook: string().when("socialFacebookActive", {
    is: (isActive: boolean) => isActive,
    then: requiredString.url("Invalid URL"),
    otherwise: string(),
  }),
  socialFacebookActive: boolean(),
  socialLinkedin: string().when("socialLinkedinActive", {
    is: (isActive: boolean) => isActive,
    then: requiredString.url("Invalid URL"),
    otherwise: string(),
  }),
  socialLinkedinActive: boolean(),
  socialTwitter: string().when("socialTwitterActive", {
    is: (isActive: boolean) => isActive,
    then: requiredString.url("Invalid URL"),
    otherwise: string(),
  }),
  socialTwitterActive: boolean(),
  eventStart: requiredString,
  eventStartTime: requiredString,
  eventStartZone: requiredNumber,
  eventEnd: requiredString,
  eventEndTime: requiredString,
  eventEndZone: requiredNumber,
  eventStartZoneName: requiredString,
  eventEndZoneName: requiredString,
});

const AboutEvent: FC = () => {
  const {
    fetchAboutEventDetail,
    loading: isFetchingAboutEvent,
    data: aboutDetail,
  } = useAboutEventDetail();

  const {
    updateAboutEventDetail,
    loading: isUpdatingAboutEvent,
    data: aboutEventUpdateResponse,
  } = useAboutEventUpdate();

  const { uploadFile } = useUploadFile();

  const {
    uploadMultipleFile,
    data: multipleUploadResponse,
    loading: isUploadingMultipleFile,
  } = useUploadMultipleFile();

  const initialValues = useMemo(() => {
    return formatToInitialValues(aboutDetail);
  }, [aboutDetail]);

  const submitForm = useCallback(
    async (values: AboutEventEditValues) => {
      let logo = "";

      if (values.logo instanceof File) {
        // NOTE: upload separately and save the URL
        const uploadResult = await uploadFile({
          variables: {
            uploadFilesInput: {
              file: values.logo,
              folder: MediaFolderType.ABOUT_EVENT,
            },
          },
        });

        logo = uploadResult.data?.uploadFile.url || "";
      } else {
        logo = values.logo;
      }
      await updateAboutEventDetail({
        variables: {
          updateAboutEventInput: {
            id: values.id,
            logo,
            eventDescription: values.eventDescription,
            socialFacebook: values.socialFacebook,
            socialFacebookActive: values.socialFacebookActive,
            socialLinkedin: values.socialLinkedin,
            socialLinkedinActive: values.socialLinkedinActive,
            socialTwitter: values.socialTwitter,
            socialTwitterActive: values.socialTwitterActive,
            eventStart: dayjs(
              `${values.eventStart}/${values.eventStartTime}`,
              "DD/MM/YYYY/HH:mm"
            ).format("YYYY-MM-DDTHH:mm+07:ss"),
            eventStartZone: parseInt(values.eventStartZone as any),
            eventEnd: dayjs(
              `${values.eventEnd}/${values.eventEndTime}`,
              "DD/MM/YYYY/HH:mm"
            ).format("YYYY-MM-DDTHH:mm+07:ss"),
            eventEndZone: parseInt(values.eventEndZone as any),
            eventStartZoneName: values.eventStartZoneName,
            eventEndZoneName: values.eventEndZoneName,
          },
        },
      });
    },
    [updateAboutEventDetail, uploadFile]
  );

  useEffect(() => {
    fetchAboutEventDetail();
  }, [fetchAboutEventDetail]);
  return (
    <>
      <Head>
        <title>About Event | ZodiacLive CMS</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout title="About Event | ZodiacLive CMS">
        <VStack align="flex-start" minHeight="100vh" padding={["7", "10"]}>
          <Breadcrumb
            separator={
              <Box marginBottom="8" fontSize="md">
                <BsChevronRight />
              </Box>
            }
          >
            <BreadcrumbItem>
              <Heading as="h1" size="xl" marginBottom="8">
                About Event
              </Heading>
            </BreadcrumbItem>
          </Breadcrumb>
          <Formik
            enableReinitialize
            validationSchema={validationSchema}
            initialValues={initialValues}
            onSubmit={submitForm}
            component={AboutEventForm}
          />
        </VStack>
      </Layout>
    </>
  );
};

export default withAuth(AboutEvent);
