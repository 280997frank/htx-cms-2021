import { useErrorMessage } from "@/hooks";
import {
  FetchedHLSEntryList,
  HLSEntryProps,
  HSLEntryInsertProps,
  PublishHLSEntryArg,
} from "@/types/hls-entry";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";

// ======== LIST ============
export const useHLSEntryPageList = (
  page: number,
  search: string,
  limit: number,
  comitteeId: string
) => {
  const GET_HLS_LIST = gql`
    query listHlscomitteeEntry(
      $listHlscomitteeEntryInput: ListHlscomitteeEntryInput!
    ) {
      listHlscomitteeEntry(
        listHlscomitteeEntryInput: $listHlscomitteeEntryInput
      ) {
        page
        limit
        total
        totalPage
        hlscomitteeEntry {
          id
          comitteeId
          name
          timing
          rank
          distance
          category
          isActive
        }
      }
    }
  `;

  const [fetchHLSEntryList, { loading, error, data }] =
    useLazyQuery<FetchedHLSEntryList>(GET_HLS_LIST, {
      notifyOnNetworkStatusChange: true,
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
      nextFetchPolicy: "cache-first",
      variables: {
        listHlscomitteeEntryInput: {
          comitteeId: comitteeId,
          page: page,
          limit: limit,
          order: { sortBy: "DESC", orderBy: "CREATED_AT" },
          search: {
            keyword: search,
          },
        },
      },
    });

  useErrorMessage(error);

  return {
    fetchHLSEntryList,
    loading,
    data,
  };
};

//========== INSERT MUTATION ==========
export const useHLSEntryInsert = () => {
  const router = useRouter();
  const toast = useToast();
  const MUTATION_HLS_ENTRY_INSERT = gql`
    mutation createHlscomitteeEntry(
      $createHlscomitteeEntryInput: CreateHlscomitteeEntryInput!
    ) {
      createHlscomitteeEntry(
        createHlscomitteeEntryInput: $createHlscomitteeEntryInput
      ) {
        id
        comitteeId
        name
        timing
        rank
        distance
        category
        isActive
      }
    }
  `;

  const [mutationAddHLSEntry, { loading, error, data }] =
    useMutation<HSLEntryInsertProps>(MUTATION_HLS_ENTRY_INSERT, {
      onCompleted: () => {
        toast({
          title: "Successfully Inserted",
          position: "bottom",
          isClosable: true,
          status: "success",
        });
      },
    });

  useErrorMessage(error);

  return {
    mutationAddHLSEntry,
    loading,
    data,
  };
};

//========== DELETE =============
export const useHLSEntryDelete = (
  page: number,
  search: string,
  limit: number,
  comitteeId: string
) => {
  const DELETE_HLS_ENTRY = gql`
    mutation deleteHlscomitteeEntry(
      $detailHlscomitteeEntryInput: DetailHlscomitteeEntryInput!
    ) {
      deleteHlscomitteeEntry(
        detailHlscomitteeEntryInput: $detailHlscomitteeEntryInput
      ) {
        id
        comitteeId
        name
        timing
        rank
        distance
        category
        isActive
      }
    }
  `;

  const { fetchHLSEntryList } = useHLSEntryPageList(
    page,
    search,
    limit,
    comitteeId
  );
  const toast = useToast();

  interface DeleteHLSEntryProps {
    DetailBirthdayResponse: HLSEntryProps;
    detailHlscomitteeEntryInput: {
      id: string;
    };
  }

  const [mutationDelete, { loading, error, data }] =
    useMutation<DeleteHLSEntryProps>(DELETE_HLS_ENTRY, {
      onCompleted: () => {
        fetchHLSEntryList();
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
export const useHLSEntryPublish = (
  page: number,
  search: string,
  limit: number,
  comitteeId: string
) => {
  const PUBLISH_HLS_ENTRY = gql`
    mutation updateStatusHlscomitteeEntry(
      $updateStatusHlscomitteeEntryInput: UpdateStatusHlscomitteeEntryInput!
    ) {
      updateStatusHlscomitteeEntry(
        updateStatusHlscomitteeEntryInput: $updateStatusHlscomitteeEntryInput
      ) {
        id
        comitteeId
        name
        timing
        rank
        distance
        category
        isActive
      }
    }
  `;
  const { fetchHLSEntryList } = useHLSEntryPageList(
    page,
    search,
    limit,
    comitteeId
  );
  const toast = useToast();

  const [mutationPublish, { loading, error, data }] = useMutation<
    HLSEntryProps,
    PublishHLSEntryArg
  >(PUBLISH_HLS_ENTRY, {
    onCompleted: () => {
      fetchHLSEntryList();
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
