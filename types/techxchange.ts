export enum TechxchangeOrderType {
  CREATED_AT = "CREATED_AT",
  TITLE = "TITLE",
  SUB_TITLE = "SUB_TITLE",
}

export enum SortByType {
  ASC = "ASC",
  DESC = "DESC",
}

export interface RequestListTechxchange {
  page: number;
  limit: number;
  search: DataSearch;
  filter?: {
    isActive: Boolean;
  };
  order?: {
    orderBy: TechxchangeOrderType;
    sortBy: SortByType;
  };
}

export interface DataSearch {
  keyword: string;
}

export interface ListVod {
  data: ListTechxchange;
}

export interface DataListTechxchange {
  listTechxchange: ListTechxchange;
}

export interface DetailResponseTechxchange {
  getTechxchangeById: TechxchangeRespond;
}

export interface TechxchangeAsset {
  id: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}

export interface ITechxchangeRequest {
  id?: string;
  title: string;
  subTitle: string;
  QRCodeUrl: string;
  urls: any[];
}

export interface ITechxchangeParams {
  addTechxchangeInput: ITechxchangeRequest;
}

export interface ITechxchangeParamsUpdate {
  editTechxchangeInput: ITechxchangeRequest;
}

export interface TechxchangeRespond {
  id: string;
  title: string;
  subTitle: string;
  QRCodeUrl: string;
  active: boolean;
  createdAt: string;
  techxchangeAssets: TechxchangeAsset[];
}

export interface ListTechxchange {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
  techxchanges: TechxchangeRespond[];
}

export interface ResponseToggleStatusVod {
  id: any;
}

export interface ToggleStatusTechxchange {
  publishTechxchangeInput: PublishTechxchangeInput;
}

export interface PublishTechxchangeInput {
  id: string;
  isActive: boolean;
}
