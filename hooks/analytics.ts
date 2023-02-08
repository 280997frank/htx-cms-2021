import { ExportAnalytics, TExportAnalytics } from "@/utils/restApi";
import { useLazyQuery, useMutation, gql } from "@apollo/client";
import { useToast } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { TGetAnalyticsResponse, TParamsGetAnalytics } from "types/analytics";
const GET_ANALYTICS = gql`
  query getAnalytics($filter: FilterAnalyticsInput) {
    whatsUp: getAnalytics(analyticsInput: { type: WHATS_UP, filter: $filter }) {
      type
      total
    }
    inProfile: getAnalytics(
      analyticsInput: { type: IN_PROFILE, filter: $filter }
    ) {
      type
      total
    }
    congrats: getAnalytics(
      analyticsInput: { type: CONGRATS, filter: $filter }
    ) {
      type
      total
    }
    hbd: getAnalytics(
      analyticsInput: { type: HAPPY_BIRTHDAY, filter: $filter }
    ) {
      type
      total
    }
    announcement: getAnalytics(
      analyticsInput: { type: ANNOUNCEMENT, filter: $filter }
    ) {
      type
      total
    }
    spotlight: getAnalytics(
      analyticsInput: { type: SPOTLIGHT, filter: $filter }
    ) {
      type
      total
    }
    groupBuy: getAnalytics(
      analyticsInput: { type: GROUP_BUY, filter: $filter }
    ) {
      type
      total
    }
    pickYourChoice: getAnalytics(
      analyticsInput: { type: PICK_YOUR_CHOICE, filter: $filter }
    ) {
      type
      total
    }
    techxchange: getAnalytics(
      analyticsInput: { type: TECHXCHANGE, filter: $filter }
    ) {
      type
      total
    }
    hlsCommittee: getAnalytics(
      analyticsInput: { type: HLS_COMMITTEE, filter: $filter }
    ) {
      type
      total
    }
    eventHighlights: getAnalytics(
      analyticsInput: { type: EVENT_HIGHLIGHTS, filter: $filter }
    ) {
      type
      total
    }
    htxHouses: getAnalytics(
      analyticsInput: { type: HTX_HOUSES, filter: $filter }
    ) {
      type
      total
    }
    techxplain: getAnalytics(
      analyticsInput: { type: TECHXPLAIN, filter: $filter }
    ) {
      type
      total
    }
    feedback: getAnalytics(
      analyticsInput: { type: FEEDBACK, filter: $filter }
    ) {
      type
      total
    }
    cardAndWishes: getAnalytics(
      analyticsInput: { type: CARD_AND_WISHES, filter: $filter }
    ) {
      type
      total
    }
    cardSent: getAnalytics(
      analyticsInput: { type: CARD_SENT, filter: $filter }
    ) {
      type
      total
    }
    bejeweled: getAnalytics(
      analyticsInput: { type: BEJEWELED, filter: $filter }
    ) {
      type
      total
    }
    dronePatrol: getAnalytics(
      analyticsInput: { type: DRONE_PATROL, filter: $filter }
    ) {
      type
      total
    }
    fruitNinja: getAnalytics(
      analyticsInput: { type: FRUIT_NINJA, filter: $filter }
    ) {
      type
      total
    }
  }
`;

export const useAnalytics = (body: TParamsGetAnalytics) => {
  const toast = useToast();
  const [fetchAnalytics, { loading, data }] =
    useLazyQuery<TGetAnalyticsResponse>(GET_ANALYTICS, {
      notifyOnNetworkStatusChange: true,
      variables: body,
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
      onError: (error) => {
        toast({
          title: error.message,
          position: "bottom",
          isClosable: true,
          status: "error",
        });
      },
    });

  // useErrorMessage(error);

  return {
    fetchAnalytics,
    loading,
    data,
  };
};

export const useExportAnalytics = () => {
  const [loading, setLoading] = useState(false);
  const fetchExportAnalytics = useCallback(
    async (payload: TExportAnalytics) => {
      setLoading(true);
      const responseExportAnalytics = await ExportAnalytics(payload);
      setLoading(false);
      return responseExportAnalytics;
    },
    []
  );
  return {
    loading,
    fetchExportAnalytics,
  };
};
