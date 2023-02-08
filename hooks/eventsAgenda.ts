import { useLazyQuery, useMutation, gql } from "@apollo/client";
import { useToast } from "@chakra-ui/react";
// import { useErrorMessage } from "@/hooks";
import {
  TGetEventsAgenda,
  TGetLocations,
  TParamsGetEventsAgenda,
  TParamsGetLocations,
  UpdateLocationEventAgendaParam,
  LocationEventAgendaResponse,
  PublishEventAgendaResponse,
  setPublishAgendaParam,
  TEventAgendaRemovePayload,
  TEventAgendaRemoveResponse,
} from "@/types/eventsAgenda";

//=========GET Event Agenda===
const GET_Event_Agenda = gql`
  query listSession($listSessionInput: ListSessionInput!) {
    listSession(listSessionInput: $listSessionInput) {
      page
      limit
      total
      totalPage
      sessions {
        id
        title
        startDate
        endDate
        isActive
        location {
          id
          name
        }
      }
    }
  }
`;

export const useEventsAgenda = (body: TParamsGetEventsAgenda) => {
  const toast = useToast();
  const [fetchEventsAgenda, { loading, data }] = useLazyQuery<TGetEventsAgenda>(
    GET_Event_Agenda,
    {
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
    }
  );

  // useErrorMessage(error);

  return {
    fetchEventsAgenda,
    loading,
    data,
  };
};

//=========GET Location===
const GET_Locations = gql`
  query listLocation($listLocationInput: ListLocationInput!) {
    listLocation(listLocationInput: $listLocationInput) {
      page
      limit
      total
      totalPage
      locations {
        id
        name
      }
    }
  }
`;

export const useLocations = (body: TParamsGetLocations) => {
  const toast = useToast();
  const [fetchLocation, { loading, data }] = useLazyQuery<TGetLocations>(
    GET_Locations,
    {
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
    }
  );

  // useErrorMessage(error);

  return {
    fetchLocation,
    loading,
    data,
  };
};

// ==== Update Location ====
const UPDATE_LOCATION_EVENT_AGENDA = gql`
  mutation setLocation($setLocationInput: SetLocationInput!) {
    setLocation(setLocationInput: $setLocationInput) {
      id
      title
      location {
        id
        name
      }
    }
  }
`;

export const useUpdateLocationEventAgenda = () => {
  const toast = useToast();

  const [fetchUpdateLocationEventAgenda, { loading, data }] = useMutation<
    LocationEventAgendaResponse,
    UpdateLocationEventAgendaParam
  >(UPDATE_LOCATION_EVENT_AGENDA, {
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
    fetchUpdateLocationEventAgenda,
    loading,
    data,
  };
};

// ==== Update Status Publish ====
const UPDATE_STATUS_PUBLISH_EVENT_AGENDA = gql`
  mutation publishSession($publishSessionInput: PublishSessionInput!) {
    publishSession(publishSessionInput: $publishSessionInput) {
      id
      title
      isActive
    }
  }
`;

export const useSetPublishEventAgenda = () => {
  const toast = useToast();

  const [fetchSetPublishEventAgenda, { loading, data }] = useMutation<
    PublishEventAgendaResponse,
    setPublishAgendaParam
  >(UPDATE_STATUS_PUBLISH_EVENT_AGENDA, {
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
    fetchSetPublishEventAgenda,
    loading,
    data,
  };
};

/**
 * REMOVE
 */
const MUTATION_REMOVE = gql`
  mutation deleteSession($id: String!) {
    deleteSession(id: $id) {
      id
      title
    }
  }
`;

export const useEventAgendaRemove = () => {
  const toast = useToast();
  const [EventAgendaRemove, { data, loading }] = useMutation<
    TEventAgendaRemoveResponse,
    TEventAgendaRemovePayload
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
    EventAgendaRemove,
    data,
    loading,
  };
};
