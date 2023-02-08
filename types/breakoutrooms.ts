import { MediaFolderType } from "./upload";

export interface AllSessionResponse {
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
    location: {
      id: string;
      name: string;
    };
  }[];
}

export interface LocationPageResponse {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
  locations: {
    isActive: boolean;
    id: string;
    name: string;
    locationType: string;
    sessionLocation: {
      total: number;
    };
    locationMediaUrl: string;
  }[];
}

export interface Location {
  id: string;
  name: string;
  locationType: string;
  locationMediaUrl: string;
  isActive: boolean;
  sessionLocation: {
    sessions: Session[];
    total: string;
  };
}

export interface Session {
  id: string;
  title: string;
  description: string;
  speakers: {
    id: string;
    fullname: string;
  };
  tags: {
    id: string;
    name: string;
  };
  resources: {
    url: string;
  };
  location: {
    id: string;
  };
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
}

export interface SessionFormInitial {
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

export interface SessionFormSubmit {
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

export interface SessionFormEditSubmit {
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

export interface GetSessionById {
  getSessionById: SessionFormInitial;
}

export interface LocationFormSubmit {
  addLocationInput: {
    name: string;
    locationType: string;
  };
}

export interface LocationEditFormSubmit {
  editLocationInput: {
    id: string;
    locationMediaUrl: string | File;
    locationType: "BREAKOUT_ROOM";
    name: string;
  };
}

export interface SessionFormResponse {
  id: string;
}

export interface SessionList extends AllSessionResponse {}
export interface SessionListByLocation {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
  sessions: {
    id: string;
    title: string;
    isActive: boolean;
    startDate: string;
    endDate: string;
  }[];
}

export interface LocationList extends LocationPageResponse {}
export interface GetLocation {
  getLocation: Location;
}

export interface UploadBreakoutHallResponse {
  url: string;
  imageId: string;
}

export interface UploadBreakoutHallArgs {
  param: {
    file: File | string;
    folder: MediaFolderType;
    imageId: string;
  }[];
}

export interface GetBreakoutHallGalleryResponse {
  getGalleries: {
    url: string;
    id: string;
  }[];
}

export interface GetBreakoutHallGalleryArgs {
  getGalleryInput: {
    folder: string;
  };
}

export const LocationInitialValues = {
  name: "",
  locationMediaUrl: "",
};
