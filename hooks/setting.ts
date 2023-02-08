import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { useErrorMessage } from "@/hooks";

import {
  DeleteTagsArg,
  DeleteTagsResponse,
  IListSettingsParams,
  SaveTagsArg,
  SaveTagsResponse,
  SettingList,
  UpsertTagsArg,
  UpsertTagsResponse,
} from "@/types/setting";
import { useToast } from "@chakra-ui/react";

interface FetchedSettingList {
  listSettings: SettingList;
}

const GET_SETTING_LIST = gql`
  query listSettings($listSettingsInput: ListSettingsInput!) {
    listSettings(listSettingsInput: $listSettingsInput) {
      settings {
        id
        name
        tags {
          id
          name
        }
      }
    }
  }
`;

export const useSettingPageList = (
  params: IListSettingsParams | null = null
) => {
  const [fetchSettingPageList, { loading, error, data }] =
    useLazyQuery<FetchedSettingList>(GET_SETTING_LIST, {
      notifyOnNetworkStatusChange: true,
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
      variables: {
        listSettingsInput: params || {},
      },
    });

  useErrorMessage(error);

  return {
    fetchSettingPageList,
    loading,
    data,
  };
};

//========== SAVE TAGS ===========
const SAVE_TAGS = gql`
  mutation saveNewTags($settingInput: SettingInput!) {
    saveNewTags(settingInput: $settingInput) {
      settings {
        name
        tags {
          id
          name
        }
      }
    }
  }
`;

export const useSaveTags = () => {
  const { fetchSettingPageList } = useSettingPageList();
  const toast = useToast();

  const [fetchSaveTags, { loading, error, data }] = useMutation<
    SaveTagsResponse,
    SaveTagsArg
  >(SAVE_TAGS, {
    onCompleted: () => {
      fetchSettingPageList();
      toast({
        title: "Success",
        position: "bottom",
        isClosable: true,
        status: "success",
      });
    },
  });

  useErrorMessage(error);

  return {
    fetchSaveTags,
    loading,
    data,
  };
};

//========== UPSERT TAGS ===========
const UPSERT_TAGS = gql`
  mutation upsertTags($upsertTagsInput: UpsertTagsInput!) {
    upsertTags(upsertTagsInput: $upsertTagsInput) {
      id
    }
  }
`;

export const useUpsertTags = () => {
  const toast = useToast();

  const { fetchSettingPageList } = useSettingPageList();
  const [mutationUpsertTags, { loading, error, data }] = useMutation<
    UpsertTagsResponse,
    UpsertTagsArg
  >(UPSERT_TAGS, {
    onCompleted: () => {
      fetchSettingPageList();
      toast({
        title: "Success",
        position: "bottom",
        isClosable: true,
        status: "success",
      });
    },
  });

  useErrorMessage(error);

  return {
    mutationUpsertTags,
    loading,
    data,
  };
};

//========== DELETE TAGS ===========
const DELETE_TAGS = gql`
  mutation deleteNotFoundTags($deleteInput: DeleteSettingInput!) {
    deleteNotFoundTags(deleteInput: $deleteInput) {
      settings {
        name
        tags {
          id
          name
        }
      }
    }
  }
`;

export const useDeleteTags = () => {
  const { fetchSettingPageList } = useSettingPageList();

  const [fetchDeleteTags, { loading, error, data }] = useMutation<
    DeleteTagsResponse,
    DeleteTagsArg
  >(DELETE_TAGS, {
    onCompleted: () => {
      fetchSettingPageList();
    },
  });

  useErrorMessage(error);

  return {
    fetchDeleteTags,
    loading,
    data,
  };
};
