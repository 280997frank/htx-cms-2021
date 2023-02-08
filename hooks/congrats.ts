import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { useErrorMessage } from "@/hooks/index";
import {
  AddCongrats,
  DataListCongrats,
  EditCongrats,
  GetCongratsById,
  RemoveCongrats,
  ResponseAddCongrats,
  ResponseEditCongrats,
  ResponseDetailCongrats,
  ResponseRemoveCongrats,
  ResponseToggleStatusCongrats,
  ToggleStatusCongrats,
  ResponseUpdateStatusCongrats,
  RequestUpdateStatusCongrats,
} from "@/types/congrats";
import { useToast } from "@chakra-ui/react";
import { useListSession } from "@/hooks/resource-center";
import { useRouter } from "next/router";

//=== GET LIST CONGRATS ======
const LIST_CONGRATS = gql`
  query listCongrats($listCongratsInput: ListCongratsInput!) {
    listCongrats(listCongratsInput: $listCongratsInput) {
      page
      limit
      total
      totalPage
      congrats {
        id
        category
        title
        subtitle
        name
        designation
        message
        imageUrl
        like
        love
        clap
        fighting
        isActive
        createdAt
      }
    }
  }
`;

export const useListCongrats = (body: any) => {
  const [fetchListCongrats, { loading, error, data }] =
    useLazyQuery<DataListCongrats>(LIST_CONGRATS, {
      notifyOnNetworkStatusChange: true,
      errorPolicy: "all",
      variables: body,
      fetchPolicy: "cache-and-network",
    });

  useErrorMessage(error);
  return {
    fetchListCongrats,
    loading,
    data,
  };
};

//=== GET CONGRATS BY ID ======
const GET_CONGRATS_BY_ID = gql`
  query detailCongrats($detailCongratsInput: DetailCongratsInput!) {
    detailCongrats(detailCongratsInput: $detailCongratsInput) {
      id
      category
      title
      subtitle
      name
      email
      designation
      message
      imageUrl
      like
      love
      clap
      fighting
      isActive
    }
  }
`;

export const useDetailCongrats = (body: any) => {
  const [fetchDetailCongrats, { loading, error, data }] =
    useLazyQuery<GetCongratsById>(GET_CONGRATS_BY_ID, {
      notifyOnNetworkStatusChange: true,
      errorPolicy: "all",
      variables: body,
      fetchPolicy: "cache-and-network",
    });

  useErrorMessage(error);
  return {
    fetchDetailCongrats,
    loading,
    data,
  };
};

// ==== CHANGE STATUS CONGRATS ======
const TOGGLE_STATUS_CONGRATS = gql`
  mutation toggleStatusCongrats(
    $toggleStatusCongratsInput: ToggleStatusCongratsInput!
  ) {
    toggleStatusCongrats(
      toggleStatusCongratsInput: $toggleStatusCongratsInput
    ) {
      id
    }
  }
`;

export const useToggleStatusCongrats = () => {
  const toast = useToast();
  const [fetchToggleStatusCongrats, { loading, error, data }] = useMutation<
    ResponseToggleStatusCongrats,
    ToggleStatusCongrats
  >(TOGGLE_STATUS_CONGRATS, {
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
    fetchToggleStatusCongrats,
    loading,
    data,
  };
};

// === DELETE CONGRATS ======
const REMOVE_CONGRATS = gql`
  mutation deleteCongrats($detailCongratsInput: DetailCongratsInput!) {
    deleteCongrats(detailCongratsInput: $detailCongratsInput) {
      id
    }
  }
`;

export const useRemoveCongrats = () => {
  const toast = useToast();
  const [fetchRemoveCongrats, { loading, error, data }] = useMutation<
    ResponseRemoveCongrats,
    RemoveCongrats
  >(REMOVE_CONGRATS, {
    onCompleted: () => {
      toast({
        title: "Successfully Deleted",
        position: "bottom",
        isClosable: true,
        status: "success",
      });
    },
  });
  useListSession(error);
  return {
    fetchRemoveCongrats,
    loading,
    data,
  };
};

// === ADD CONGRATS ======
const CREATE_CONGRATS = gql`
  mutation createCongrats($createCongratsInput: CreateCongratsInput!) {
    createCongrats(createCongratsInput: $createCongratsInput) {
      id
    }
  }
`;

export const useCreateCongrats = () => {
  const toast = useToast();
  const [fetchCreateCongrats, { loading, error, data }] = useMutation<
    ResponseAddCongrats,
    AddCongrats
  >(CREATE_CONGRATS, {
    onCompleted: () => {
      toast({
        title: "Successfully Inserted",
        position: "bottom",
        isClosable: true,
        status: "success",
      });
    },
  });
  useListSession(error);
  return {
    fetchCreateCongrats: fetchCreateCongrats,
    loading,
    data,
  };
};

//==== EDIT CONGRATS ====
const EDIT_CONGRATS = gql`
  mutation updateCongrats($updateCongratsInput: UpdateCongratsInput!) {
    updateCongrats(updateCongratsInput: $updateCongratsInput) {
      id
    }
  }
`;

export const useEditCongrats = () => {
  const router = useRouter();
  const toast = useToast();
  const [fetchUpdateCongrats, { loading, error, data }] = useMutation<
    ResponseEditCongrats,
    EditCongrats
  >(EDIT_CONGRATS, {
    onCompleted: () => {
      router.push("/congrats");
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
    fetchUpdateCongrats,
    loading,
    data,
  };
};

//==== UPDATE STATUS CONGRATS ====
const UPDATE_STATUS_CONGRATS = gql`
  mutation updateStatusCongrats(
    $updateStatusCongratsInput: UpdateStatusCongratsInput!
  ) {
    updateStatusCongrats(
      updateStatusCongratsInput: $updateStatusCongratsInput
    ) {
      id
      isActive
    }
  }
`;

export const useUpdateStatusCongrats = () => {
  const toast = useToast();
  const router = useRouter();
  const [fetchUpdateStatusCongrats, { loading, error, data }] = useMutation<
    ResponseUpdateStatusCongrats,
    RequestUpdateStatusCongrats
  >(UPDATE_STATUS_CONGRATS, {
    onCompleted: () => {
      router.push("/congrats");
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
    fetchUpdateStatusCongrats,
    loading,
    data,
  };
};
