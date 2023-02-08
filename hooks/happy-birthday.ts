import { useErrorMessage } from "@/hooks";
import {
  DeleteProfileArg,
  DeleteProfileResponse,
  PublishProfileResponse,
  THappyBirthday,
  UpdateInProfileArgs,
  UpdateInProfileResponse,
  HappyBirtdaySearch,
  PublishBirthdayArg,
  InsertBirthdayArgs,
  InsertBirthdayResponse,
  UpdateBirthdayArgs,
} from "@/types/happy-birthday";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";

// ======== LIST ============
export const useHappyBirthdayPageList = (
  page: number,
  search: string,
  limit: number
) => {
  const GET_HAPPYBIRTHDAY_LIST = gql`
    query listBirthday($listBirthdayInput: ListBirthdayInput!) {
      listBirthday(listBirthdayInput: $listBirthdayInput) {
        page
        limit
        total
        totalPage
        birthdays {
          id
          firstName
          lastName
          designation
          birthday
          isActive
          createdAt
        }
      }
    }
  `;

  interface FetchedHappyBirthdayList {
    listBirthday: {
      page: number;
      limit: number;
      total: number;
      totalPage: number;
      birthdays: THappyBirthday[];
    };
  }
  const [fetchHappyBirthdayList, { loading, error, data }] =
    useLazyQuery<FetchedHappyBirthdayList>(GET_HAPPYBIRTHDAY_LIST, {
      notifyOnNetworkStatusChange: true,
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
      nextFetchPolicy: "cache-first",
      variables: {
        listBirthdayInput: {
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
    fetchHappyBirthdayList,
    loading,
    data,
  };
};

// =============== GET BY ID ===============
export const useBirthdayGetById = (id: string) => {
  const GET_BIRTHDAY_BY_ID = gql`
    query detailBirthday($detailBirthdayInput: DetailBirthdayInput!) {
      detailBirthday(detailBirthdayInput: $detailBirthdayInput) {
        id
        firstName
        lastName
        designation
        birthday
        isActive
        createdAt
      }
    }
  `;
  interface FetchedBirthdayById {
    detailBirthday: THappyBirthday;
    detailBirthdayInput: {
      id: string;
    };
  }

  const [fetchBirthdayById, { loading, error, data }] =
    useLazyQuery<FetchedBirthdayById>(GET_BIRTHDAY_BY_ID, {
      notifyOnNetworkStatusChange: true,
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
      nextFetchPolicy: "cache-first",
      variables: {
        detailBirthdayInput: {
          id: id,
        },
      },
    });

  useErrorMessage(error);

  return {
    fetchBirthdayById,
    loading,
    data,
  };
};

//========== INSERT MUTATION ==========
export const useBirthdayInsert = () => {
  const router = useRouter();
  const toast = useToast();
  const MUTATION_BIRTHDAY_INSERT = gql`
    mutation createBirthday($createBirthdayInput: CreateBirthdayInput!) {
      createBirthday(createBirthdayInput: $createBirthdayInput) {
        id
        firstName
        lastName
        designation
        birthday
        isActive
        createdAt
        updatedAt
      }
    }
  `;

  const [mutationAddBirthday, { loading, error, data }] = useMutation<
    InsertBirthdayResponse,
    InsertBirthdayArgs
  >(MUTATION_BIRTHDAY_INSERT, {
    onCompleted: () => {
      toast({
        title: "Successfully Inserted",
        position: "bottom",
        isClosable: true,
        status: "success",
      });
      router.push("/happy-birthday");
    },
  });

  useErrorMessage(error);

  return {
    mutationAddBirthday,
    loading,
    data,
  };
};

//========== UPDATE MUTATION ==========
export const useBirthdayUpdate = () => {
  const toast = useToast();
  const router = useRouter();
  const MUTATION_BIRTHDAY_UPDATE = gql`
    mutation updateBirthday($updateBirthdayInput: UpdateBirthdayInput!) {
      updateBirthday(updateBirthdayInput: $updateBirthdayInput) {
        id
        firstName
        lastName
        designation
        birthday
        isActive
        createdAt
      }
    }
  `;

  const [mutationEditInProfile, { loading, error, data }] = useMutation<
    InsertBirthdayResponse,
    UpdateBirthdayArgs
  >(MUTATION_BIRTHDAY_UPDATE, {
    onCompleted: () => {
      toast({
        title: "Successfully Updated",
        position: "bottom",
        isClosable: true,
        status: "success",
      });
      router.push("/happy-birthday");
    },
  });

  useErrorMessage(error);

  return {
    mutationEditInProfile,
    loading,
    data,
  };
};

//========== DELETE =============
export const useBirthdayDelete = (
  page: number,
  search: string,
  limit: number,
  id: string
) => {
  const DELETE_BIRTHDAY = gql`
    mutation deleteBirthday($detailBirthdayInput: DetailBirthdayInput!) {
      deleteBirthday(detailBirthdayInput: $detailBirthdayInput) {
        id
        firstName
        lastName
        designation
        birthday
        isActive
        createdAt
      }
    }
  `;

  const { fetchHappyBirthdayList } = useHappyBirthdayPageList(
    page,
    search,
    limit
  );
  const toast = useToast();

  interface FetchedBirthdayById {
    DetailBirthdayResponse: THappyBirthday;
    detailBirthdayInput: {
      id: string;
    };
  }

  const [mutationDelete, { loading, error, data }] =
    useMutation<FetchedBirthdayById>(DELETE_BIRTHDAY, {
      variables: {
        detailBirthdayInput: {
          id: id,
        },
      },
      onCompleted: () => {
        fetchHappyBirthdayList();
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
export const useHappyBirthdayPublish = (
  page: number,
  search: string,
  limit: number
) => {
  const PUBLISH_BIRTHDAY = gql`
    mutation updateStatusBirthday(
      $updateStatusBirthdayInput: UpdateStatusBirthdayInput!
    ) {
      updateStatusBirthday(
        updateStatusBirthdayInput: $updateStatusBirthdayInput
      ) {
        id
        firstName
        lastName
        designation
        birthday
        isActive
        createdAt
      }
    }
  `;
  const { fetchHappyBirthdayList } = useHappyBirthdayPageList(
    page,
    search,
    limit
  );
  const toast = useToast();

  const [mutationPublish, { loading, error, data }] = useMutation<
    THappyBirthday,
    PublishBirthdayArg
  >(PUBLISH_BIRTHDAY, {
    onCompleted: () => {
      fetchHappyBirthdayList();
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
