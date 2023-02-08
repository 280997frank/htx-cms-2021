import { useLazyQuery, useMutation, gql } from "@apollo/client";
import { useToast } from "@chakra-ui/react";

// import { useErrorMessage } from "@/hooks";
import { MediaFolderType } from "@/types/upload";
import {
  TEStatusFeedEvent,
  TTypeFeedEvent,
  TGetEventGallery,
  TGetFeedEvents,
  LiveFeedStatus,
} from "@/types/feed";

interface FileUploadResponse {
  url: string;
  imageId: string;
}
interface StatusFeedEventResponse {
  url: string;
  imageId: string;
}
interface BasicResponse {
  success: boolean;
}
interface Tparam {
  file: File | string;
  folder: MediaFolderType;
  imageId: string;
}
interface MultipleFileParam {
  param: Tparam[];
}
interface TparamsUpdateStatus {
  id: string;
  status: TEStatusFeedEvent;
}
interface UpdateStatusFeedEventParam {
  params: TparamsUpdateStatus;
}
interface DeleteGalleryArgs {
  imageIds: string[];
}
interface TParamsGetFeedEvents {
  params: {
    page: number;
    limit: number;
    filter: TEStatusFeedEvent[];
    search: string;
  };
}
interface TFeedEventRemovePayload {
  id: string;
}

interface CreateLiveFeedInput {
  params: {
    type: TTypeFeedEvent;
    postingText: string;
  };
}

interface LiveFeedResponse {
  postingFeedEvent: {
    id: string;
  };
}

interface UpdateLiveFeedInput {
  params: {
    id: string;
    status: TEStatusFeedEvent;
    currentProcess: LiveFeedStatus;
  };
}

//=========GET FEED GALLERY ===
const GET_Feed_Gallery = gql`
  query getFeedGallery {
    getFeedGallery {
      feedAd {
        id
        url
        folder
      }
      feedCarousel {
        id
        url
        folder
      }
    }
  }
`;

export const useFeedGallery = () => {
  const toast = useToast();
  const [fetchFeed, { loading, data }] = useLazyQuery<TGetEventGallery>(
    GET_Feed_Gallery,
    {
      notifyOnNetworkStatusChange: true,
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
      onError: (error) => {
        toast({
          title: error.message,
          position: "bottom",
          isClosable: true,
          status: "error",
        });
      },
    }
  );

  // useErrorMessage(error);

  return {
    fetchFeed,
    loading,
    data,
  };
};

///////=======UPSERT MULTI FILE ====

const UPSERT_MULTIPLE_FILE = gql`
  mutation upsertMultiFiles($param: [UpsertFilesInput!]!) {
    upsertMultiFiles(param: $param) {
      url
      imageId
    }
  }
`;

export const useUpsertMultipleFile = () => {
  const toast = useToast();
  const { fetchFeed } = useFeedGallery();

  const [upsertMultipleFile, { loading, error, data }] = useMutation<
    FileUploadResponse,
    MultipleFileParam
  >(UPSERT_MULTIPLE_FILE, {
    onError: (error) => {
      toast({
        title: error.message,
        position: "bottom",
        isClosable: true,
        status: "error",
      });
    },
    onCompleted: () => {
      fetchFeed();
      toast({
        title: "Successfully Updated",
        position: "bottom",
        isClosable: true,
        status: "success",
      });
    },
  });

  // useErrorMessage(error);

  return {
    upsertMultipleFile,
    loading,
    data,
  };
};

//==========DELETE GALLERY ====
const DELETE_GALLERY = gql`
  mutation deleteGallery($imageIds: [String!]!) {
    deleteGallery(imageIds: $imageIds) {
      success
    }
  }
`;

export const useDeleteGallery = () => {
  const toast = useToast();
  const { fetchFeed } = useFeedGallery();

  const [fetchDeleteGallery, { loading, error, data }] = useMutation<
    BasicResponse,
    DeleteGalleryArgs
  >(DELETE_GALLERY, {
    onError: (error) => {
      toast({
        title: error.message,
        position: "bottom",
        isClosable: true,
        status: "error",
      });
    },
    onCompleted: () => {
      fetchFeed();
      // toast({
      //   title: "Success",
      //   position: "bottom",
      //   isClosable: true,
      //   status: "success",
      // });
    },
  });

  // useErrorMessage(error);

  return {
    fetchDeleteGallery,
    loading,
    data,
  };
};
//=========GET FEED Event ===
const GET_Feed_Event = gql`
  query getFeedEvents($params: GetFeedEventsInput!) {
    getFeedEvents(params: $params) {
      page
      limit
      total
      totalPage
      data {
        id
        postOwner {
          username
        }
        type
        status
        totalLikes
        totalComments
      }
    }
  }
`;

export const useFeedEvents = (body: TParamsGetFeedEvents) => {
  const toast = useToast();
  const [fetchFeedEvents, { loading, error, data }] =
    useLazyQuery<TGetFeedEvents>(GET_Feed_Event, {
      notifyOnNetworkStatusChange: true,
      errorPolicy: "all",
      variables: body,
      fetchPolicy: "cache-and-network",
      onError: (error) => {
        toast({
          title: error.message,
          position: "bottom",
          isClosable: true,
          status: "error",
        });
      },
    });

  // useErrorMessage(error);

  return {
    fetchFeedEvents,
    loading,
    data,
  };
};

// ====Update Status Feed Event ====

const UPDATE_STATUS_FEED_EVENT = gql`
  mutation updateStatusFeedEvent($params: UpdateFeedEventsInput!) {
    updateStatusFeedEvent(params: $params) {
      success
    }
  }
`;

export const useUpdateStatusFeedEvent = () => {
  const toast = useToast();

  const [fetchUpdateStatusFeedEvent, { loading, data }] = useMutation<
    StatusFeedEventResponse,
    UpdateStatusFeedEventParam
  >(UPDATE_STATUS_FEED_EVENT, {
    onError: (error) => {
      toast({
        title: error.message,
        position: "bottom",
        isClosable: true,
        status: "error",
      });
    },
    onCompleted: () => {
      toast({
        title: "Successfully Updated",
        position: "bottom",
        isClosable: true,
        status: "success",
      });
    },
  });

  // useErrorMessage(error);

  return {
    fetchUpdateStatusFeedEvent,
    loading,
    data,
  };
};

/**
 * REMOVE
 */
const MUTATION_REMOVE = gql`
  mutation deleteFeedEvent($id: String!) {
    deleteFeedEvent(id: $id) {
      success
    }
  }
`;

export const useFeedEventRemove = () => {
  const toast = useToast();
  const [FeedEventRemove, { data, loading }] = useMutation<
    BasicResponse,
    TFeedEventRemovePayload
  >(MUTATION_REMOVE, {
    onError: (error) => {
      toast({
        title: error.message,
        position: "bottom",
        isClosable: true,
        status: "error",
      });
    },
    onCompleted: () => {
      toast({
        title: "Successfully Deleted",
        position: "bottom",
        isClosable: true,
        status: "success",
      });
    },
  });

  // useErrorMessage(error);

  return {
    FeedEventRemove,
    data,
    loading,
  };
};

const CREATE_LIVE_FEED = gql`
  mutation postingFeedEvent($params: PostingFeedEventInput!) {
    postingFeedEvent(params: $params) {
      id
    }
  }
`;

export const useCreateLiveFeed = () => {
  const toast = useToast();
  const [createLiveFeed, { data, loading }] = useMutation<
    LiveFeedResponse,
    CreateLiveFeedInput
  >(CREATE_LIVE_FEED, {
    onError: (error) => {
      toast({
        title: error.message,
        position: "bottom",
        isClosable: true,
        status: "error",
      });
    },
  });

  return {
    createLiveFeed,
    data,
    loading,
  };
};

const UPDATE_LIVE_FEED = gql`
  mutation updateStatusFeedEvent($params: UpdateFeedEventsInput!) {
    updateStatusFeedEvent(params: $params) {
      success
    }
  }
`;

export const useUpdateLiveFeed = () => {
  const toast = useToast();
  const [updateLiveFeed, { data, loading }] = useMutation<
    BasicResponse,
    UpdateLiveFeedInput
  >(UPDATE_LIVE_FEED, {
    onError: (error) => {
      toast({
        title: error.message,
        position: "bottom",
        isClosable: true,
        status: "error",
      });
    },
    onCompleted: () => {
      toast({
        title: "Successfully Updated",
        position: "bottom",
        isClosable: true,
        status: "success",
      });
    },
  });

  return {
    updateLiveFeed,
    data,
    loading,
  };
};
