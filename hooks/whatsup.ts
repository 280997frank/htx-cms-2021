import {
  ResponseWhatsupAdd,
  ResponseWhatsupById,
  ResponseWhatsupEdit,
  ResponseWhatsupList,
  ResponseWhatsupRemove,
  ResponseWhatsupUpdateToggle,
  TWhatsupAddPayload,
  TWhatsupEditPayload,
  TWhatsupRemovePayload,
  TWhatsupUpdateTogglePayload,
} from "@/types/whatsup";
import { useMutation, gql, useLazyQuery } from "@apollo/client";
import { useToast } from "@chakra-ui/react";
import { useErrorMessage } from ".";
import { useRouter } from "next/router";

/**
 * LIST
 */
const QUERY_LIST = gql`
  query listWhatsUp($page: Int, $limit: Int, $search: String) {
    listWhatsUp(
      listWhatsUpInput: {
        page: $page
        limit: $limit
        search: { keyword: $search }
        order: { orderBy: CREATED_AT, sortBy: DESC }
      }
    ) {
      page
      limit
      total
      totalPage
      whatsUps {
        id
        title
        date
        isActive
      }
    }
  }
`;

export enum TOrderBy {
  CREATED_AT = "CREATED_AT",
}
export enum TSortBY {
  ASC = "ASC",
  DESC = "DESC",
}

interface ListProps {
  page: number;
  limit: number;
  search: string;
}

export const useWhatsupList = ({ page, limit, search }: ListProps) => {
  const [fetchMore, { loading, error, data: response }] =
    useLazyQuery<ResponseWhatsupList>(QUERY_LIST, {
      notifyOnNetworkStatusChange: true,
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
      variables: {
        page: page,
        limit: limit,
        search: search,
        order: {
          orderBy: TOrderBy.CREATED_AT,
          sortBy: TSortBY.DESC,
        },
      },
    });

  useErrorMessage(error);

  return {
    fetchMore,
    response,
    loading,
  };
};

/**
 * DETAIL
 */
const QUERY_DETAIL = gql`
  query detailWhatsUp($id: String!) {
    detailWhatsUp(id: $id) {
      id
      title
      image
      date
      registerBy
      venueName
      contactName
      contactPhone
    }
  }
`;

export const useWhatsupDetail = (id: string) => {
  const [getSponsor, { loading, error, data: response }] =
    useLazyQuery<ResponseWhatsupById>(QUERY_DETAIL, {
      notifyOnNetworkStatusChange: true,
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
      variables: {
        id: id,
      },
    });

  useErrorMessage(error);

  return {
    getSponsor,
    response,
    loading,
  };
};

/**
 * ADD
 */
const MUTATION_ADD = gql`
  mutation createWhatsUp(
    $title: String!
    $image: String!
    $date: DateTime!
    $registerBy: DateTime!
    $venueName: String!
    $contactName: String!
    $contactPhone: String!
  ) {
    createWhatsUp(
      createWhatsUpInput: {
        title: $title
        image: $image
        date: $date
        registerBy: $registerBy
        venueName: $venueName
        contactName: $contactName
        contactPhone: $contactPhone
      }
    ) {
      id
      title
      date
      isActive
    }
  }
`;

export const useWhatsupAddSubmit = () => {
  const toast = useToast();
  const router = useRouter();

  const [whatsupAddSubmit, { data: response, error, loading }] = useMutation<
    ResponseWhatsupAdd,
    TWhatsupAddPayload
  >(MUTATION_ADD, {
    onCompleted: () => {
      toast({
        title: "Successfully Inserted",
        position: "bottom",
        isClosable: true,
        status: "success",
      });
      router.push("/whats-up");
    },
  });

  useErrorMessage(error);

  return {
    whatsupAddSubmit,
    response,
    loading,
  };
};

/**
 * EDIT
 */
const MUTATION_EDIT = gql`
  mutation updateWhatsUp(
    $id: String!
    $title: String!
    $image: String!
    $date: DateTime!
    $registerBy: DateTime!
    $venueName: String!
    $contactName: String!
    $contactPhone: String!
  ) {
    updateWhatsUp(
      updateWhatsUpInput: {
        id: $id
        title: $title
        image: $image
        date: $date
        registerBy: $registerBy
        venueName: $venueName
        contactName: $contactName
        contactPhone: $contactPhone
      }
    ) {
      id
      title
      image
      date
      registerBy
      venueName
      contactName
      contactPhone
      isActive
    }
  }
`;

export const useWhatsupEditSubmit = () => {
  const toast = useToast();
  const router = useRouter();

  const [whatsupEditSubmit, { data: response, error, loading }] = useMutation<
    ResponseWhatsupEdit,
    TWhatsupEditPayload
  >(MUTATION_EDIT, {
    onCompleted: () => {
      toast({
        title: "Successfully Updated",
        position: "bottom",
        isClosable: true,
        status: "success",
      });
      router.push("/whats-up");
    },
  });

  useErrorMessage(error);

  return {
    whatsupEditSubmit,
    response,
    loading,
  };
};

/**
 * REMOVE
 */
const MUTATION_REMOVE = gql`
  mutation deleteWhatsUp($id: String!) {
    deleteWhatsUp(deleteWhatsUpInput: { id: $id }) {
      isActive
    }
  }
`;

export const useWhatsupRemove = () => {
  const toast = useToast();
  const [whatsupRemove, { data: response, error, loading }] = useMutation<
    ResponseWhatsupRemove,
    TWhatsupRemovePayload
  >(MUTATION_REMOVE, {
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
    whatsupRemove,
    response,
    loading,
  };
};

/**
 * TOGGLE STATUS
 */
const TOGGLE_STATUS_UPDATE = gql`
  mutation publishWhatsUp($id: String!, $isActive: Boolean!) {
    publishWhatsUp(publishWhatsUpInput: { id: $id, isActive: $isActive }) {
      id
      title
      date
      isActive
    }
  }
`;

export const useWhatsupToggleStatus = () => {
  const toast = useToast();
  const [whatsupToggleStatus, { data: response, error, loading }] = useMutation<
    ResponseWhatsupUpdateToggle,
    TWhatsupUpdateTogglePayload
  >(TOGGLE_STATUS_UPDATE, {
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
    whatsupToggleStatus,
    response,
    loading,
  };
};
