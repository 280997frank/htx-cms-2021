import { useErrorMessage } from "@/hooks";
import {
  DeleteProfileArg,
  DeleteProfileResponse,
  InsertInProfileArgs,
  InsertInProfileResponse,
  PublishProfileArg,
  PublishProfileResponse,
  TInProfileTable,
  UpdateInProfileArgs,
  UpdateInProfileResponse,
} from "@/types/inprofile";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";

// ======== LIST ============
export const useInProfilePageList = (
  page: number,
  search: string,
  limit: number
) => {
  const GET_INPROFILE_LIST = gql`
    query getInProfiles($param: GetInputInProfilesInput!) {
      getInProfiles(param: $param) {
        page
        limit
        total
        totalPage
        data {
          id
          isActive
          title
          isActive
          likes
          loves
          claps
          fightings
        }
      }
    }
  `;

  interface FetchedInProfileList {
    getInProfiles: {
      page: number;
      limit: number;
      total: number;
      totalPage: number;
      data: TInProfileTable[];
    };
  }
  const [fetchInProfileList, { loading, error, data }] =
    useLazyQuery<FetchedInProfileList>(GET_INPROFILE_LIST, {
      notifyOnNetworkStatusChange: true,
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
      nextFetchPolicy: "cache-first",
      variables: {
        param: {
          page: page,
          limit: limit,
          search: search,
        },
      },
    });

  useErrorMessage(error);

  return {
    fetchInProfileList,
    loading,
    data,
  };
};

// =============== GET BY ID ===============
export const useInProfilePageGetById = (id: string) => {
  const GET_INPROFILE_BY_ID = gql`
    query inProfileById($id: String!) {
      inProfileById(id: $id) {
        id
        title
        description
        imageUrl
        claps
        fightings
        likes
        loves
      }
    }
  `;

  interface FetchedInProfileById {
    inProfileById: {
      id: string;
      title: string;
      description: string;
      imageUrl: string;
      likes: number;
      loves: number;
      claps: number;
      fightings: number;
    };
  }

  const [fetchInProfileById, { loading, error, data }] =
    useLazyQuery<FetchedInProfileById>(GET_INPROFILE_BY_ID, {
      notifyOnNetworkStatusChange: true,
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
      variables: {
        id: id,
      },
    });

  useErrorMessage(error);

  return {
    fetchInProfileById,
    loading,
    data,
  };
};

//========== INSERT MUTATION ==========
export const useInProfileInsert = () => {
  const MUTATION_INPROFILE_INSERT = gql`
    mutation createInProfile($param: CreateInProfileInput!) {
      createInProfile(param: $param) {
        id
      }
    }
  `;
  const toast = useToast();
  const router = useRouter();

  const [mutationAddInProfile, { loading, error, data }] = useMutation<
    InsertInProfileResponse,
    InsertInProfileArgs
  >(MUTATION_INPROFILE_INSERT, {
    onCompleted: () => {
      toast({
        title: "Successfully Updated",
        position: "bottom",
        isClosable: true,
        status: "success",
      });
      router.push("/in-profile");
    },
  });

  useErrorMessage(error);

  return {
    mutationAddInProfile,
    loading,
    data,
  };
};

//========== UPDATE MUTATION ==========
export const useInProfileUpdate = () => {
  const toast = useToast();
  const router = useRouter();
  const MUTATION_INPROFILE_UPDATE = gql`
    mutation updateInProfile($param: UpdateInProfileInput!) {
      updateInProfile(param: $param) {
        success
      }
    }
  `;

  const [mutationEditInProfile, { loading, error, data }] = useMutation<
    UpdateInProfileResponse,
    UpdateInProfileArgs
  >(MUTATION_INPROFILE_UPDATE, {
    onCompleted: () => {
      toast({
        title: "Successfully Updated",
        position: "bottom",
        isClosable: true,
        status: "success",
      });
      router.push("/in-profile");
    },
  });

  useErrorMessage(error);

  return {
    mutationEditInProfile,
    loading,
    data,
  };
};

//========== DELETE =============
export const useInProfileDelete = (
  page: number,
  search: string,
  limit: number
) => {
  const DELETE_PROFILE = gql`
    mutation deleteInProfile($inProfileId: String!) {
      deleteInProfile(inProfileId: $inProfileId) {
        success
      }
    }
  `;

  const { fetchInProfileList } = useInProfilePageList(page, search, limit);
  const toast = useToast();

  const [mutationDelete, { loading, error, data }] = useMutation<
    DeleteProfileResponse,
    DeleteProfileArg
  >(DELETE_PROFILE, {
    onCompleted: () => {
      fetchInProfileList();
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
    mutationDelete,
    loading,
    data,
  };
};

//========== PUBLISH SESSION ==========
export const useInProfilePublish = (
  page: number,
  search: string,
  limit: number
) => {
  const PUBLISH_PROFILE = gql`
    mutation updateInProfile($param: UpdateInProfileInput!) {
      updateInProfile(param: $param) {
        success
      }
    }
  `;
  const { fetchInProfileList } = useInProfilePageList(page, search, limit);
  const toast = useToast();

  const [mutationPublish, { loading, error, data }] = useMutation<
    PublishProfileResponse,
    PublishProfileArg
  >(PUBLISH_PROFILE, {
    onCompleted: () => {
      fetchInProfileList();
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
    mutationPublish,
    loading,
    data,
  };
};
