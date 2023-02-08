export enum TTypeAnalytics {
  WHATS_UP = "WHATS_UP",
  IN_PROFILE = "IN_PROFILE",
  CONGRATS = "CONGRATS",
  HAPPY_BIRTHDAY = "HAPPY_BIRTHDAY",
  ANNOUNCEMENT = "ANNOUNCEMENT",
  SPOTLIGHT = "SPOTLIGHT",
  GROUP_BUY = "GROUP_BUY",
  PICK_YOUR_CHOICE = "PICK_YOUR_CHOICE",
  TECHXCHANGE = "TECHXCHANGE",
  HLS_COMMITTEE = "HLS_COMMITTEE",
  EVENT_HIGHLIGHTS = "EVENT_HIGHLIGHTS",
  HTX_HOUSES = "HTX_HOUSES",
  TECHXPLAIN = "TECHXPLAIN",
  FEEDBACK = "FEEDBACK",
  CARD_AND_WISHES = "card_and_wishes",
  CARD_SENT = "card_sent",
  BEJEWELED = "bejeweled",
  DRONE_PATROL = "drone_patrol",
  FRUIT_NINJA = "fruit_ninja",
}
export interface TAnal {
  type: TTypeAnalytics;
  total: number;
}
export interface TGetAnalyticsResponse {
  whatsUp: TAnal;
  inProfile: TAnal;
  congrats: TAnal;
  hbd: TAnal;
  announcement: TAnal;
  spotlight: TAnal;
  groupBuy: TAnal;
  pickYourChoice: TAnal;
  techxchange: TAnal;
  hlsCommittee: TAnal;
  eventHighlights: TAnal;
  htxHouses: TAnal;
  techxplain: TAnal;
  feedback: TAnal;
  cardAndWishes: TAnal;
  cardSent: TAnal;
  bejeweled: TAnal;
  dronePatrol: TAnal;
  fruitNinja: TAnal;
}
export interface TParamsGetAnalytics {
  filter: {
    startDate: string;
    endDate: string;
  };
}
