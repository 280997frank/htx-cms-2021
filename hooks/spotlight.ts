import { useErrorMessage } from "@/hooks";
import {
  DeleteSpotlightArg,
  DeleteSpotlightResponse,
  InsertSpotlightArg,
  InsertSpotlightResponse,
  PublishSpotlightArg,
  PublishSpotlightResponse,
  TSpotlightTable,
  UpdateSpotlightArgs,
  UpdateSpotlightResponse,
} from "@/types/spotlight";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";

// =============== LIST ===============
export const useSpotlightPageList = (
  page: number,
  search: string,
  limit: number
) => {
  const GET_SPOTLIGHT_LIST = gql`
    query listSpotlights($listSpotlightsInput: ListSpotlightsInput!) {
      listSpotlights(listSpotlightsInput: $listSpotlightsInput) {
        page
        limit
        total
        totalPage
        spotlights {
          id
          active
          title
        }
      }
    }
  `;
  interface FetchedSpotlightList {
    listSpotlights: {
      page: number;
      limit: number;
      total: number;
      totalPage: number;
      spotlights: TSpotlightTable[];
    };
  }
  const [fetchSpotlightList, { loading, error, data }] =
    useLazyQuery<FetchedSpotlightList>(GET_SPOTLIGHT_LIST, {
      notifyOnNetworkStatusChange: true,
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
      nextFetchPolicy: "cache-first",
      variables: {
        listSpotlightsInput: {
          page: page,
          limit: limit,
          search: {
            keyword: search,
          },
          order: {
            orderBy: "CREATED_AT",
            sortBy: "DESC",
          },
        },
      },
    });

  useErrorMessage(error);

  return {
    fetchSpotlightList,
    loading,
    data,
  };
};

// =============== GET BY ID ===============
export const useSpotlightPageGetById = (id: string) => {
  const GET_SPOTLIGHT_BY_ID = gql`
    query getSpotlightById($id: String!) {
      getSpotlightById(id: $id) {
        id
        title
        description
        thumbnailUrl
      }
    }
  `;

  interface FetchedSpotlightById {
    getSpotlightById: {
      id: string;
      title: string;
      description: string;
      thumbnailUrl: string;
    };
  }

  const [fetchSpotlightById, { loading, error, data }] =
    useLazyQuery<FetchedSpotlightById>(GET_SPOTLIGHT_BY_ID, {
      notifyOnNetworkStatusChange: true,
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
      variables: {
        id: id,
      },
    });

  useErrorMessage(error);

  return {
    fetchSpotlightById,
    loading,
    data,
  };
};

//========== INSERT MUTATION ==========
export const useSpotlightInsert = () => {
  const MUTATION_SPOTLIGHT_INSERT = gql`
    mutation addSpotlight($addSpotlightInput: AddSpotlightInput!) {
      addSpotlight(addSpotlightInput: $addSpotlightInput) {
        id
      }
    }
  `;
  const toast = useToast();
  const router = useRouter();

  const [mutationAddSpotlight, { loading, error, data }] = useMutation<
    InsertSpotlightResponse,
    InsertSpotlightArg
  >(MUTATION_SPOTLIGHT_INSERT, {
    onCompleted: () => {
      toast({
        title: "Successfully Inserted",
        position: "bottom",
        isClosable: true,
        status: "success",
      });
      router.push("/spotlight");
    },
  });

  useErrorMessage(error);

  return {
    mutationAddSpotlight,
    loading,
    data,
  };
};

//========== UPDATE MUTATION ==========
export const useSpotlightUpdate = () => {
  const toast = useToast();
  const router = useRouter();
  const MUTATION_SPOTLIGHT_UPDATE = gql`
    mutation editSession($editSpotlightInput: EditSpotlightInput!) {
      editSpotlight(editSpotlightInput: $editSpotlightInput) {
        id
      }
    }
  `;

  const [mutationEditSpotlight, { loading, error, data }] = useMutation<
    UpdateSpotlightResponse,
    UpdateSpotlightArgs
  >(MUTATION_SPOTLIGHT_UPDATE, {
    onCompleted: () => {
      toast({
        title: "Successfully Updated",
        position: "bottom",
        isClosable: true,
        status: "success",
      });
      router.push("/spotlight");
    },
  });

  useErrorMessage(error);

  return {
    mutationEditSpotlight,
    loading,
    data,
  };
};

//==========DELETE ============
export const useDelete = (page: number, search: string, limit: number) => {
  const DELETE_SPOTLIGHT = gql`
    mutation removeSpotlight($removeSpotlightInput: RemoveSpotlightInput!) {
      removeSpotlight(removeSpotlightInput: $removeSpotlightInput) {
        status
      }
    }
  `;

  const { fetchSpotlightList } = useSpotlightPageList(page, search, limit);
  const toast = useToast();

  const [mutationDelete, { loading, error, data }] = useMutation<
    DeleteSpotlightResponse,
    DeleteSpotlightArg
  >(DELETE_SPOTLIGHT, {
    onCompleted: () => {
      fetchSpotlightList();
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
    mutationDelete,
    loading,
    data,
  };
};

//==========PUBLISH SESSION ==========
export const usePublish = (page: number, search: string, limit: number) => {
  const PUBLISH_SPOTLIGHT = gql`
    mutation toggleStatusSpotlight(
      $toggleStatusSpotlightInput: ToggleStatusSpotlightInput!
    ) {
      toggleStatusSpotlight(
        toggleStatusSpotlightInput: $toggleStatusSpotlightInput
      ) {
        id
      }
    }
  `;

  const { fetchSpotlightList } = useSpotlightPageList(page, search, limit);
  const toast = useToast();

  const [mutationPublish, { loading, error, data }] = useMutation<
    PublishSpotlightResponse,
    PublishSpotlightArg
  >(PUBLISH_SPOTLIGHT, {
    onCompleted: () => {
      fetchSpotlightList();
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
    mutationPublish,
    loading,
    data,
  };
};
