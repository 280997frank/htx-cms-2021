import { useLazyQuery, useMutation, gql } from "@apollo/client";
import { useToast } from "@chakra-ui/react";

import { useErrorMessage } from "@/hooks";

import { LandingPage, LandingPageInput } from "@/types/landingPage";

interface FetchedLandingPageDetail {
  getLandingPage: LandingPage;
}

interface UpdateLandingPageInput {
  landingPageInput: LandingPageInput;
}

interface LandingPageResponse {
  id: string;
}

const GET_LANDING_PAGE_DETAIL = gql`
  query getLandingPageDetail {
    getLandingPage {
      id
      eventTitle
      emailConfigHost
      emailConfigPort
      emailConfigUser
      emailConfigPassword
      registrationUrl
      otpEmailHeader
      otpEmailBody
      forgotEmailHeader
      forgotEmailBody
      otpEmailActive
      otpSMSActive
      heroImageUrl
    }
  }
`;

const UPDATE_LANDING_PAGE_DETAIL = gql`
  mutation updateLandingPageDetail($landingPageInput: UpdateLandingPageInput!) {
    saveLandingPage(updateAboutEventInput: $landingPageInput) {
      id
    }
  }
`;

export const useLandingPageDetail = () => {
  const [fetchLandingPageDetail, { loading, error, data }] =
    useLazyQuery<FetchedLandingPageDetail>(GET_LANDING_PAGE_DETAIL, {
      notifyOnNetworkStatusChange: true,
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
    });

  useErrorMessage(error);

  return {
    fetchLandingPageDetail,
    loading,
    data,
  };
};

export const useLandingPageUpdate = () => {
  const toast = useToast();
  const [updateLandingPageDetail, { loading, error, data }] = useMutation<
    LandingPageResponse,
    UpdateLandingPageInput
  >(UPDATE_LANDING_PAGE_DETAIL, {
    onCompleted: () => {
      toast({
        title: "Successfully Updated",
        position: "bottom",
        isClosable: true,
        status: "success",
      });
    },
  });

  useErrorMessage(error);

  return {
    updateLandingPageDetail,
    loading,
    data,
  };
};
