import { useLazyQuery, useMutation, gql } from "@apollo/client";
import { useToast } from "@chakra-ui/react";
import { useCallback, useState } from "react";

import { ExportFeedbacks, TExportFeedbacks } from "@/utils/restApi";

import { useErrorMessage } from "@/hooks";
import { TGetsFeedback, IFeedback, IFeedbackParams } from "@/types/feedback";

interface FeedbackInput {
  detailFeedbackInput: {
    id: string;
  };
}

//=========GET FEEDBACK ===
const GET_FeedBack = gql`
  query listFeedback($params: ListFeedbackInput!) {
    listFeedback(listFeedbackInput: $params) {
      page
      limit
      total
      totalPage
      feedbacks {
        id
        feedback
        createdAt
        updatedAt
      }
    }
  }
`;

export const useFeedback = ($pagination: IFeedbackParams) => {
  const [fetchFeedback, { loading, error, data }] = useLazyQuery<TGetsFeedback>(
    GET_FeedBack,
    {
      notifyOnNetworkStatusChange: true,
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
      variables: { params: $pagination },
    }
  );

  useErrorMessage(error);

  return {
    fetchFeedback,
    loading,
    data,
  };
};

//==========MUTATTION FEEDBACK ====
const MUTATTION_DEL_FEEDBACK = gql`
  mutation deleteFeedback($detailFeedbackInput: DetailFeedbackInput!) {
    deleteFeedback(detailFeedbackInput: $detailFeedbackInput) {
      id
      feedback
      createdAt
      updatedAt
    }
  }
`;

export const useMutationFeedback = ($pagination: IFeedbackParams) => {
  const toast = useToast();
  const { fetchFeedback } = useFeedback($pagination);

  const [fetchMutationFeedback, { loading, error, data }] = useMutation<
    IFeedback,
    FeedbackInput
  >(MUTATTION_DEL_FEEDBACK, {
    onCompleted: () => {
      fetchFeedback();
      toast({
        title: "Successfully Deleted",
        position: "bottom",
        isClosable: true,
        status: "success",
      });
    },
  });

  useErrorMessage(error);

  return {
    fetchMutationFeedback,
    loading,
    data,
  };
};

export const useExportFeedbacks = () => {
  const [loading, setLoading] = useState(false);
  const fetchExportFeedbacks = useCallback(
    async (payload: TExportFeedbacks) => {
      setLoading(true);
      const responseExportAnalytics = await ExportFeedbacks(payload);
      setLoading(false);
      return responseExportAnalytics;
    },
    []
  );
  return {
    loading,
    fetchExportFeedbacks,
  };
};
