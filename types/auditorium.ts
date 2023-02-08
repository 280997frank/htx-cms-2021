export interface AuditoriumPageResponse {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
  sessions: {
    id: string;
    title: string;
    speakers: {
      fullname: string;
    }[];
    isActive: boolean;
    startDate: string;
    endDate: string;
  }[];
}

export interface AuditoriumFormInitial {
  description: string;
  endDate: string;
  endTime: string;
  getStreamId: string;
  livestreamUrl: string;
  resources: { url: string | File }[];
  slido: string;
  speakers: [];
  startDate: string;
  startTime: string;
  tags: [];
  thumbnailUrl: File | string;
  timezoneNameEnd: string;
  timezoneNameStart: string;
  timezoneStart: number;
  timezoneEnd: number;
  title: string;
  offsetStart: number;
  offsetEnd: number;
}

export interface AuditoriumFormSubmit {
  addSessionInput: {
    locationType: string;
    title: string;
    description: string;
    speakers: { id: string }[];
    tags: { id: string }[];
    resources: { url: string | File }[];
    startDate: string;
    offsetStart: number;
    timezoneNameStart: string;
    endDate: string;
    offsetEnd: number;
    timezoneNameEnd: string;
    thumbnailUrl: string;
    livestreamUrl: string;
    slido: string;
    getStreamId: string;
  };
}

export interface AuditoriumFormEditSubmit {
  editSessionInput: {
    id: string;
    locationType: string;
    title: string;
    description: string;
    speakers: { id: string }[];
    tags: { id: string }[];
    resources: { url: string | File }[];
    startDate: string;
    offsetStart: number;
    timezoneNameStart: string;
    endDate: string;
    offsetEnd: number;
    timezoneNameEnd: string;
    thumbnailUrl: string;
    livestreamUrl: string;
    slido: string;
    getStreamId: string;
  };
}

export interface Auditorium {
  getSessionById: AuditoriumFormInitial;
}

export interface DeleteSessionResponse {
  id: string;
}
export interface DeleteSessionArg {
  id: string;
}

export interface PublishSessionResponse {
  id: string;
  isActive: boolean;
}
export interface PublishSessionArg {
  publishSessionInput: {
    id: string;
    isActive: boolean;
  };
}

export interface AuditoriumList extends AuditoriumPageResponse {}
