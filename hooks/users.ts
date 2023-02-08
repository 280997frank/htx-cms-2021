import { useLazyQuery, useMutation, gql } from "@apollo/client";
import { useToast } from "@chakra-ui/react";
import { useErrorMessage } from "@/hooks";
import {
  IUserCreatePayload,
  IUserCreateResponse,
  IUserUpdatePayload,
  IUserUpdateResponse,
  IUserListResponse,
  IUserDetailResponse,
  IUserDeleteResponse,
  IUsersByRoleListResponse,
} from "@/types/users";
import { IListParams } from "../types";

const GET_USERS = gql`
  query getUsers($page: Int!, $limit: Int!, $search: String) {
    getUsers(params: { page: $page, limit: $limit, search: $search }) {
      page
      limit
      total
      totalPage
      data {
        id
        fullname
        isActive
        company {
          companyName
        }
        email
        roles
      }
    }
  }
`;

const GET_USER_DETAIL = gql`
  query getUserDetail($userId: String!) {
    getUserDetail(userId: $userId) {
      id
      email
      fullname
      roles
      phoneNumber
      aboutMe
      country
      interests
      isActive
      profilePicture
      connection {
        facebook {
          isActive
          url
        }
        linkedin {
          isActive
          url
        }
        twitter {
          isActive
          url
        }
        link {
          isActive
          url
        }
      }
      company {
        companyName
        position
        industry
        companyDescription
        companyLogo
        companyWebsite
      }
    }
  }
`;

const ADD_USER = gql`
  mutation register($paramRegister: AuthRegister!) {
    register(paramRegister: $paramRegister) {
      id
    }
  }
`;

const UPDATE_USER = gql`
  mutation editUser($params: UpdateUserInput!) {
    editUser(params: $params) {
      id
    }
  }
`;

const DELETE_USER = gql`
  mutation deleteUser($userId: String!) {
    deleteUser(userId: $userId) {
      success
    }
  }
`;

const GET_USER_BY_ROLE = gql`
  query listByRole($listByRoleInput: ListByRoleInput!) {
    listByRole(listByRoleInput: $listByRoleInput) {
      users {
        id
        fullname
      }
    }
  }
`;

export const useListUsers = ({ page, limit, search }: IListParams) => {
  const [fetchUsers, { loading, error, data }] =
    useLazyQuery<IUserListResponse>(GET_USERS, {
      notifyOnNetworkStatusChange: true,
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
      variables: {
        page,
        limit,
        search,
      },
    });

  useErrorMessage(error);

  return {
    fetchUsers,
    loading,
    data,
  };
};

export const useUserDetail = (userId: string) => {
  const [getUserDetail, { loading, error, data }] =
    useLazyQuery<IUserDetailResponse>(GET_USER_DETAIL, {
      notifyOnNetworkStatusChange: true,
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
      variables: {
        userId,
      },
    });

  useErrorMessage(error);

  return {
    getUserDetail,
    loading,
    data,
  };
};

export const useAddUser = () => {
  const toast = useToast();
  const [addUser, { loading, error, data }] = useMutation<
    IUserCreateResponse,
    IUserCreatePayload
  >(ADD_USER, {
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
    addUser,
    loading,
    data,
  };
};

export const useUpdateUser = () => {
  const toast = useToast();
  const [updateUser, { loading, error, data }] = useMutation<
    IUserUpdateResponse,
    IUserUpdatePayload
  >(UPDATE_USER, {
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
    updateUser,
    loading,
    data,
  };
};

export const useDeleteUser = () => {
  const toast = useToast();
  const [deleteUser, { loading, error, data }] = useMutation<
    IUserDeleteResponse,
    { userId: string }
  >(DELETE_USER, {
    onCompleted: () => {
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
    deleteUser,
    loading,
    data,
  };
};

export const useListUsersByRole = () => {
  const [fetchUsersByRole, { loading, error, data }] =
    useLazyQuery<IUsersByRoleListResponse>(GET_USER_BY_ROLE, {
      notifyOnNetworkStatusChange: true,
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
      variables: {
        listByRoleInput: {
          filter: {
            type: "Speaker",
          },
        },
      },
    });

  useErrorMessage(error);

  return {
    fetchUsersByRole,
    loading,
    data,
  };
};
