import { useLazyQuery, useMutation, gql } from "@apollo/client";
import { useToast } from "@chakra-ui/react";
import {
  TParamsGetHtxHouses,
  THtxHousesResponse,
  PublishHTXHousesResponse,
  setPublishHTXHouses,
  THtxHousesDetailResponse,
  CustomizeHTXHousesResponse,
  CustomizeHTXHouses,
  TParamsGetHtxHousesChat,
  THtxHousesResponseChat,
  ThtxHouseChats,
  ADDHTXHouseChatResponse,
  PayloadAddHTXHouseChat,
  PayloadDeleteHTXHouseChat,
  PayloadEditHTXHouseChat,
  EditHTXHouseChatResponse,
  DeleteHTXHouseChatResponse,
} from "@/types/htxHouses";
import { useState } from "react";
import { isNil } from "lodash";
//=========GET List HTX Houses===
const GET_LIST_HTX_HOUSES = gql`
  query listHtxHouse($listHtxHouseInput: ListHtxHouseInput!) {
    listHtxHouse(listHtxHouseInput: $listHtxHouseInput) {
      page
      limit
      total
      totalPage
      htxHouses {
        id
        name
        point
        isActive
        createdAt
        updatedAt
        htxHouseChats {
          id
          message
          createdAt
          updatedAt
        }
      }
    }
  }
`;

export const useListHtxHouses = (body: TParamsGetHtxHouses) => {
  const toast = useToast();
  const [fetchListHtxHouses, { loading, data }] =
    useLazyQuery<THtxHousesResponse>(GET_LIST_HTX_HOUSES, {
      notifyOnNetworkStatusChange: true,
      errorPolicy: "all",
      variables: body,
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
    fetchListHtxHouses,
    loading,
    responseListHtx: data,
  };
};

const PUBLISH_HTX_HOUSES = gql`
  mutation publishHtxHouse($publishHtxHouseInput: PublishHtxHouseInput!) {
    publishHtxHouse(publishHtxHouseInput: $publishHtxHouseInput) {
      id
      name
      point
    }
  }
`;

export const useSetPublishHTXHouses = () => {
  const toast = useToast();

  const [fetchSetPublishHTXHouses, { loading, data }] = useMutation<
    PublishHTXHousesResponse,
    setPublishHTXHouses
  >(PUBLISH_HTX_HOUSES, {
    onError: (error) => {
      toast({
        title: error.message,
        position: "bottom",
        isClosable: true,
        status: "error",
      });
    },
    onCompleted: () => {
      toast({
        title: "Successfully Updated",
        position: "bottom",
        isClosable: true,
        status: "success",
      });
    },
  });

  // useErrorMessage(error);

  return {
    fetchSetPublishHTXHouses,
    loading,
    responsePublishHTXHouse: data,
  };
};

const GET_HTX_HOUSES_BY_ID = gql`
  query listHtxHouse($id: String!) {
    detailHtxHouse(id: $id) {
      id
      name
      point
      isActive
      createdAt
      updatedAt
      htxHouseChats {
        id
        message
        createdAt
        updatedAt
      }
    }
  }
`;
interface TID {
  id: string;
}
export const useHtxHousesByID = (body: TID) => {
  const toast = useToast();
  const [fetchHtxHousesByID, { loading, data }] =
    useLazyQuery<THtxHousesDetailResponse>(GET_HTX_HOUSES_BY_ID, {
      notifyOnNetworkStatusChange: true,
      errorPolicy: "all",
      variables: body,
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
    fetchHtxHousesByID,
    loading,
    responseHtxDetail: data,
  };
};

const CUSTOMIZE_HTX_HOUSES = gql`
  mutation customizeHtxHouse($customizeHtxHouseInput: CustomizeHtxHouseInput!) {
    customizeHtxHouse(customizeHtxHouseInput: $customizeHtxHouseInput) {
      id
      name
      point
      isActive
    }
  }
`;

export const useSetCustomizeHTXHouses = () => {
  const toast = useToast();

  const [fetchCustomizeHTXHouses, { loading, data }] = useMutation<
    CustomizeHTXHousesResponse,
    CustomizeHTXHouses
  >(CUSTOMIZE_HTX_HOUSES, {
    onError: (error) => {
      toast({
        title: error.message,
        position: "bottom",
        isClosable: true,
        status: "error",
      });
    },
    onCompleted: () => {
      toast({
        title: "Successfully Updated",
        position: "bottom",
        isClosable: true,
        status: "success",
      });
    },
  });

  // useErrorMessage(error);

  return {
    fetchCustomizeHTXHouses,
    loading,
    responseCustomizeHTXHouse: data,
  };
};

const GET_LIST_HTX_HOUSES_CHAT = gql`
  query listHtxHouseChat($listHtxHouseChatInput: ListHtxHouseChatInput!) {
    listHtxHouseChat(listHtxHouseChatInput: $listHtxHouseChatInput) {
      page
      limit
      total
      totalPage
      htxHouseChats {
        id
        message
        createdAt
        updatedAt
        user {
          name
        }
        htxHouse {
          id
          name
          point
          isActive
          createdAt
          updatedAt
        }
      }
    }
  }
`;

export const useListHtxHousesChat = (body: TParamsGetHtxHousesChat) => {
  const toast = useToast();
  const [newData, setNewData] = useState<ThtxHouseChats[]>([]);
  const [fetchListHtxHousesChat, { loading, data }] =
    useLazyQuery<THtxHousesResponseChat>(GET_LIST_HTX_HOUSES_CHAT, {
      notifyOnNetworkStatusChange: true,
      errorPolicy: "all",
      variables: body,
      fetchPolicy: "cache-and-network",
      onError: (error) => {
        toast({
          title: error.message,
          position: "bottom",
          isClosable: true,
          status: "error",
        });
      },
      onCompleted: (data) => {
        if (
          !isNil(data) &&
          !isNil(data.listHtxHouseChat) &&
          !isNil(data.listHtxHouseChat.htxHouseChats)
        ) {
          if (body.listHtxHouseChatInput.page === 1) {
            setNewData(data.listHtxHouseChat.htxHouseChats);
          } else {
            setNewData((newData) => [
              ...newData,
              ...data.listHtxHouseChat.htxHouseChats,
            ]);
          }
        }
      },
    });

  // useErrorMessage(error);

  return {
    fetchListHtxHousesChat,
    loadingChat: loading,
    responseListHtxChat: newData,
    totalPageChat: data?.listHtxHouseChat.totalPage,
  };
};

const ADD_HTX_HOUSES_CHAT = gql`
  mutation addHtxHouseChat($addHtxHouseChatInput: AddHtxHouseChatInput!) {
    addHtxHouseChat(addHtxHouseChatInput: $addHtxHouseChatInput) {
      id
      message
      createdAt
      updatedAt
      htxHouse {
        id
        name
        point
        isActive
        createdAt
        updatedAt
      }
    }
  }
`;

export const useSetHTXHouseChat = () => {
  const toast = useToast();

  const [fetchSetHTXHouseChat, { loading, data }] = useMutation<
    ADDHTXHouseChatResponse,
    PayloadAddHTXHouseChat
  >(ADD_HTX_HOUSES_CHAT, {
    onError: (error) => {
      toast({
        title: error.message,
        position: "bottom",
        isClosable: true,
        status: "error",
      });
    },
    onCompleted: () => {
      toast({
        title: "Successfully Updated",
        position: "bottom",
        isClosable: true,
        status: "success",
      });
    },
  });

  // useErrorMessage(error);

  return {
    fetchSetHTXHouseChat,
    loading,
    responseHTXHouseChat: data,
  };
};

const DELETE_HTX_HOUSES_CHAT = gql`
  mutation deleteHtxHouseChat($id: String!) {
    deleteHtxHouseChat(id: $id) {
      id
    }
  }
`;

export const useDeleteHTXHouseChat = () => {
  const toast = useToast();

  const [fetchDeleteHTXHouseChat, { loading, data }] = useMutation<
    DeleteHTXHouseChatResponse,
    PayloadDeleteHTXHouseChat
  >(DELETE_HTX_HOUSES_CHAT, {
    onError: (error) => {
      toast({
        title: error.message,
        position: "bottom",
        isClosable: true,
        status: "error",
      });
    },
    onCompleted: () => {
      toast({
        title: "Successfully Deleted",
        position: "bottom",
        isClosable: true,
        status: "success",
      });
    },
  });

  // useErrorMessage(error);

  return {
    fetchDeleteHTXHouseChat,
    loading,
    responseHTXHouseChatDel: data,
  };
};

const EDIT_HTX_HOUSES_CHAT = gql`
  mutation editHtxHouseChat($editHtxHouseChatInput: EditHtxHouseChatInput!) {
    editHtxHouseChat(editHtxHouseChatInput: $editHtxHouseChatInput) {
      id
      message
    }
  }
`;

export const useEditHTXHouseChat = () => {
  const toast = useToast();

  const [fetchEditHTXHouseChat, { loading, data }] = useMutation<
    EditHTXHouseChatResponse,
    PayloadEditHTXHouseChat
  >(EDIT_HTX_HOUSES_CHAT, {
    onError: (error) => {
      toast({
        title: error.message,
        position: "bottom",
        isClosable: true,
        status: "error",
      });
    },
    onCompleted: () => {
      toast({
        title: "Successfully Updated",
        position: "bottom",
        isClosable: true,
        status: "success",
      });
    },
  });

  // useErrorMessage(error);

  return {
    fetchEditHTXHouseChat,
    loading,
    responseHTXHouseChatEdit: data,
  };
};
