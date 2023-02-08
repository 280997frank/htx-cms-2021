export interface TAnnouncement {
  id: string;
  text: string;
  createdAt: string;
  updatedAt: any;
  active: boolean;
}

export interface TAnnouncementTable {
  id: string;
  text: string;
  active: boolean;
}

export interface TAnnouncementInitialValue {
  text: string;
  active: boolean;
}

interface responseAnnouncementList {
  limit: number;
  page: number;
  total: number;
  totalPage: number;
  announcements: TAnnouncementTable[];
}

export interface ResponseAnnouncementList {
  listAnnouncements: responseAnnouncementList;
}

export interface ResponseAnnouncementById {
  getAnnouncementById: TAnnouncement;
}

export interface TAnnouncementAddPayload {
  text: string;
  active: boolean;
}

export interface ResponseAnnouncementAdd {
  addAnnouncement: TAnnouncement;
}

export interface TAnnouncementEditPayload {
  id: string;
  text: string;
  active: boolean;
}

export interface ResponseAnnouncementEdit {
  editAnnouncement: TAnnouncement;
}

export interface TAnnouncementRemovePayload {
  id: string;
}

export interface TAnnouncementRemoveResponse {
  status: boolean;
}

export interface ResponseAnnouncementRemove {
  removeAnnouncement: TAnnouncementRemoveResponse;
}

export interface TAnnouncementUpdateTogglePayload {
  id: string;
  status: boolean;
}

export interface ResponseAnnouncementUpdateToggle {
  toggleStatusAnnouncement: TAnnouncement;
}
