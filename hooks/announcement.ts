import {
  ResponseAnnouncementAdd,
  ResponseAnnouncementById,
  ResponseAnnouncementEdit,
  ResponseAnnouncementList,
  ResponseAnnouncementRemove,
  ResponseAnnouncementUpdateToggle,
  TAnnouncementAddPayload,
  TAnnouncementEditPayload,
  TAnnouncementRemovePayload,
  TAnnouncementUpdateTogglePayload,
} from "@/types/announcement";
import { useMutation, gql, useLazyQuery } from "@apollo/client";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useErrorMessage } from ".";

/**
 * LIST
 */
const QUERY_LIST = gql`
  query listAnnouncements($page: Int, $limit: Int, $search: String) {
    listAnnouncements(
      listAnnouncementsInput: {
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
      announcements {
        id
        text
        active
        createdAt
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

export const useAnnouncementList = ({ page, limit, search }: ListProps) => {
  const [fetchMore, { loading, error, data: response }] =
    useLazyQuery<ResponseAnnouncementList>(QUERY_LIST, {
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
  query getAnnouncementById($id: ID!) {
    getAnnouncementById(getAnnouncementByIdInput: { id: $id }) {
      id
      text
      active
    }
  }
`;

export const useAnnouncementDetail = (id: string) => {
  const [getSponsor, { loading, error, data: response }] =
    useLazyQuery<ResponseAnnouncementById>(QUERY_DETAIL, {
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
  mutation addAnnouncement($text: String!, $active: Boolean!) {
    addAnnouncement(addAnnouncementInput: { text: $text, active: $active }) {
      id
      text
      active
    }
  }
`;

export const useAnnouncementAddSubmit = () => {
  const toast = useToast();
  const router = useRouter();
  const [announcementAddSubmit, { data: response, error, loading }] =
    useMutation<ResponseAnnouncementAdd, TAnnouncementAddPayload>(
      MUTATION_ADD,
      {
        onCompleted: () => {
          toast({
            title: "Successfully Inserted",
            position: "bottom",
            isClosable: true,
            status: "success",
          });
          router.push("/announcement");
        },
      }
    );

  useErrorMessage(error);

  return {
    announcementAddSubmit,
    response,
    loading,
  };
};

/**
 * EDIT
 */
const MUTATION_EDIT = gql`
  mutation editAnnouncement($text: String!, $id: ID!, $active: Boolean!) {
    editAnnouncement(
      editAnnouncementInput: { text: $text, id: $id, active: $active }
    ) {
      id
      text
      active
    }
  }
`;

export const useAnnouncementEditSubmit = () => {
  const toast = useToast();
  const router = useRouter();
  const [announcementEditSubmit, { data: response, error, loading }] =
    useMutation<ResponseAnnouncementEdit, TAnnouncementEditPayload>(
      MUTATION_EDIT,
      {
        onCompleted: () => {
          toast({
            title: "Successfully Updated",
            position: "bottom",
            isClosable: true,
            status: "success",
          });
          router.push("/announcement");
        },
      }
    );

  useErrorMessage(error);

  return {
    announcementEditSubmit,
    response,
    loading,
  };
};

/**
 * REMOVE
 */
const MUTATION_REMOVE = gql`
  mutation removeAnnouncement($id: ID!) {
    removeAnnouncement(removeAnnouncementInput: { id: $id }) {
      status
    }
  }
`;

export const useAnnouncementRemove = () => {
  const toast = useToast();
  const [announcementRemove, { data: response, error, loading }] = useMutation<
    ResponseAnnouncementRemove,
    TAnnouncementRemovePayload
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
    announcementRemove,
    response,
    loading,
  };
};

/**
 * TOGGLE STATUS
 */
const TOGGLE_STATUS_UPDATE = gql`
  mutation toggleStatusAnnouncement($id: ID!, $status: Boolean!) {
    toggleStatusAnnouncement(
      toggleStatusAnnouncementInput: { id: $id, status: $status }
    ) {
      id
      text
      active
    }
  }
`;

export const useAnnouncementToggleStatus = () => {
  const toast = useToast();
  const [sponsorToggleStatus, { data: response, error, loading }] = useMutation<
    ResponseAnnouncementUpdateToggle,
    TAnnouncementUpdateTogglePayload
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
    sponsorToggleStatus,
    response,
    loading,
  };
};
