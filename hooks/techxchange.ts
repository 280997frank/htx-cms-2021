import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { useErrorMessage } from "@/hooks/index";
import {
  ITechxchangeParams,
  TechxchangeRespond,
  ToggleStatusTechxchange,
  DataListTechxchange,
  DetailResponseTechxchange,
  ITechxchangeParamsUpdate,
} from "@/types/techxchange";
import { useToast } from "@chakra-ui/react";
import { useListSession } from "@/hooks/resource-center";
import { useRouter } from "next/router";

//=== GET LIST TECHXCHANGE ======
const LIST_TECHXCHANGE = gql`
  query listTechxchange($params: ListTechxchangeInput!) {
    listTechxchange(listTechxchangeInput: $params) {
      page
      limit
      total
      totalPage
      techxchanges {
        id
        title
        subTitle
        QRCodeUrl
        active
        createdAt
        techxchangeAssets {
          id
          url
        }
      }
    }
  }
`;

export const useListTechxchange = (body: any) => {
  const [fetchListTechxchange, { loading, error, data }] =
    useLazyQuery<DataListTechxchange>(LIST_TECHXCHANGE, {
      notifyOnNetworkStatusChange: true,
      errorPolicy: "all",
      variables: { params: body },
      fetchPolicy: "cache-and-network",
    });
  useErrorMessage(error);
  return {
    fetchListTechxchange,
    loading,
    data,
  };
};

// ==== CHANGE STATUS TECHXCHANGE ======
const TOGGLE_PUBLISH_TECHXCHANGE = gql`
  mutation publishTechxchange(
    $publishTechxchangeInput: PublishTechxchangeInput!
  ) {
    publishTechxchange(publishTechxchangeInput: $publishTechxchangeInput) {
      id
    }
  }
`;

export const useTogglePublishTechxchange = () => {
  const toast = useToast();
  const [fetchToggleTechxchange, { loading, error, data }] = useMutation<
    TechxchangeRespond,
    ToggleStatusTechxchange
  >(TOGGLE_PUBLISH_TECHXCHANGE, {
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
    fetchToggleTechxchange,
    loading,
    data,
  };
};

// === DELETE TECHXCHANGE ======
const DELETE_TECHXCHANGE = gql`
  mutation removeTechxchange($params: RemoveTechxchangeInput!) {
    removeTechxchange(removeTechxchangeInput: $params) {
      id
      title
      subTitle
      QRCodeUrl
      active
      techxchangeAssets {
        id
        url
      }
    }
  }
`;

export const useRemoveTechxchange = () => {
  const toast = useToast();
  const [fetchRemoveTechxchange, { loading, error, data }] = useMutation(
    DELETE_TECHXCHANGE,
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
    fetchRemoveTechxchange,
    loading,
    data,
  };
};

// === ADD TECHXCHANGE ======
const ADD_TECHXCHANGE = gql`
  mutation addTechxchange($addTechxchangeInput: AddTechxchangeInput!) {
    addTechxchange(addTechxchangeInput: $addTechxchangeInput) {
      id
      title
      subTitle
      QRCodeUrl
      active
      techxchangeAssets {
        id
        url
      }
    }
  }
`;

export const useAddTechxchange = () => {
  const toast = useToast();
  const router = useRouter();
  const [fetchAddTechxchange, { loading, error, data }] = useMutation<
    TechxchangeRespond,
    ITechxchangeParams
  >(ADD_TECHXCHANGE, {
    onCompleted: () => {
      toast({
        title: "Successfully Inserted",
        position: "bottom",
        isClosable: true,
        status: "success",
      });
      router.push("/techxchange");
    },
  });
  useErrorMessage(error);
  return {
    fetchAddTechxchange,
    loading,
    data,
  };
};

// === EDIT TECHXCHANGE ======
const EDIT_TECHXCHANGE = gql`
  mutation editTechxchange($editTechxchangeInput: EditTechxchangeInput!) {
    editTechxchange(editTechxchangeInput: $editTechxchangeInput) {
      id
      title
      subTitle
      QRCodeUrl
      active
      techxchangeAssets {
        id
        url
      }
    }
  }
`;

export const useUpdateTechxchange = () => {
  const toast = useToast();
  const router = useRouter();
  const [fetchUpdateTechxchange, { loading, error, data }] = useMutation<
    TechxchangeRespond,
    ITechxchangeParamsUpdate
  >(EDIT_TECHXCHANGE, {
    onCompleted: () => {
      toast({
        title: "Successfully Updated",
        position: "bottom",
        isClosable: true,
        status: "success",
      });
      router.push("/techxchange");
    },
  });
  useErrorMessage(error);
  return {
    fetchUpdateTechxchange,
    loading,
    data,
  };
};

// === GET BY ID TECHXCHANGE ======
const GET_BY_ID_TECHXCHANGE = gql`
  query getTechxchangeById($params: GetTechxchangeByIdInput!) {
    getTechxchangeById(getTechxchangeByIdInput: $params) {
      id
      title
      subTitle
      QRCodeUrl
      techxchangeAssets {
        id
        url
      }
    }
  }
`;

export const useGetByIdTechxchange = (id: string) => {
  const [fetchByIdTechxchange, { loading, error, data }] =
    useLazyQuery<DetailResponseTechxchange>(GET_BY_ID_TECHXCHANGE, {
      notifyOnNetworkStatusChange: true,
      errorPolicy: "all",
      variables: {
        params: { id },
      },
      fetchPolicy: "cache-and-network",
    });
  useErrorMessage(error);
  return {
    fetchByIdTechxchange,
    loading,
    data,
  };
};

// === UPLOAD TECHXCHANGE ======

// export const useUploadMultipleFile = () => {
//   const [data, setData] = useState<any>();
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<any>();
//   const token = getAccessToken();

//   const errorHandler = async (res: any) => {
//     if (!res.ok) {
//       return setError(await res.json());
//     }
//     return await res.json();
//   };

//   const fetchAPI = async (files: any) => {
//     return await fetch(
//       `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/uploadFiles`,
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: files,
//       }
//     );
//   };

//   const uploadMultiFiles = async (params: any) => {
//     setLoading(true);
//     let formData = new FormData();
//     params.files.map((item: any) => {
//       formData.append("files", item);
//     });
//     formData.append("folder", params.folder);
//     await fetchAPI(formData)
//       .then(errorHandler)
//       .then((response) => {
//         setData(response);
//         setLoading(false);
//       })
//       .catch((error) => {
//         setError(error);
//         setLoading(false);
//       });
//   };

//   useErrorMessage(error);
//   return {
//     uploadMultiFiles,
//     loading,
//     data,
//   };
// };
