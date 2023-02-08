import { useLazyQuery, useMutation, gql } from "@apollo/client";

import { useErrorMessage } from "@/hooks";

import { AgoraRole } from "@/types/liveFeed";

interface GetAgoraTokenParams {
  getAgoraTokenInput: {
    channelName: string;
    role: AgoraRole;
  };
}

interface FetchedAgoraToken {
  getAgoraToken: string;
}

const GET_AGORA_TOKEN = gql`
  query getAgoraToken($getAgoraTokenInput: GetAgoraTokenInput!) {
    getAgoraToken(getAgoraTokenInput: $getAgoraTokenInput)
  }
`;

export const useAgoraToken = () => {
  const [fetchAgoraToken, { data, loading, error }] = useLazyQuery<
    FetchedAgoraToken,
    GetAgoraTokenParams
  >(GET_AGORA_TOKEN, {
    notifyOnNetworkStatusChange: true,
    errorPolicy: "all",
    fetchPolicy: "network-only",
  });

  useErrorMessage(error);

  return {
    fetchAgoraToken,
    loading,
    data,
  };
};
