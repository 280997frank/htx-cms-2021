export enum TLocationType {
  BREAKOUT_ROOM = "BREAKOUT_ROOM",
  AUDITORIUM = "AUDITORIUM",
  ROUNDTABLE = "ROUNDTABLE",
  EXHIBITOR_ROUNDTABLE = "EXHIBITOR_ROUNDTABLE",
}
export interface TLocations {
  id: string;
  name: string;
}
export interface TSessionEventsAgenda {
  id: string;
  title: string;
  startDate: string;
  isActive: boolean;
  location: TLocations;
  locationName: string;
  locationId: string;
}

export interface TGetEventsAgenda {
  listSession: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
    sessions: TSessionEventsAgenda[];
  };
}

export interface TFilterSessions {
  startDate: string;
  ignoreLocation: TLocationType[];
}
export interface TParamsGetEventsAgenda {
  listSessionInput: {
    page: number;
    limit: number;
    filter: TFilterSessions;
    search: {
      title: string;
    };
  };
}

// locations
export interface TFilterLocations {
  ignoreLocation: TLocationType;
}
export interface TParamsGetLocations {
  listLocationInput: {
    page: number;
    limit: number;
    filter: TFilterLocations;
    search: {
      name: string;
    };
  };
}
export interface TGetLocations {
  listLocation: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
    locations: TLocations[];
  };
}

// update location

export interface TparamsUpdateStatus {
  sessionId: string;
  locationId: string;
}
export interface UpdateLocationEventAgendaParam {
  setLocationInput: TparamsUpdateStatus;
}
export interface LocationEventAgendaResponse {
  id: string;
  title: string;
  location: {
    id: string;
    name: string;
  };
}

// set Publish

// update location

export interface TparamsSetPublish {
  id: string;
  isActive: boolean;
}
export interface setPublishAgendaParam {
  publishSessionInput: TparamsSetPublish;
}
export interface PublishEventAgendaResponse {
  id: string;
  title: string;
  isActive: boolean;
}
export interface TEventAgendaRemovePayload {
  id: string;
}

export interface TEventAgendaRemoveResponse {
  id: string;
  title: string;
}
