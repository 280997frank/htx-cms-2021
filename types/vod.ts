export interface RequestListVod {
  page: number;
  limit: number;
  search: DataSearch;
}

export interface DataSearch {
  keyword: string;
}

export interface ListVod {
  data: DataListVod;
}

export interface DataListVod {
  listVod: ListVodData;
}

export interface Vod {
  id: string;
  active: boolean;
  title: string;
  url: string;
  thumbnailUrl: string;
  session?: any;
  sessionDate: Date;
}

export interface ListVodData {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
  vods: Vod[];
}

export interface ResponseToggleStatusVod {
  id: any;
}

export interface ToggleStatusVod {
  toggleStatusVodInput: RequestToggleStatusVod;
}

export interface RequestToggleStatusVod {
  status: boolean;
  id: any;
}

export interface ResponseRemoveVod {
  status: boolean;
}

export interface RemoveVod {
  removeVodInput: RequestRemoveVodInput;
}

export interface RequestRemoveVodInput {
  id: any;
}

export interface ResponseAddVod {
  addVod: DataResponseAddVod;
}

export interface DataResponseAddVod {
  id: any;
}

export interface AddVod {
  addVodInput: RequestAddVod;
}

export interface RequestAddVod {
  title: string;
  url: string;
  thumbnailUrl: string;
  session: string;
  sessionDate: string;
  sessionDateZoneName: string;
  sessionDateOffset: string;
}

export interface GetVodById {
  getVodById: ResponseGetVodById;
}

export interface ResponseGetVodById {
  id: any;
  active: boolean;
  title: string;
  url: string;
  thumbnailUrl: string;
  session: SessionGetVodById;
  sessionDate: Date;
  sessionDateZoneName: string;
  sessionDateOffset: any;
}

export interface SessionGetVodById {
  id: any;
}

export interface RequestVodById {
  id: any;
}

export interface ResponseEditVod {
  editVod: DataResponseEditVod;
}

export interface DataResponseEditVod {
  id: any;
}

export interface EditVod {
  editVodInput: RequestEditVod;
}

export interface RequestEditVod {
  id: any;
  title: string;
  url: string;
  thumbnailUrl: string;
  session: string;
  sessionDate: string;
  sessionDateZoneName: string;
  sessionDateOffset: string;
}
