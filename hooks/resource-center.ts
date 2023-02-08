import { gql, useLazyQuery, useMutation } from "@apollo/client";
import {
  AddResourceCenter,
  DataGetListResourceCenter,
  DatalistSession,
  DeleteResourceCenter,
  EditResourceCenter,
  EditResourceCenterGeneral,
  PublishResourceCenter,
  RequestDetailResourceCenter,
  ResponseDetailResourceCenter,
  ResponseDetailResourceCenterGeneral,
  ResponseEditResourceCenter,
  ResponseEditResourceCenterGeneral,
  ResponseResourceCenter,
} from "@/types/resource-center";
import { useErrorMessage } from "@/hooks/index";
import { useToast } from "@chakra-ui/react";

/** GET LIST RESOURCE CENTER */

const GET_LIST_RESOURCE_CENTER = gql`
  query listResourceCenter($listResourceCenterInput: ListResourceCenterInput!) {
    listResourceCenter(listResourceCenterInput: $listResourceCenterInput) {
      page
      limit
      total
      totalPage
      resourceCenter {
        pdfUrl {
          url
        }
        videoUrl {
          url
        }
        session {
          id
          title
          location {
            id
            name
          }
        }
        isActive
        totalResource
        id
      }
    }
  }
`;

export const useResourceCenter = (body: any) => {
  const [fetchResourceCenter, { loading, error, data }] =
    useLazyQuery<DataGetListResourceCenter>(GET_LIST_RESOURCE_CENTER, {
      notifyOnNetworkStatusChange: true,
      errorPolicy: "all",
      variables: body,
      fetchPolicy: "cache-and-network",
    });

  useErrorMessage(error);

  return {
    fetchResourceCenter,
    loading,
    data,
  };
};

/** GET DETAIL RESOURCE CENTER */

const GET_DETAIL_RESOURCE_CENTER = gql`
  query {
    detailResourceCenter(id: "610bf7e5ae9f7755ae6b1577") {
      id
      pdfUrl {
        name
        url
      }
      videoUrl {
        name
        url
      }
      session {
        id
        title
        location {
          name
          id
        }
      }
    }
  }
`;

export const useDetailResourceCenter = (body: RequestDetailResourceCenter) => {
  const [fetchDetailResourceCenter, { loading, error, data }] =
    useLazyQuery<ResponseDetailResourceCenter>(GET_DETAIL_RESOURCE_CENTER, {
      notifyOnNetworkStatusChange: true,
      errorPolicy: "all",
      variables: body,
      fetchPolicy: "cache-and-network",
    });

  useErrorMessage(error);

  return {
    fetchDetailResourceCenter,
    loading,
    data,
  };
};

/** GET LIST SESSION */

const LIST_SESSION = gql`
  query listSession($listSessionInput: ListSessionInput!) {
    listSession(listSessionInput: $listSessionInput) {
      sessions {
        id
        title
        description
        location {
          id
          name
        }
      }
    }
  }
`;

export const useListSession = (body: any) => {
  const [fetchListSession, { loading, error, data }] =
    useLazyQuery<DatalistSession>(LIST_SESSION, {
      notifyOnNetworkStatusChange: true,
      errorPolicy: "all",
      variables: body,
      fetchPolicy: "cache-and-network",
    });

  useErrorMessage(error);

  return {
    fetchListSession,
    loading,
    data,
  };
};

/** ADD RESOURCE CENTER */

const ADD_RESOURCE_CENTER = gql`
  mutation addResourceCenter($addResourceCenterInput: AddResourceCenterInput!) {
    addResourceCenter(addResourceCenterInput: $addResourceCenterInput) {
      id
    }
  }
`;

export const useAddResourceCenter = () => {
  const toast = useToast();
  const [fetchAddResourceCenter, { loading, error, data }] = useMutation<
    ResponseResourceCenter,
    AddResourceCenter
  >(ADD_RESOURCE_CENTER, {
    onCompleted: () => {
      toast({
        title: "Add Resource Center Successfully",
        position: "bottom",
        isClosable: true,
        status: "success",
      });
    },
  });
  useListSession(error);
  return {
    fetchAddResourceCenter,
    loading,
    data,
  };
};

/** DELETE RESOURCE CENTER */

const DELETE_RESOURCE_CENTER = gql`
  mutation deleteResourceCenter($id: String!) {
    deleteResourceCenter(id: $id) {
      id
    }
  }
`;

export const useDeleteResourceCenter = () => {
  const toast = useToast();
  const [fetchDeleteResourceCenter, { loading, error, data }] = useMutation<
    ResponseResourceCenter,
    DeleteResourceCenter
  >(DELETE_RESOURCE_CENTER, {
    onCompleted: () => {
      toast({
        title: "Delete Resource Center Successfully",
        position: "bottom",
        isClosable: true,
        status: "success",
      });
    },
  });
  useListSession(error);
  return {
    fetchDeleteResourceCenter,
    loading,
    data,
  };
};

/** PUBLISH RESOURCE CENTER */
const PUBLISH_RESOURCE_CENTER = gql`
  mutation publishResourceCenter(
    $publishResourceCenterInput: PublishResourceCenterInput!
  ) {
    publishResourceCenter(
      publishResourceCenterInput: $publishResourceCenterInput
    ) {
      id
    }
  }
`;

export const usePublishResourceCenter = () => {
  const toast = useToast();
  const [fetchPublishResourceCenter, { loading, error, data }] = useMutation<
    ResponseResourceCenter,
    PublishResourceCenter
  >(PUBLISH_RESOURCE_CENTER, {
    onCompleted: () => {
      toast({
        title: "Publish Resource Center Successfully",
        position: "bottom",
        isClosable: true,
        status: "success",
      });
    },
  });
  useListSession(error);
  return {
    fetchPublishResourceCenter,
    loading,
    data,
  };
};

/** EDIT RESOURCE CENTER */
const EDIT_RESOURCE_CENTER = gql`
  mutation editResourceCenter($editResourceCenterInput: EditResourceInput!) {
    editResourceCenter(editResourceCenterInput: $editResourceCenterInput) {
      id
    }
  }
`;

export const useEditResourceCenter = () => {
  const toast = useToast();
  const [fetchEditResourceCenter, { loading, error, data }] = useMutation<
    ResponseEditResourceCenter,
    EditResourceCenter
  >(EDIT_RESOURCE_CENTER, {
    onCompleted: () => {
      toast({
        title: "Edit Resource Center Successfully",
        position: "bottom",
        isClosable: true,
        status: "success",
      });
    },
  });
  useListSession(error);
  return {
    fetchEditResourceCenter,
    loading,
    data,
  };
};

/** EDIT GENERAL RESOURCE CENTER */
const EDIT_RESOURCE_CENTER_GENERAL = gql`
  mutation editResourceCenterGeneral(
    $editResourceCenterInput: EditResourceCenterGeneralInput!
  ) {
    editResourceCenterGeneral(
      editResourceCenterInput: $editResourceCenterInput
    ) {
      id
    }
  }
`;

export const useEditResourceCenterGeneral = () => {
  const toast = useToast();
  const [fetchEditResourceCenterGeneral, { loading, error, data }] =
    useMutation<ResponseEditResourceCenterGeneral, EditResourceCenterGeneral>(
      EDIT_RESOURCE_CENTER_GENERAL,
      {
        onCompleted: () => {
          toast({
            title: "Edit Resource Center General Successfully",
            position: "bottom",
            isClosable: true,
            status: "success",
          });
        },
      }
    );
  useListSession(error);
  return {
    fetchEditResourceCenterGeneral,
    loading,
    data,
  };
};

/** GET DETAIL GENERAL RESOURCE CENTER */
const DETAIL_RESOURCE_CENTER_GENERAL = gql`
  query {
    detailResourceCenterGeneral {
      id
      pdfUrl {
        name
        url
      }
      videoUrl {
        name
        url
      }
    }
  }
`;

export const useDetailResourceCenterGeneral = (body: any) => {
  const [fetchGeneralResourceCenter, { loading, error, data }] =
    useLazyQuery<ResponseDetailResourceCenterGeneral>(
      DETAIL_RESOURCE_CENTER_GENERAL,
      {
        notifyOnNetworkStatusChange: true,
        errorPolicy: "all",
        variables: body,
        fetchPolicy: "cache-and-network",
      }
    );

  useErrorMessage(error);

  return {
    fetchGeneralResourceCenter,
    loading,
    data,
  };
};
