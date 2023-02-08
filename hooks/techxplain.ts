import { useErrorMessage } from "@/hooks";
import {
  DeleteTechxplainArg,
  DeleteTechxplainResponse,
  InsertTechxplainArg,
  InsertTechxplainResponse,
  PublishTechxplainArg,
  PublishTechxplainResponse,
  TTechxplainTable,
  UpdateTechxplainArg,
  UpdateTechxplainResponse,
} from "@/types/techxplain";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";

// ======= LIST =========
export const useTechxplainPageList = (
  page: number,
  search: string,
  limit: number
) => {
  const GET_TECHXPLAIN_LIST = gql`
    query listTechxplain($listTechxplainInput: ListTechxplainInput!) {
      listTechxplain(listTechxplainInput: $listTechxplainInput) {
        limit
        page
        total
        totalPage
        techxplains {
          id
          title
          active
          createdAt
        }
      }
    }
  `;

  interface FetchedTechxplainList {
    listTechxplain: {
      page: number;
      limit: number;
      total: number;
      totalPage: number;
      techxplains: TTechxplainTable[];
    };
  }
  const [fetchTechxplainList, { loading, error, data }] =
    useLazyQuery<FetchedTechxplainList>(GET_TECHXPLAIN_LIST, {
      notifyOnNetworkStatusChange: true,
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
      nextFetchPolicy: "cache-first",
      variables: {
        listTechxplainInput: {
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
    fetchTechxplainList,
    loading,
    data,
  };
};

// =============== GET BY ID ===============
export const useTechxplainPageGetById = (id: string) => {
  const GET_TECHXPLAIN_BY_ID = gql`
    query getTechxplainById($getTechxplainByIdInput: GetTechxplainByIdInput!) {
      getTechxplainById(getTechxplainByIdInput: $getTechxplainByIdInput) {
        id
        active
        title
        url
        techxplainAssets {
          url
        }
      }
    }
  `;

  interface FetchedTechxplainById {
    getTechxplainById: {
      id: string;
      title: string;
      url: string;
      description: string;
      techxplainAssets: {
        url: string;
      }[];
    };
  }

  const [fetchTechxplainById, { loading, error, data }] =
    useLazyQuery<FetchedTechxplainById>(GET_TECHXPLAIN_BY_ID, {
      notifyOnNetworkStatusChange: true,
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
      variables: {
        getTechxplainByIdInput: {
          id: id,
        },
      },
    });

  useErrorMessage(error);

  return {
    fetchTechxplainById,
    loading,
    data,
  };
};

//========== INSERT MUTATION ==========
export const useTechxplainInsert = () => {
  const MUTATION_TECHXPLAIN_INSERT = gql`
    mutation addTechxplain($addTechxplainInput: AddTechxplainInput!) {
      addTechxplain(addTechxplainInput: $addTechxplainInput) {
        id
      }
    }
  `;
  const toast = useToast();
  const router = useRouter();

  const [mutationAddTechxplain, { loading, error, data }] = useMutation<
    InsertTechxplainResponse,
    InsertTechxplainArg
  >(MUTATION_TECHXPLAIN_INSERT, {
    onCompleted: () => {
      toast({
        title: "Successfully Inserted",
        position: "bottom",
        isClosable: true,
        status: "success",
      });
      router.push("/techxplain");
    },
  });

  useErrorMessage(error);

  return {
    mutationAddTechxplain,
    loading,
    data,
  };
};

//========== UPDATE MUTATION ==========
export const useTechxplainUpdate = () => {
  const toast = useToast();
  const router = useRouter();
  const MUTATION_TECHXPLAIN_UPDATE = gql`
    mutation editTechxplain($editTechxplainInput: EditTechxplainInput!) {
      editTechxplain(editTechxplainInput: $editTechxplainInput) {
        id
      }
    }
  `;

  const [mutationEditTechxplain, { loading, error, data }] = useMutation<
    UpdateTechxplainResponse,
    UpdateTechxplainArg
  >(MUTATION_TECHXPLAIN_UPDATE, {
    onCompleted: () => {
      toast({
        title: "Successfully Updated",
        position: "bottom",
        isClosable: true,
        status: "success",
      });
      router.push("/techxplain");
    },
  });

  useErrorMessage(error);

  return {
    mutationEditTechxplain,
    loading,
    data,
  };
};

//========== DELETE ============
export const useTechxplainDelete = (
  page: number,
  search: string,
  limit: number
) => {
  const DELETE_TECHXPLAIN = gql`
    mutation removeTechxplain($removeTechxplainInput: RemoveTechxplainInput!) {
      removeTechxplain(removeTechxplainInput: $removeTechxplainInput) {
        id
      }
    }
  `;
  const { fetchTechxplainList } = useTechxplainPageList(page, search, limit);
  const toast = useToast();

  const [mutationDeleteTechxplain, { loading, error, data }] = useMutation<
    DeleteTechxplainResponse,
    DeleteTechxplainArg
  >(DELETE_TECHXPLAIN, {
    onCompleted: () => {
      fetchTechxplainList();
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
    mutationDeleteTechxplain,
    loading,
    data,
  };
};

//========== PUBLISH =============
export const useTechxplainPublish = (
  page: number,
  search: string,
  limit: number
) => {
  const PUBLISH_TECHXPLAIN = gql`
    mutation publishTechxplain(
      $publishTechxplainInput: PublishTechxplainInput!
    ) {
      publishTechxplain(publishTechxplainInput: $publishTechxplainInput) {
        id
        active
      }
    }
  `;
  const { fetchTechxplainList } = useTechxplainPageList(page, search, limit);
  const toast = useToast();

  const [mutationPublishTechxplain, { loading, error, data }] = useMutation<
    PublishTechxplainResponse,
    PublishTechxplainArg
  >(PUBLISH_TECHXPLAIN, {
    onCompleted: () => {
      fetchTechxplainList();
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
    mutationPublishTechxplain,
    loading,
    data,
  };
};
