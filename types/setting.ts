export interface TInput {
  id: string;
  name: string;
}

export interface SettingPageInput {
  interests: {
    id: string;
    tags: TInput[];
  };
  industry: {
    id: string;
    tags: TInput[];
  };
  topics: {
    id: string;
    tags: TInput[];
  };
}

export interface ITags {
  id: string;
  name: string;
}
export interface SettingPageResponse {
  settings: {
    name: string;
    id: string;
    tags: ITags[];
  }[];
}

export interface SaveTagsResponse extends SettingPageResponse {}
export interface SaveTagsArg {
  settingInput: SettingPageInput;
}

export interface DeleteTagsResponse extends SettingPageResponse {}
export interface DeleteTagsArg {
  deleteInput: {
    ids: string[];
  };
}

export interface SettingList extends SettingPageResponse {}

export interface IListSettingsParams {
  filter: {
    type: "INTEREST" | "INDUSTRY" | "TOPICS";
  };
}

export interface UpsertTagsArg {
  upsertTagsInput: {
    id: string;
    settingId: string;
    name: string;
  };
}

export interface UpsertTagsResponse {
  upsertTags: {
    id: string;
  };
}
