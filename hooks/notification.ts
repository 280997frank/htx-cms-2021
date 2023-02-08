import { useLazyQuery, useMutation, gql } from "@apollo/client";
import { useToast } from "@chakra-ui/react";
import { useErrorMessage } from "@/hooks";
import {
  INotificationListResponse,
  INotificationCreatePayload,
  INotificationUpdatePayload,
  INotificationUpdateResponse,
  INotificationPublishPayload,
  INotificationPublishResponse,
  INotificationDetailResponse,
  IExhibitorListResponse,
} from "@/types/notification";
import { IListParams } from "../types";

const GET_NOTIFICATIONS = gql`
  query listNotifications($page: Int, $limit: Int, $search: String) {
    listNotifications(
      listNotificationInput: { page: $page, limit: $limit, search: $search }
    ) {
      page
      limit
      total
      totalPage
      notifications {
        id
        title
        publishDate
        isPublish
      }
    }
  }
`;

const GET_NOTIFICATION_DETAIL = gql`
  query detailNotification($id: String!) {
    detailNotification(id: $id) {
      id
      title
      description
      exhibitor {
        id
        name
      }
      url
      sponsorLogoUrl
    }
  }
`;

const LIST_EXHIBITOR = gql`
  query listExhibitors($page: Int, $limit: Int, $search: String) {
    listExhibitors(
      listExhibitorInput: { page: $page, limit: $limit, search: $search }
    ) {
      page
      limit
      total
      totalPage
      exhibitors {
        id
        name
      }
    }
  }
`;

const ADD_NOTIFICATION = gql`
  mutation addNotification($addNotificationInput: AddNotificationInput!) {
    addNotification(addNotificationInput: $addNotificationInput) {
      id
    }
  }
`;

const UPDATE_NOTIFICATION = gql`
  mutation editNotification($editNotificationInput: EditNotificationInput!) {
    editNotification(editNotificationInput: $editNotificationInput) {
      id
    }
  }
`;

const DELETE_NOTIFICATION = gql`
  mutation deleteNotification($id: String!) {
    deleteNotification(id: $id) {
      id
    }
  }
`;

const PUBLISH_NOTIFICATION = gql`
  mutation publishNotification($id: String!, $isPublish: Boolean!) {
    publishNotification(
      publishNotificationInput: { id: $id, isPublish: $isPublish }
    ) {
      id
      isPublish
    }
  }
`;

export const useListNotification = ({ page, limit, search }: IListParams) => {
  const [fetchNotification, { loading, error, data }] =
    useLazyQuery<INotificationListResponse>(GET_NOTIFICATIONS, {
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
    fetchNotification,
    loading,
    data,
  };
};

export const useNotificationDetails = (id: string) => {
  const [getNotificationDetail, { loading, error, data }] =
    useLazyQuery<INotificationDetailResponse>(GET_NOTIFICATION_DETAIL, {
      notifyOnNetworkStatusChange: true,
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
      variables: {
        id,
      },
    });

  useErrorMessage(error);

  return {
    getNotificationDetail,
    loading,
    data,
  };
};

export const useAddNotification = () => {
  const toast = useToast();
  const [addNotification, { loading, error, data }] = useMutation<
    INotificationUpdateResponse,
    INotificationCreatePayload
  >(ADD_NOTIFICATION, {
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
    addNotification,
    loading,
    data,
  };
};

export const useUpdateNotification = () => {
  const toast = useToast();
  const [updateNotification, { loading, error, data }] = useMutation<
    INotificationUpdateResponse,
    INotificationUpdatePayload
  >(UPDATE_NOTIFICATION, {
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
    updateNotification,
    loading,
    data,
  };
};

export const useDeleteNotification = () => {
  const toast = useToast();
  const [deleteNotification, { loading, error, data }] =
    useMutation<INotificationUpdateResponse>(DELETE_NOTIFICATION, {
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
    deleteNotification,
    loading,
    data,
  };
};

export const usePublishNotification = () => {
  const toast = useToast();
  const [publishNotification, { loading, error, data }] = useMutation<
    INotificationPublishResponse,
    INotificationPublishPayload
  >(PUBLISH_NOTIFICATION, {
    onCompleted: (response) => {
      const status = response.publishNotification.isPublish
        ? "published"
        : "not published";
      toast({
        title: `Successfully Updated ${status}!`,
        position: "bottom",
        isClosable: true,
        status: "success",
      });
    },
  });

  useErrorMessage(error);

  return {
    publishNotification,
    loading,
    data,
  };
};

export const useListExhibitor = () => {
  const [fetchExhibitor, { loading, error, data }] =
    useLazyQuery<IExhibitorListResponse>(LIST_EXHIBITOR, {
      notifyOnNetworkStatusChange: true,
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
      variables: {
        page: 1,
        limit: 99999,
        search: "",
      },
    });

  useErrorMessage(error);

  return {
    fetchExhibitor,
    loading,
    data,
  };
};
