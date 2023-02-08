export enum EPageMenu {
  USERS = "USERS",
  WHATS_UP = "WHATS_UP",
  IN_PROFILE = "IN_PROFILE",
  CONGRATS = "CONGRATS",
  HAPPY_BIRTHDAY = "HAPPY_BIRTHDAY",
  XMARKS_THE_SPOT = "XMARKS_THE_SPOT",
  ANNOUNCEMENT = "ANNOUNCEMENT",
  SPOTLIGHT = "SPOTLIGHT",
  TECHXCHANGE = "TECHXCHANGE",
  EVENT_HIGHLIGHTS = "EVENT_HIGHLIGHTS",
  HLS_COMMITTEE = "HLS_COMMITTEE",
  HTX_HOUSES = "HTX_HOUSES",
  TECHXPLAIN = "TECHXPLAIN",
}

interface IDataList {
  pageMenu: EPageMenu;
  actionLog: string;
  targetId: string;
  user: {
    name: string;
  };
}

interface IListAction {
  page: number;
  limit: number;
  totalPage: number;
  data: IDataList[];
}

export interface IResponListAction {
  getLogs: IListAction;
}
