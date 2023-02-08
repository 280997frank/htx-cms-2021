export interface TAnnouncement {
  id: string;
  name: string;
  url: string;
  logo: any;
  active: boolean;
}

export interface TAnnouncementTable {
  id: string;
  title: string;
  active: boolean;
}

export interface TAnnouncementInitialValue {
  name: string;
  url: string;
  logo: string | File;
  active: boolean;
}

interface responseAnnouncementList {
  limit: number;
  page: number;
  total: number;
  totalPage: number;
  sponsors: TAnnouncementTable[];
}

export interface ResponseAnnouncementList {
  listSponsors: responseAnnouncementList;
}

export interface ResponseAnnouncementById {
  getSponsorById: TAnnouncement;
}

export interface TAnnouncementAddPayload {
  name: string;
  url: string;
  logo: string;
}

export interface ResponseAnnouncementAdd {
  addSponsor: TAnnouncement;
}

export interface TAnnouncementEditPayload {
  id: string;
  name: string;
  url: string;
  logo: string;
}

export interface ResponseAnnouncementEdit {
  editSponsor: TAnnouncement;
}

export interface TAnnouncementRemovePayload {
  id: string;
}

export interface TAnnouncementRemoveResponse {
  status: boolean;
}

export interface ResponseAnnouncementRemove {
  removeSponsor: TAnnouncementRemoveResponse;
}

export interface TAnnouncementUpdateTogglePayload {
  id: string;
  status: boolean;
}

export interface ResponseAnnouncementUpdateToggle {
  toggleStatusSponsor: TAnnouncement;
}
