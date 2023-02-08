export enum TTypeHouse {
  ADDITION = "ADDITION",
  REDUCTION = "REDUCTION",
}
export enum TOrderBy {
  CREATED_AT = "CREATED_AT",
}
export enum TSortBY {
  ASC = "ASC",
  DESC = "DESC",
}
export interface TParamsGetHtxHouses {
  listHtxHouseInput: {
    page: number;
    limit: number;
    search: {
      keyword: string;
    };
  };
}
export interface ThtxHouseChats {
  id: string;
  message: string;
  htxHouse: THTXHouses;
  user: {
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}
export interface THTXHouses {
  id: string;
  name: string;
  point: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  htxHouseChats?: ThtxHouseChats[];
}
export interface THtxHousesResponse {
  listHtxHouse: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
    htxHouses: THTXHouses[];
  };
}
export interface THtxHousesDetailResponse {
  detailHtxHouse: THTXHouses;
}
export interface PublishHTXHousesResponse {
  id: string;
  name: string;
  isActive: boolean;
}

export interface TparamsSetPublish {
  id: string;
  isActive: boolean;
}
export interface setPublishHTXHouses {
  publishHtxHouseInput: TparamsSetPublish;
}
export interface CustomizeHTXHousesResponse {
  id: string;
  name: string;
  point: number;
  isActive: boolean;
}
export interface TParamCustomizeHTXHouses {
  id: string;
  point: number;
  type: TTypeHouse;
}
export interface CustomizeHTXHouses {
  customizeHtxHouseInput: TParamCustomizeHTXHouses;
}
export interface TParamsGetHtxHousesChat {
  listHtxHouseChatInput: {
    page: number;
    limit: number;
    order: {
      orderBy: TOrderBy;
      sortBy: TSortBY;
    };
  };
}
export interface THtxHousesResponseChat {
  listHtxHouseChat: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
    htxHouseChats: ThtxHouseChats[];
  };
}

export interface ADDHTXHouseChatResponse {
  addHtxHouseChat: ThtxHouseChats;
}
export interface PayloadAddHTXHouseChat {
  addHtxHouseChatInput: {
    message: string;
    htxHouseId: string;
  };
}

export interface DeleteHTXHouseChatResponse {
  deleteHtxHouseChat: ThtxHouseChats;
}
export interface PayloadDeleteHTXHouseChat {
  id: string;
}

export interface PayloadEditHTXHouseChat {
  editHtxHouseChatInput: {
    id: string;
    htxHouseId: string;
    message: string;
  };
}
export interface EditHTXHouseChatResponse {
  editHtxHouseChat: ThtxHouseChats;
}

//=========================////
export interface TOpenDelete {
  id: string;
  openDeleteDialog: boolean;
}
export interface TEditChat {
  isEdit: boolean;
  id: string;
  htxHouseId: string;
  message: string;
}
export interface TDataItemChat {
  Data: ThtxHouseChats;
  isEditChat: TEditChat;
  setOpenDeleteDialog: ({ id, openDeleteDialog }: TOpenDelete) => void;
  setEditChat: ({ isEdit, id, htxHouseId, message }: TEditChat) => void;
}
export interface TIntialValue {
  htxHouseId: string;
  Message: string;
}
