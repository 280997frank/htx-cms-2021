import { useLazyQuery, useMutation, gql } from "@apollo/client";
import { useToast } from "@chakra-ui/react";

import { useErrorMessage } from "@/hooks";

import { LobbyDetail, Hotspot } from "@/types/lobby";

interface LobbyUpdateResponse {
  status: boolean;
}

interface LobbyInput {
  setLobbyInput: {
    lobbyMediaUrl: string;
    mimeType: string;
    intercomAppId: string;
    intercomSecretVerificationId: string;
    sidebarMenus: Array<{
      id: string;
      isActive: boolean;
    }>;
  };
}

interface HotspotsInput {
  setHotspotInput: {
    hotspots: Hotspot[];
  };
}

const GET_LOBBY_DETAIL = gql`
  query {
    getLobby {
      id
      lobbyMedia
      mimeType
      intercomAppId
      intercomSecretVerificationId
      sidebarMenus {
        id
        icon
        name
        url
        isActive
      }
      hotspots {
        sequence
        x
        y
        width
        height
        hotspotType
        bannerMediaUrl
        url
        title
        mimeType
      }
    }
  }
`;

const UPDATE_LOBBY_DETAIL = gql`
  mutation updateLobbyDetail($setLobbyInput: SetLobbyInput!) {
    setLobby(setLobbyInput: $setLobbyInput) {
      status
    }
  }
`;

const UPDATE_HOTSPOTS = gql`
  mutation updateHotspots($setHotspotInput: SetHotspotInput!) {
    setHotspot(setHotspotInput: $setHotspotInput) {
      status
    }
  }
`;

export const useLobbyDetail = () => {
  const [fetchLobbyDetail, { loading, error, data }] =
    useLazyQuery<LobbyDetail>(GET_LOBBY_DETAIL, {
      notifyOnNetworkStatusChange: true,
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
    });

  useErrorMessage(error);

  return {
    fetchLobbyDetail,
    loading,
    data,
  };
};

export const useLobbyUpdate = () => {
  const toast = useToast();
  const [updateLobbyDetail, { loading, error, data }] = useMutation<
    LobbyUpdateResponse,
    LobbyInput
  >(UPDATE_LOBBY_DETAIL, {
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
    updateLobbyDetail,
    loading,
    data,
  };
};

export const useHotspotUpdate = () => {
  const toast = useToast();
  const [updateHotspots, { loading, error, data }] = useMutation<
    LobbyUpdateResponse,
    HotspotsInput
  >(UPDATE_HOTSPOTS, {
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
    updateHotspots,
    loading,
    data,
  };
};
