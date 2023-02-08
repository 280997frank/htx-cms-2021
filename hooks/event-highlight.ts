import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { useErrorMessage } from "@/hooks/index";
import {
  IEventHighlightParams,
  EventHighlightRespond,
  ToggleStatusEventHighlight,
  DataListEventHighlight,
  DetailResponseEventHighlight,
  IEventHighlightParamsUpdate,
} from "@/types/event-highlight";
import { useToast } from "@chakra-ui/react";
import { useListSession } from "@/hooks/resource-center";
import { useRouter } from "next/router";

//=== GET LIST EventHighlight ======
const LIST_EVENTHIGHLIGHT = gql`
  query listEventHighlight($params: ListEventHighlightInput!) {
    listEventHighlight(listEventHighlightInput: $params) {
      page
      limit
      total
      totalPage
      eventHighlights {
        id
        title
        isActive
        eventHighlightMedia {
          id
          image
        }
      }
    }
  }
`;

export const useListEventHighlight = (body: any) => {
  const [fetchListEventHighlight, { loading, error, data }] =
    useLazyQuery<DataListEventHighlight>(LIST_EVENTHIGHLIGHT, {
      notifyOnNetworkStatusChange: true,
      errorPolicy: "all",
      variables: { params: body },
      fetchPolicy: "cache-and-network",
    });
  useErrorMessage(error);
  return {
    fetchListEventHighlight,
    loading,
    data,
  };
};

// ==== CHANGE STATUS EventHighlight ======
const TOGGLE_PUBLISH_EVENTHIGHLIGHT = gql`
  mutation publishEventHighlight(
    $publishEventHighlightInput: PublishEventHighlightInput!
  ) {
    publishEventHighlight(
      publishEventHighlightInput: $publishEventHighlightInput
    ) {
      id
      isActive
    }
  }
`;

export const useTogglePublishEventHighlight = () => {
  const toast = useToast();
  const [fetchToggleEventHighlight, { loading, error, data }] = useMutation<
    EventHighlightRespond,
    ToggleStatusEventHighlight
  >(TOGGLE_PUBLISH_EVENTHIGHLIGHT, {
    onCompleted: () => {
      toast({
        title: "Successfully Updated",
        position: "bottom",
        isClosable: true,
        status: "success",
      });
    },
  });
  useListSession(error);
  return {
    fetchToggleEventHighlight,
    loading,
    data,
  };
};

// === DELETE EventHighlight ======
const DELETE_EVENTHIGHLIGHT = gql`
  mutation removeEventHighlight($params: DeleteEventHighlightInput!) {
    deleteEventHighlight(deleteEventHighlightInput: $params) {
      id
      title
      eventHighlightMedia {
        id
        image
      }
    }
  }
`;

export const useRemoveEventHighlight = () => {
  const toast = useToast();
  const [fetchRemoveEventHighlight, { loading, error, data }] = useMutation(
    DELETE_EVENTHIGHLIGHT,
    {
      onCompleted: () => {
        toast({
          title: "Successfully Deleted",
          position: "bottom",
          isClosable: true,
          status: "success",
        });
      },
    }
  );
  useListSession(error);
  return {
    fetchRemoveEventHighlight,
    loading,
    data,
  };
};

// === ADD EventHighlight ======
const ADD_EVENTHIGHLIGHT = gql`
  mutation createEventHighlight(
    $createEventHighlightInput: CreateEventHighlightInput!
  ) {
    createEventHighlight(
      createEventHighlightInput: $createEventHighlightInput
    ) {
      id
      title
      isActive
      eventHighlightMedia {
        id
        image
      }
    }
  }
`;

export const useAddEventHighlight = () => {
  const toast = useToast();
  const router = useRouter();
  const [fetchAddEventHighlight, { loading, error, data }] = useMutation<
    EventHighlightRespond,
    IEventHighlightParams
  >(ADD_EVENTHIGHLIGHT, {
    notifyOnNetworkStatusChange: true,
    errorPolicy: "all",
    onCompleted: () => {
      toast({
        title: "Successfully Inserted",
        position: "bottom",
        isClosable: true,
        status: "success",
      });
      router.push("/event-highlights");
    },
  });
  useErrorMessage(error);
  return {
    fetchAddEventHighlight,
    loading,
    data,
  };
};

// === EDIT EventHighlight ======
const EDIT_EVENTHIGHLIGHT = gql`
  mutation updateEventHighlightInput(
    $updateEventHighlightInput: UpdateEventHighlightInput!
  ) {
    updateEventHighlight(
      updateEventHighlightInput: $updateEventHighlightInput
    ) {
      id
      title
      eventHighlightMedia {
        id
        sequence
        image
      }
    }
  }
`;

export const useUpdateEventHighlight = () => {
  const toast = useToast();
  const router = useRouter();
  const [fetchUpdateEventHighlight, { loading, error, data }] = useMutation<
    EventHighlightRespond,
    IEventHighlightParamsUpdate
  >(EDIT_EVENTHIGHLIGHT, {
    onCompleted: () => {
      toast({
        title: "Successfully Updated",
        position: "bottom",
        isClosable: true,
        status: "success",
      });
      router.push("/event-highlights");
    },
  });
  useErrorMessage(error);
  return {
    fetchUpdateEventHighlight,
    loading,
    data,
  };
};

// === GET BY ID EventHighlight ======
const GET_BY_ID_EVENTHIGHLIGHT = gql`
  query detailEventHighlight($id: String!) {
    detailEventHighlight(id: $id) {
      id
      title
      eventHighlightMedia {
        image
      }
    }
  }
`;

export const useGetByIdEventHighlight = (id: string) => {
  const [fetchByIdEventHighlight, { loading, error, data }] =
    useLazyQuery<DetailResponseEventHighlight>(GET_BY_ID_EVENTHIGHLIGHT, {
      notifyOnNetworkStatusChange: true,
      errorPolicy: "all",
      variables: {
        id,
      },
      fetchPolicy: "cache-and-network",
    });
  useErrorMessage(error);
  return {
    fetchByIdEventHighlight,
    loading,
    data,
  };
};
