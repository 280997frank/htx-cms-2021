export interface TWhatsup {
  id: string;
  title: string;
  image: string;
  date: string;
  registerBy: string;
  venueName: string;
  contactName: string;
  contactPhone: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TWhatsupTable {
  id: string;
  title: string;
  date: string;
  registerBy: string;
  venueName: string;
  contactName: string;
  contactPhone: string;
  isActive: boolean;
}

export interface TWhatsupInitialValue {
  title: string;
  image: string | File;
  date: string;
  dDate: string;
  tDate: string;
  dRegisterBy: string;
  tRegisterBy: string;
  registerBy: string;
  venueName: string;
  contactName: string;
  contactPhone: string;
}

interface responseWhatsupList {
  limit: number;
  page: number;
  total: number;
  totalPage: number;
  whatsUps: TWhatsupTable[];
}

export interface ResponseWhatsupList {
  listWhatsUp: responseWhatsupList;
}

export interface ResponseWhatsupById {
  detailWhatsUp: TWhatsup;
}

export interface TWhatsupAddPayload {
  title: string;
  image: string;
  date: string;
  registerBy: string;
  venueName: string;
  contactName: string;
  contactPhone: string;
}

export interface ResponseWhatsupAdd {
  createWhatsUp: TWhatsup;
}

export interface TWhatsupEditPayload {
  id: string;
  title: string;
  image: string;
  date: string;
  registerBy: string;
  venueName: string;
  contactName: string;
  contactPhone: string;
}

export interface ResponseWhatsupEdit {
  updateWhatsUp: TWhatsup;
}

export interface TWhatsupRemovePayload {
  id: string;
}

export interface TWhatsupRemoveResponse {
  status: boolean;
}

export interface ResponseWhatsupRemove {
  deleteWhatsUp: TWhatsup;
}

export interface TWhatsupUpdateTogglePayload {
  id: string;
  isActive: boolean;
}

export interface ResponseWhatsupUpdateToggle {
  publishWhatsUp: TWhatsup;
}
