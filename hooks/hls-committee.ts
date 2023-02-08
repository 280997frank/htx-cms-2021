import { useErrorMessage } from "@/hooks";
import {
  HLSProps,
  FetchedHLSList,
  PublishHLSArg,
  InsertHLSArgs,
} from "@/types/hls-committee";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";

// ======== LIST ============
export const useHLSPageList = (page: number, search: string, limit: number) => {
  const GET_HLS_LIST = gql`
    query listHlscomittee($listHlscomitteeInput: ListHlscomitteeInput!) {
      listHlscomittee(listHlscomitteeInput: $listHlscomitteeInput) {
        page
        limit
        total
        totalPage
        hlscomittee {
          id
          title
          thumbnail
          isActive
          date
          createdAt
        }
      }
    }
  `;

  const [fetchHLSList, { loading, error, data }] = useLazyQuery<FetchedHLSList>(
    GET_HLS_LIST,
    {
      notifyOnNetworkStatusChange: true,
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
      nextFetchPolicy: "cache-first",
      variables: {
        listHlscomitteeInput: {
          page: page,
          limit: limit,
          order: { sortBy: "DESC", orderBy: "CREATED_AT" },
          search: {
            keyword: search,
          },
        },
      },
    }
  );

  useErrorMessage(error);

  return {
    fetchHLSList,
    loading,
    data,
  };
};

// =============== GET BY ID ===============
export const useHLSGetById = (id: string) => {
  const GET_HLS_BY_ID = gql`
    query detailHlscomittee($detailHlscomitteeInput: DetailHlscomitteeInput!) {
      detailHlscomittee(detailHlscomitteeInput: $detailHlscomitteeInput) {
        id
        title
        thumbnail
        isActive
        date
        createdAt
      }
    }
  `;

  interface FetchedHLSById {
    detailHlscomittee: HLSProps;
    detailHlscomitteeInput: {
      id: string;
    };
  }

  const [fetchHLSById, { loading, error, data }] = useLazyQuery<FetchedHLSById>(
    GET_HLS_BY_ID,
    {
      notifyOnNetworkStatusChange: true,
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
      nextFetchPolicy: "cache-first",
      variables: {
        detailHlscomitteeInput: {
          id: id,
        },
      },
    }
  );

  useErrorMessage(error);

  return {
    fetchHLSById,
    loading,
    data,
  };
};

//========== INSERT MUTATION ==========
export const useHLSInsert = () => {
  const router = useRouter();
  const toast = useToast();
  const MUTATION_HLS_INSERT = gql`
    mutation createHlscomittee(
      $createHlscomitteeInput: CreateHlscomitteeInput!
    ) {
      createHlscomittee(createHlscomitteeInput: $createHlscomitteeInput) {
        id
        title
        thumbnail
        isActive
        date
        createdAt
      }
    }
  `;

  const [mutationAddHLS, { loading, error, data }] = useMutation<InsertHLSArgs>(
    MUTATION_HLS_INSERT,
    {
      onCompleted: () => {
        toast({
          title: "Successfully Inserted",
          position: "bottom",
          isClosable: true,
          status: "success",
        });
        router.push("/hls-committee");
      },
    }
  );

  useErrorMessage(error);

  return {
    mutationAddHLS,
    loading,
    data,
  };
};

//========== UPDATE MUTATION ==========
export const useHLSUpdate = () => {
  const toast = useToast();
  const router = useRouter();
  const MUTATION_HLS_UPDATE = gql`
    mutation updateHlscomittee(
      $updateHlscomitteeInput: UpdateHlscomitteeInput!
    ) {
      updateHlscomittee(updateHlscomitteeInput: $updateHlscomitteeInput) {
        id
        title
        date
        thumbnail
      }
    }
  `;

  const [mutationEditHLS, { loading, error, data }] = useMutation(
    MUTATION_HLS_UPDATE,
    {
      onCompleted: () => {
        toast({
          title: "Successfully Updated",
          position: "bottom",
          isClosable: true,
          status: "success",
        });
        router.push("/hls-committee");
      },
    }
  );

  useErrorMessage(error);
  console.log(data, "data update");
  return {
    mutationEditHLS,
    loading,
    data,
  };
};

//========== DELETE =============
export const useHLSDelete = (page: number, search: string, limit: number) => {
  const DELETE_HLS = gql`
    mutation deleteHlscomittee(
      $detailHlscomitteeInput: DetailHlscomitteeInput!
    ) {
      deleteHlscomittee(detailHlscomitteeInput: $detailHlscomitteeInput) {
        id
        title
        date
        thumbnail
        isActive
      }
    }
  `;

  const { fetchHLSList } = useHLSPageList(page, search, limit);
  const toast = useToast();

  interface FetchedBirthdayById {
    detailHlscomitteeInput: {
      id: string;
    };
  }

  const [mutationDelete, { loading, error, data }] =
    useMutation<FetchedBirthdayById>(DELETE_HLS, {
      onCompleted: () => {
        fetchHLSList();
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

//========== PUBLISH SESSION ==========
export const useHLSPublish = (page: number, search: string, limit: number) => {
  const PUBLISH_HLS = gql`
    mutation updateStatusHlscomittee(
      $updateStatusHlscomitteeInput: UpdateStatusHlscomitteeInput!
    ) {
      updateStatusHlscomittee(
        updateStatusHlscomitteeInput: $updateStatusHlscomitteeInput
      ) {
        id
        title
        thumbnail
        isActive
        date
        createdAt
      }
    }
  `;
  const { fetchHLSList } = useHLSPageList(page, search, limit);
  const toast = useToast();

  const [mutationPublish, { loading, error, data }] = useMutation<
    HLSProps,
    PublishHLSArg
  >(PUBLISH_HLS, {
    onCompleted: () => {
      fetchHLSList();
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
