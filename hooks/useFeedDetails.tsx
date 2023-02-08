import { useEffect, useMemo, useCallback, useState } from "react";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useLazyQuery, useMutation, gql } from "@apollo/client";

export enum FeedStatus {
  Approved = "Approved",
  Rejected = "Rejected",
  UnderModeration = "UnderModeration",
}

export enum FeedPostType {
  Image = "Image",
  Status = "Status",
  Poll = "Poll",
  LiveFeed = "LiveVeed",
}

type Pool = {
  option: string;
  percentage: number;
};

type User = {
  name: string;
  avatar?: string;
};

type FeedDatailsData = {
  id: string;
  status: string;
  type: FeedPostType;
  time: string;
  author: User;
  totalLikes: number;
  totalComments: number;
  post?: string;
  image?: string;
  polls?: Pool[];
};

type FeedDetailsResponse = {
  details: FeedDatailsData;
};

type ReportedComment = {
  reporter: User;
  category: string;
};

type CommentItem = {
  id: string;
  author: User;
  body: string;
  reports: ReportedComment[];
  timestamp?: string;
};

type CommentsResponse = {
  comments: CommentItem[];
};

type MutationResponse = {
  return: {
    success: boolean;
  };
};

const FEED_DETAILS_QUERY = gql`
  query getFeedDetail($id: String!) {
    details: getFeedEventDetail(id: $id) {
      id
      status
      type
      time: createdAt
      author: postOwner {
        name: fullname
        avatar: profilePicture
      }
      totalLikes
      totalComments
      post: postingText
      image: postingImage
      polls: postingPolling {
        option
        percentage
      }
    }
  }
`;

const UPDATE_FEED_STATUS = gql`
  mutation updateStatus($id: String!, $status: EStatusFeedEvent!) {
    return: updateStatusFeedEvent(params: { id: $id, status: $status }) {
      success
    }
  }
`;

const COMMENT_LIST_QUERY = gql`
  query getComments($id: String!, $search: String = "") {
    comments: findFeedEventComment(params: { id: $id, search: $search }) {
      id
      author: commentator {
        name: fullname
        avatar: profilePicture
      }
      body: comment
      reports: reportComment {
        reporter: repoter {
          name: fullname
          avatar: profilePicture
        }
        category: reportCategory
      }
    }
  }
`;

const COMMENT_DELETE_MUTATION = gql`
  mutation deleteComment($commentId: String!) {
    return: deleteFeedEventComment(commentId: $commentId) {
      success
    }
  }
`;

const useFeedDetails = () => {
  const toast = useToast();
  const {
    query: { feedId },
  } = useRouter();

  /**
   * Feed details
   */
  const [isMounted, setMounted] = useState(false);
  const [feedDetails, setFeedDetails] = useState<FeedDatailsData>({
    id: feedId as string,
    status: FeedStatus.UnderModeration,
    type: FeedPostType.Status,
    time: new Date().toISOString(),
    author: {
      name: "Unknown",
      avatar: "",
    },
    totalLikes: 0,
    totalComments: 0,
  });
  const [fetchFeedDetails, { loading: isFetching, error: isFetchError }] =
    useLazyQuery<FeedDetailsResponse>(FEED_DETAILS_QUERY, {
      onCompleted(data) {
        setFeedDetails(data?.details);
      },
    });

  const [
    updateStatusMutation,
    {
      loading: isUpdatingStatus,
      data: updateStatusReturn,
      error: isUpdatingStatusError,
    },
  ] = useMutation<MutationResponse>(UPDATE_FEED_STATUS);
  const updateStatus = useCallback(
    async (status: FeedStatus) => {
      if (!status) return;
      const { data } = await updateStatusMutation({
        variables: {
          id: feedId,
          status,
        },
      });

      if (data?.return?.success) {
        setFeedDetails((data) => ({
          ...data,
          status,
        }));
      }
    },
    [updateStatusMutation, feedId]
  );

  /**
   * Comments
   */
  const [comments, setComments] = useState<CommentItem[]>([]);
  const hasComments = useMemo(
    () => isMounted && comments.length > 0,
    [isMounted, comments]
  );
  const [
    fetchComments,
    { loading: isFetchComments, error: isFetchCommentsError },
  ] = useLazyQuery<CommentsResponse>(COMMENT_LIST_QUERY, {
    onCompleted(data) {
      const comments = data?.comments ?? [];
      setComments(
        comments.map((comment) => ({
          // TODO: replace with API, delete this array map
          timestamp: new Date().toISOString(),
          ...comment,
          children: comment.body,
        }))
      );
    },
  });

  const searchComment = useCallback(
    (search: string) => {
      setComments([]);
      fetchComments({
        variables: {
          id: feedId,
          search,
        },
      });
    },
    [feedId, fetchComments]
  );

  const [pendingCommentDelete, setPendingCommentDelete] =
    useState<CommentItem>();

  const confirmDeleteComment = useCallback(
    (id: string | null) => {
      setPendingCommentDelete(comments.find((item) => item.id === id));
    },
    [comments]
  );

  const [
    deleteCommentMutation,
    { loading: isDeletingComment, error: isDeleteCommentError },
  ] = useMutation<MutationResponse>(COMMENT_DELETE_MUTATION);
  const deleteComment = useCallback(async () => {
    if (!pendingCommentDelete) return;
    const { id: commentId } = pendingCommentDelete;
    const { data } = await deleteCommentMutation({
      variables: {
        commentId,
      },
    });

    if (data?.return?.success) {
      setComments((comments) =>
        [...comments].filter((item) => item.id !== commentId)
      );
    }
  }, [deleteCommentMutation, pendingCommentDelete]);

  // Combined loading status
  const isLoading = useMemo(
    () => !isMounted || isFetching,
    [isMounted, isFetching]
  );
  const isLoadComment = useMemo(
    () => !isMounted || isFetchComments,
    [isMounted, isFetchComments]
  );

  // Combined error status
  const error = useMemo(
    () =>
      isFetchError ||
      isFetchCommentsError ||
      isUpdatingStatusError ||
      isDeleteCommentError,
    [
      isFetchError,
      isFetchCommentsError,
      isUpdatingStatusError,
      isDeleteCommentError,
    ]
  );

  // Combined response
  const isSuccess = useMemo(
    () => updateStatusReturn?.return?.success,
    [updateStatusReturn]
  );

  useEffect(() => {
    if (isSuccess) {
      toast({
        isClosable: true,
        title: "Successfully Updated",
        position: "bottom",
        status: "success",
      });
    }
  }, [isSuccess, toast]);

  useEffect(() => {
    if (!feedId) return;

    const variables = {
      id: feedId,
    };

    fetchFeedDetails({
      variables,
    });

    fetchComments({
      variables,
    });

    // smooth hack
    const timeout = setTimeout(() => {
      setMounted(true);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [feedId, fetchFeedDetails, fetchComments]);

  return {
    feedDetails,
    updateStatus,
    comments,
    deleteComment,
    pendingCommentDelete,
    confirmDeleteComment,
    searchComment,
    hasComments,
    isLoading,
    isUpdatingStatus,
    isDeletingComment,
    isLoadComment,
    error,
  };
};

export default useFeedDetails;
