import { IListResponse, Without } from "@/types/index";

export interface IExhibitor {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface INotification {
  id: string;
  publishDate: string;
  isPublish: boolean;
  title: string;
  description: string;
  exhibitor: IExhibitor | null;
  url: string;
  sponsorLogoUrl: string;
  createAt: string;
  updatedAt: string;
}

export interface INotificationInput {
  title: string;
  description: string;
  exhibitorId: string;
  url: string;
  sponsorLogoUrl: File | string;
}

export interface INotificationListResponse {
  listNotifications: IListResponse & {
    notifications: INotification[];
  };
}

export interface INotificationDetailResponse {
  detailNotification: Without<
    INotification,
    "publishDate" | "isPublish" | "createdAt" | "updatedAt"
  >;
}

export interface INotificationResponse {
  id: string;
}

export interface INotificationCreatePayload {
  addNotificationInput: INotificationInput;
}

export interface INotificationCreateResponse {
  addNotification: INotificationResponse;
}

export interface INotificationUpdatePayload {
  editNotificationInput: INotificationInput & {
    id: string;
  };
}

export interface INotificationUpdateResponse {
  editNotification: INotificationResponse;
}

export interface INotificationPublishPayload {
  id: string;
  isPublish: boolean;
}

export interface INotificationPublishResponse {
  publishNotification: {
    id: string;
    isPublish: boolean;
  };
}

export interface IExhibitorListResponse {
  listExhibitors: IListResponse & {
    exhibitors: IExhibitor[];
  };
}
