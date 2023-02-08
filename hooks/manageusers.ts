import { useErrorMessage } from "@/hooks";
import {
  DeleteManageUsersArg,
  DeleteManageUsersResponse,
  InsertManageUsersArgs,
  InsertManageUsersResponse,
  PublishManageUsersArg,
  PublishManageUsersResponse,
  TManageUsers,
  TManageUsersForm,
  TManageUsersTable,
  UpdateManageUsersArgs,
  UpdateManageUsersResponse,
} from "@/types/manageusers";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";

// ======== LIST ============
export const useManageUsersPageList = (
  page: number,
  search: string,
  limit: number
) => {
  const GET_USERS = gql`
    query listUser($param: ListUserInput!) {
      listUser(listUserInput: $param) {
        page
        limit
        total
        totalPage
        users {
          id
          email
          role
          isActive
          name
        }
      }
    }
  `;

  interface FetchedManageUsersList {
    listUser: {
      page: number;
      limit: number;
      total: number;
      totalPage: number;
      users: TManageUsersTable[];
    };
  }
  const [fetchManageUsersList, { loading, error, data }] =
    useLazyQuery<FetchedManageUsersList>(GET_USERS, {
      notifyOnNetworkStatusChange: true,
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
      nextFetchPolicy: "cache-first",
      variables: {
        param: {
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
    fetchManageUsersList,
    loading,
    data,
  };
};

// =============== GET BY ID ===============
export const useManageUsersPageGetById = (id: string) => {
  const GET_USERS_BY_ID = gql`
    query detailUser($id: ID!) {
      detailUser(id: $id) {
        id
        name
        email
        role
        permissions {
          name
        }
      }
    }
  `;

  interface FetchedUserById {
    detailUser: TManageUsersForm;
  }

  const [fetchUserById, { loading, error, data }] =
    useLazyQuery<FetchedUserById>(GET_USERS_BY_ID, {
      notifyOnNetworkStatusChange: true,
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
      variables: {
        id: id,
      },
    });

  useErrorMessage(error);

  return {
    fetchUserById,
    loading,
    data,
  };
};

//========== INSERT MUTATION ==========
export const useManageUserInsert = () => {
  const MUTATION_USER_INSERT = gql`
    mutation createUser($createUserInput: CreateUserInput!) {
      createUser(createUserInput: $createUserInput) {
        id
      }
    }
  `;
  const toast = useToast();
  const router = useRouter();

  const [mutationAddManageUsers, { loading, error, data }] = useMutation<
    InsertManageUsersResponse,
    InsertManageUsersArgs
  >(MUTATION_USER_INSERT, {
    onCompleted: () => {
      toast({
        title: "Successfully Inserted",
        position: "bottom",
        isClosable: true,
        status: "success",
      });
      router.push("/manage-users");
    },
  });

  useErrorMessage(error);

  return {
    mutationAddManageUsers,
    loading,
    data,
  };
};

//========== UPDATE MUTATION ==========
export const useManageUserUpdate = () => {
  const toast = useToast();
  const router = useRouter();
  const MUTATION_USER_UPDATE = gql`
    mutation updateUser($updateUserInput: UpdateUserInput!) {
      updateUser(updateUserInput: $updateUserInput) {
        id
      }
    }
  `;

  const [mutationEditUser, { loading, error, data }] = useMutation<
    UpdateManageUsersResponse,
    UpdateManageUsersArgs
  >(MUTATION_USER_UPDATE, {
    onCompleted: () => {
      toast({
        title: "Successfully Updated",
        position: "bottom",
        isClosable: true,
        status: "success",
      });
      router.push("/manage-users");
    },
  });

  useErrorMessage(error);

  return {
    mutationEditUser,
    loading,
    data,
  };
};

//========== DELETE =============
export const useManageUsersDelete = (
  page: number,
  search: string,
  limit: number
) => {
  const DELETE_USER = gql`
    mutation deleteUser($id: ID!) {
      deleteUser(id: $id) {
        id
      }
    }
  `;

  const { fetchManageUsersList } = useManageUsersPageList(page, search, limit);
  const toast = useToast();

  const [mutationDelete, { loading, error, data }] = useMutation<
    DeleteManageUsersResponse,
    DeleteManageUsersArg
  >(DELETE_USER, {
    onCompleted: () => {
      fetchManageUsersList();
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

//========== ACTIVE USER ==========
export const useManageUsersActivate = (
  page: number,
  search: string,
  limit: number
) => {
  const ACTIVATE_USER = gql`
    mutation publishUser($publishUserInput: PublishUserInput!) {
      publishUser(publishUserInput: $publishUserInput) {
        id
      }
    }
  `;
  const { fetchManageUsersList } = useManageUsersPageList(page, search, limit);
  const toast = useToast();

  const [mutationPublish, { loading, error, data }] = useMutation<
    PublishManageUsersResponse,
    PublishManageUsersArg
  >(ACTIVATE_USER, {
    onCompleted: () => {
      fetchManageUsersList();
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
