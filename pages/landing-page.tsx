import { FC, useEffect, useMemo, useCallback } from "react";
import { Formik } from "formik";
import { Heading, VStack } from "@chakra-ui/react";
import { object, boolean, number } from "yup";

import Layout from "@/components/Templates/Layout";
import LandingPageForm from "@/components/Organisms/LandingPageForm";

import {
  useLandingPageDetail,
  useLandingPageUpdate,
} from "@/hooks/landingPage";
import { useUploadFile } from "@/hooks/upload";

import { LandingPageInput } from "@/types/landingPage";
import { MediaFolderType } from "@/types/upload";

import { landingPageInitialValues } from "@/constants/form";
import {
  requiredString,
  requiredFile,
  requiredNumber,
} from "@/constants/validationSchema";
import withAuth from "@/utils/withAuth";

const validationSchema = object({
  eventTitle: requiredString,
  emailConfigHost: requiredString,
  emailConfigPort: requiredNumber,
  emailConfigUser: requiredString,
  emailConfigPassword: requiredString,
  registrationUrl: requiredString.url("Invalid URL"),
  otpEmailHeader: requiredString,
  otpEmailBody: requiredString,
  forgotEmailHeader: requiredString,
  forgotEmailBody: requiredString,
  otpEmailActive: boolean(),
  otpSMSActive: boolean(),
  heroImageUrl: requiredFile,
});

const LandingPage: FC = () => {
  const {
    fetchLandingPageDetail,
    loading: isFetchingLandingPage,
    data: landingPageDetail,
  } = useLandingPageDetail();

  const {
    updateLandingPageDetail,
    loading: isUpdatingLandingPage,
    data: landingPageResponse,
  } = useLandingPageUpdate();

  const { uploadFile } = useUploadFile();

  const submitForm = useCallback(
    async (values: LandingPageInput) => {
      let heroImageUrl = "";

      if (values.heroImageUrl instanceof File) {
        // NOTE: upload separately and save the URL
        const uploadResult = await uploadFile({
          variables: {
            uploadFilesInput: {
              file: values.heroImageUrl,
              folder: MediaFolderType.LANDING_PAGE,
            },
          },
        });

        heroImageUrl = uploadResult.data?.uploadFile.url || "";
      } else {
        heroImageUrl = values.heroImageUrl;
      }

      await updateLandingPageDetail({
        variables: {
          landingPageInput: {
            id: values.id,
            eventTitle: values.eventTitle,
            emailConfigHost: values.emailConfigHost,
            emailConfigUser: values.emailConfigUser,
            emailConfigPassword: values.emailConfigPassword,
            registrationUrl: values.registrationUrl,
            otpEmailHeader: values.otpEmailHeader,
            otpEmailBody: values.otpEmailBody,
            forgotEmailHeader: values.forgotEmailHeader,
            forgotEmailBody: values.forgotEmailBody,
            otpEmailActive: values.otpEmailActive,
            otpSMSActive: values.otpSMSActive,
            emailConfigPort: Number(values.emailConfigPort),
            heroImageUrl,
          },
        },
      });
    },
    [updateLandingPageDetail, uploadFile]
  );

  useEffect(() => {
    fetchLandingPageDetail();
  }, [fetchLandingPageDetail]);

  return (
    <Layout title="Landing Page | ZodiacLive CMS">
      <VStack align="flex-start" minHeight="100vh" padding={["7", "10"]}>
        <Heading as="h1" size="xl" marginBottom="8">
          Landing Page
        </Heading>
        <Formik
          enableReinitialize
          initialValues={
            landingPageDetail
              ? landingPageDetail.getLandingPage
              : landingPageInitialValues
          }
          validationSchema={validationSchema}
          onSubmit={submitForm}
          component={LandingPageForm}
        />
      </VStack>
    </Layout>
  );
};

export default withAuth(LandingPage);
