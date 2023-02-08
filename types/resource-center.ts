export interface PdfUrl {
  url: string;
}

export interface VideoUrl {
  url: string;
}

export interface Location {
  id: any;
  name: string;
}

export interface Session {
  id: any;
  title: string;
  location: Location;
}

export interface ResourceCenter {
  pdfUrl: PdfUrl[];
  videoUrl: VideoUrl[];
  session: Session;
  isActive: boolean;
  totalResource: number;
  id: string;
}

export interface ListResourceCenter {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
  resourceCenter: ResourceCenter[];
}

export interface DataGetListResourceCenter {
  listResourceCenter: ListResourceCenter;
}

export interface DataListSession {
  id: string;
  title: string;
  description: string;
  location: Location;
}

export interface ListSession {
  sessions: DataListSession[];
}

export interface DatalistSession {
  listSession: ListSession;
}

export interface SessionAddResourceCenter {
  title: string;
}

export interface AddResourceCenterData {
  id: string;
  session: SessionAddResourceCenter;
}

export interface ResponseResourceCenter {
  addResourceCenter: AddResourceCenterData;
}

export interface AddResourceCenter {
  addResourceCenterInput: AddResourceCenterInput;
}

export interface AddResourceCenterInput {
  sessionId: string;
  pdfUrl: dataUrl[];
  videoUrl: dataUrl[];
}

export interface deleteRC {
  deleteResourceCenter: DeleteResourceCenter;
}

export interface DeleteResourceCenter {
  id: string;
}

export interface PublishResourceCenter {
  publishResourceCenterInput: PublishResourceCenterData;
}

export interface PublishResourceCenterData {
  id: string;
  isActive: boolean;
}

export interface ResponseEditResourceCenter {
  editResourceCenter: DataResponseEditResourceCenter;
}

export interface DataResponseEditResourceCenter {
  id: any;
}

export interface EditResourceCenter {
  editResourceCenterInput: RequestEditResourceCenter;
}

export interface RequestEditResourceCenter {
  id: string;
  sessionId: string;
  pdfUrl: dataUrl[];
  videoUrl: dataUrl[];
}

export interface EditResourceCenterGeneral {
  editResourceCenterInput: RequestEditResourceCenterGeneral;
}

export interface RequestEditResourceCenterGeneral {
  pdfUrl: pdfUrlGeneral[];
  videoUrl: videoUrlGeneral[];
}

interface pdfUrlGeneral {
  name: string;
  url: string;
}

interface videoUrlGeneral {
  name: string;
  url: string;
}
export interface ResponseEditResourceCenterGeneral {
  editResourceCenter: DataResponseEditResourceCenterGeneral;
}

export interface DataResponseEditResourceCenterGeneral {
  id: any;
}

export interface dataUrl {
  name: string;
  url: string;
}

export interface DetailResourceCenterGeneral {
  id: string;
  pdfUrl: dataUrl[];
  videoUrl: dataUrl[];
}

export interface ResponseDetailResourceCenterGeneral {
  detailResourceCenterGeneral: DetailResourceCenterGeneral;
}

export interface RequestDetailResourceCenter {
  detailResourceCenter: RequestDataDetailResourceCenter;
}
export interface RequestDataDetailResourceCenter {
  id: string | any;
}
export interface ResponseDetailResourceCenter {
  detailResourceCenter: DetailResourceCenter;
}

export interface DetailResourceCenter {
  id: string;
  pdfUrl: dataUrl[];
  videoUrl: dataUrl[];
  session: DataDetailSession;
}

export interface DataDetailSession {
  id: string;
  title: string;
  location: Location;
}
