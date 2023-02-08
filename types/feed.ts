import { MediaFolderType } from "@/types/upload";
import { IUser } from "./users";

export enum LiveFeedStatus {
  onGoing = "onGoing",
  done = "done",
}

export enum TEStatusFeedEvent {
  Approved = "Approved",
  Rejected = "Rejected",
  UnderModeration = "UnderModeration",
}
export enum TTypeFeedEvent {
  Image = "Image",
  Status = "Status",
  Poll = "Poll",
  Video = "Video",
  LiveFeed = "LiveFeed",
}
export interface TAdsImageInitialValue {
  file: File | string;
  folder: MediaFolderType;
  imageId: string;
}
export interface TGallery {
  id: string;
  url: File | string;
  folder: MediaFolderType;
}
export interface TAdsImagesInitialValues {
  feedAd: TAdsImageInitialValue[];
}
export interface TCarouselInitialValues {
  feedCarousel: TAdsImageInitialValue[];
}
export interface TAdsImagesGallery {
  feedAd: TGallery[];
  feedCarousel: TGallery[];
}
export interface TGetEventGallery {
  getFeedGallery: TAdsImagesGallery;
}
export interface TDataFeedEvents {
  id: string;
  postOwner: IUser;
  totalLikes: number;
  totalComments: number;
  status: TEStatusFeedEvent;
  type: TTypeFeedEvent;
}
export interface TFeedEvents {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
  data: TDataFeedEvents[];
}
export interface TGetFeedEvents {
  getFeedEvents: TFeedEvents;
}
