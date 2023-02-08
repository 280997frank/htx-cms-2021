import { useErrorMessage } from "@/hooks";
import {
  DeleteXMarksTheSpotArg,
  DeleteXMarksTheSpotResponse,
  DetailXMarksTheSpotArg,
  DetailXMarksTheSpotResponse,
  InsertXMarksTheSpotArg,
  InsertXMarksTheSpotResponse,
  PublishXMarksTheSpotArg,
  PublishXMarksTheSpotResponse,
  TXMarksTheSpotTable,
  UpdateXMarksTheSpotArg,
  UpdateXMarksTheSpotResponse,
} from "@/types/xmarksthespot";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";

export const useXMarksTheSpotPageList = (
  page: number,
  search: string,
  limit: number
) => {
  const GET_XMARKSTHESPOT_LIST = gql`
    query listXmark($listXmarkInput: ListXmarkInput!) {
      listXmark(listXmarkInput: $listXmarkInput) {
        limit
        page
        total
        totalPage
        questions {
          id
          question
          isActive
          createdAt
        }
      }
    }
  `;

  interface FetchedXMarksTheSpotList {
    listXmark: {
      limit: number;
      page: number;
      total: number;
      totalPage: number;
      questions: TXMarksTheSpotTable[];
    };
  }

  const [fetchXMarksTheSpotList, { loading, error, data }] =
    useLazyQuery<FetchedXMarksTheSpotList>(GET_XMARKSTHESPOT_LIST, {
      notifyOnNetworkStatusChange: true,
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
      nextFetchPolicy: "cache-first",
      variables: {
        listXmarkInput: {
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
    fetchXMarksTheSpotList,
    loading,
    data,
  };
};

//========== INSERT ============
export const useXmarksInsert = () => {
  const MUTATION_XMARKS_INSERT = gql`
    mutation createXmark($createXmarkInput: CreateXmarkInput!) {
      createXmark(createXmarkInput: $createXmarkInput) {
        id
      }
    }
  `;
  const toast = useToast();
  const router = useRouter();

  const [mutationInsertXmarks, { loading, error, data }] = useMutation<
    InsertXMarksTheSpotResponse,
    InsertXMarksTheSpotArg
  >(MUTATION_XMARKS_INSERT, {
    onCompleted: () => {
      toast({
        title: "Successfully Inserted",
        position: "bottom",
        isClosable: true,
        status: "success",
      });
      router.push("/xmarks-the-spot");
    },
  });

  useErrorMessage(error);

  return {
    mutationInsertXmarks,
    loading,
    data,
  };
};

//========== UPDATE ============
export const useXmarksUpdate = () => {
  const MUTATION_XMARKS_UPDATE = gql`
    mutation updateXmark($updateXmarkInput: UpdateXmarkInput!) {
      updateXmark(updateXmarkInput: $updateXmarkInput) {
        id
      }
    }
  `;
  const toast = useToast();
  const router = useRouter();

  const [mutationUpdateXmarks, { loading, error, data }] = useMutation<
    UpdateXMarksTheSpotResponse,
    UpdateXMarksTheSpotArg
  >(MUTATION_XMARKS_UPDATE, {
    onCompleted: () => {
      toast({
        title: "Successfully Updated",
        position: "bottom",
        isClosable: true,
        status: "success",
      });
      router.push("/xmarks-the-spot");
    },
  });

  useErrorMessage(error);

  return {
    mutationUpdateXmarks,
    loading,
    data,
  };
};

//========== DETAIL ============
export const useXmarksDetail = (id: string) => {
  const MUTATION_XMARKS_DETAIL = gql`
    mutation detailXmark($detailXmarkInput: DetailXmarkInput!) {
      detailXmark(detailXmarkInput: $detailXmarkInput) {
        id
        question
        isActive
        answers {
          id
          option
          count
          percentage
        }
      }
    }
  `;
  const [mutationDetailXmarks, { loading, error, data }] = useMutation<
    DetailXMarksTheSpotResponse,
    DetailXMarksTheSpotArg
  >(MUTATION_XMARKS_DETAIL, {
    variables: {
      detailXmarkInput: {
        id: id,
      },
    },
  });

  useErrorMessage(error);

  return {
    mutationDetailXmarks,
    loading,
    data,
  };
};

//==========DELETE ============
export const useDelete = (page: number, search: string, limit: number) => {
  const DELETE_XMARKSTHESPOT = gql`
    mutation deleteXmark($detailXmarkInput: DetailXmarkInput!) {
      deleteXmark(detailXmarkInput: $detailXmarkInput) {
        id
      }
    }
  `;
  const { fetchXMarksTheSpotList } = useXMarksTheSpotPageList(
    page,
    search,
    limit
  );
  const toast = useToast();

  const [mutationDelete, { loading, error, data }] = useMutation<
    DeleteXMarksTheSpotResponse,
    DeleteXMarksTheSpotArg
  >(DELETE_XMARKSTHESPOT, {
    onCompleted: () => {
      fetchXMarksTheSpotList();
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

//==========PUBLISH =============
export const usePublish = (page: number, search: string, limit: number) => {
  const PUBLISH_XMARKSTHESPOT = gql`
    mutation updateStatusXmark(
      $updateStatusXmarkInput: UpdateStatusXmarkInput!
    ) {
      updateStatusXmark(updateStatusXmarkInput: $updateStatusXmarkInput) {
        id
      }
    }
  `;
  const { fetchXMarksTheSpotList } = useXMarksTheSpotPageList(
    page,
    search,
    limit
  );
  const toast = useToast();

  const [mutationPublish, { loading, error, data }] = useMutation<
    PublishXMarksTheSpotResponse,
    PublishXMarksTheSpotArg
  >(PUBLISH_XMARKSTHESPOT, {
    onCompleted: () => {
      fetchXMarksTheSpotList();
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
