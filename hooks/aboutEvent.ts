import { useLazyQuery, useMutation, gql } from "@apollo/client";
import { useToast } from "@chakra-ui/react";

import { useErrorMessage } from "@/hooks";

import { AboutEventDetail } from "@/types/aboutEvent";

interface AboutUpdateResponse {
  status: boolean;
}

interface AboutInput {
  updateAboutEventInput: {
    id: string;
    logo: string | File;
    eventDescription: string;
    socialFacebook: string;
    socialFacebookActive: boolean;
    socialLinkedin: string;
    socialLinkedinActive: boolean;
    socialTwitter: string;
    socialTwitterActive: boolean;
    eventStart: string;
    eventStartZone: number;
    eventStartZoneName: string;
    eventEnd: string;
    eventEndZone: number;
    eventEndZoneName: string;
  };
}

const GET_ABOUT_EVENT_DETAIL = gql`
  query {
    getAboutEvent {
      id
      logo
      eventDescription
      socialFacebook
      socialFacebookActive
      socialLinkedin
      socialLinkedinActive
      socialTwitter
      socialTwitterActive
      eventStart
      eventStartZone
      eventEnd
      eventEndZone
      eventEndZoneName
      eventStartZoneName
    }
  }
`;

const UPDATE_ABOUT_EVENT_DETAIL = gql`
  mutation saveAboutEvent($updateAboutEventInput: UpdateAboutEventInput!) {
    saveAboutEvent(updateAboutEventInput: $updateAboutEventInput) {
      id
    }
  }
`;

export const useAboutEventDetail = () => {
  const [fetchAboutEventDetail, { loading, error, data }] =
    useLazyQuery<AboutEventDetail>(GET_ABOUT_EVENT_DETAIL, {
      notifyOnNetworkStatusChange: true,
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
    });

  useErrorMessage(error);

  return {
    fetchAboutEventDetail,
    loading,
    data,
  };
};

export const useAboutEventUpdate = () => {
  const toast = useToast();
  const [updateAboutEventDetail, { loading, error, data }] = useMutation<
    AboutUpdateResponse,
    AboutInput
  >(UPDATE_ABOUT_EVENT_DETAIL, {
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
    updateAboutEventDetail,
    loading,
    data,
  };
};
