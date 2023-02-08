export interface TSponsors {
  id: string;
  name: string;
  url: string;
  logo: any;
  active: boolean;
}

export interface TSponsorsInitialValue {
  name: string;
  url: string;
  logo: string | File;
  active: boolean;
}

export interface TSponsorsTable {
  id: string;
  name: string;
  active: boolean;
}

interface responseSponsorList {
  limit: number;
  page: number;
  total: number;
  totalPage: number;
  sponsors: TSponsorsTable[];
}

export interface ResponseSponsorsList {
  listSponsors: responseSponsorList;
}

export interface ResponseSponsorsById {
  getSponsorById: TSponsors;
}

export interface TSponsorsAddPayload {
  name: string;
  url: string;
  logo: string;
}

export interface ResponseSponsorsAdd {
  addSponsor: TSponsors;
}

export interface TSponsorsEditPayload {
  id: string;
  name: string;
  url: string;
  logo: string;
}

export interface ResponseSponsorsEdit {
  editSponsor: TSponsors;
}

export interface TSponsorsRemovePayload {
  id: string;
}

export interface TSponsorsRemoveResponse {
  status: boolean;
}

export interface ResponseSponsorsRemove {
  removeSponsor: TSponsorsRemoveResponse;
}

export interface TSponsorsUpdateTogglePayload {
  id: string;
  status: boolean;
}

export interface ResponseSponsorsUpdateToggle {
  toggleStatusSponsor: TSponsors;
}
