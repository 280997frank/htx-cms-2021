export interface RequestListCongrats {
  page: number;
  limit: number;
  search: DataSearch;
}

export interface DataSearch {
  keyword: string;
}

export interface ListCongrats {
  data: DataListCongrats;
}

export interface DataListCongrats {
  listCongrats: ListCongratsData;
}

export interface Congrats {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  name: string;
  designation: string;
  message: string;
  imageUrl: string;
  like: number;
  love: number;
  clap: number;
  fighting: number;
  isActive: number;
  createdAt: Date;
}

export interface ListCongratsData {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
  congrats: Congrats[];
}

export interface ResponseToggleStatusCongrats {
  id: any;
}

export interface ToggleStatusCongrats {
  toggleStatusCongratsInput: RequestToggleStatusCongrats;
}

export interface RequestToggleStatusCongrats {
  status: boolean;
  id: any;
}

export interface ResponseRemoveCongrats {
  deleteCongrats: DataResponseRemoveCongrats;
}

export interface DataResponseRemoveCongrats {
  id: String;
}

export interface RemoveCongrats {
  detailCongratsInput: RequestDeleteCongratsInput;
}

export interface RequestDeleteCongratsInput {
  id: String;
}

export interface ResponseAddCongrats {
  createCongrats: DataResponseAddCongrats;
}

export interface DataResponseAddCongrats {
  id: any;
}

export interface AddCongrats {
  createCongratsInput: RequestAddCongrats;
}

export interface RequestAddCongrats {
  category: string;
  title: string;
  subtitle: string;
  name: string;
  email: string;
  designation: string;
  message: string;
  imageUrl: string;
}

export interface GetCongratsById {
  detailCongrats: ResponseDetailCongrats;
}

export interface ResponseDetailCongrats {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  name: string;
  email: string;
  designation: string;
  message: string;
  imageUrl: string;
  like: number;
  love: number;
  clap: number;
  fighting: number;
  isActive: number;
}

export interface RequestCongratsById {
  id: any;
}

export interface ResponseEditCongrats {
  updateCongrats: DataResponseEditCongrats;
}

export interface DataResponseEditCongrats {
  id: any;
}

export interface EditCongrats {
  updateCongratsInput: RequestEditCongrats;
}

export interface RequestEditCongrats {
  id: any;
  category: string;
  title: string;
  subtitle: string;
  name: string;
  email: string;
  designation: string;
  message: string;
  imageUrl: string;
}

export interface ResponseUpdateStatusCongrats {
  updateStatusCongrats: DataUpdateStatusCongrats;
}

export interface DataUpdateStatusCongrats {
  id: String;
  isActive: boolean;
}

export interface RequestUpdateStatusCongrats {
  updateStatusCongratsInput: DataRequestUpdateStatusCongrats;
}

export interface DataRequestUpdateStatusCongrats {
  id: String;
  isActive: boolean;
}
