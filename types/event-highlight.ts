export enum EventHighlightOrderType {
  CREATED_AT = "CREATED_AT",
  TITLE = "TITLE",
}

export enum SortByType {
  ASC = "ASC",
  DESC = "DESC",
}

export interface RequestListEventHighlight {
  page: number;
  limit: number;
  search: DataSearch;
  filter?: {
    isActive: Boolean;
  };
  order?: {
    orderBy: EventHighlightOrderType;
    sortBy: SortByType;
  };
}

export interface DataSearch {
  keyword: string;
}

export interface ListVod {
  data: ListEventHighlight;
}

export interface DataListEventHighlight {
  listEventHighlight: ListEventHighlight;
}

export interface DetailResponseEventHighlight {
  detailEventHighlight: EventHighlightRespond;
}

export interface EventHighlightAsset {
  id?: string;
  sequence?: number;
  image: string | File;
  createdAt?: string;
  updatedAt?: string;
}
export interface TTmedias {
  id?: string;
  image: string | File;
}
export interface IEventHighlightRequest {
  id?: string;
  title: string;
  medias: TTmedias[];
}

export interface IEventHighlightParams {
  createEventHighlightInput: IEventHighlightRequest;
}

export interface IEventHighlightParamsUpdate {
  updateEventHighlightInput: IEventHighlightRequest;
}

export interface EventHighlight {
  id: string;
  title: string;
  isActive: boolean;
  eventHighlightMedia: EventHighlightAsset[];
}

export interface EventHighlightRespond {
  id: string;
  title: string;
  isActive: boolean;
  eventHighlightMedia: EventHighlightAsset[];
}

export interface ListEventHighlight {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
  eventHighlights: EventHighlightRespond[];
}

export interface ResponseToggleStatusVod {
  id: any;
}

export interface ToggleStatusEventHighlight {
  publishEventHighlightInput: PublishEventHighlightInput;
}

export interface PublishEventHighlightInput {
  id: string;
  isActive: boolean;
}
