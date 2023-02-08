export interface HotspotData {
  index: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface IHotspot {
  x: number;
  y: number;
  width: number;
  height: number;
  file: File | string;
  url: string;
  sequence: number;
  title: string;
  mimeType: string;
}

export enum HotspotType {
  BANNER = "BANNER",
  URL = "URL",
}

interface SidebarItem {
  id: string;
  isActive: boolean;
}

export interface SidebarMenu {
  id: string;
  icon: string;
  name: string;
  url: string;
  isActive: boolean;
}

export interface Hotspot {
  sequence: number;
  x: number;
  y: number;
  width: number;
  height: number;
  hotspotType: HotspotType;
  bannerMediaUrl: string;
  url: string;
  title: string;
  mimeType: string;
}

export interface LobbyDetail {
  getLobby: {
    id: string;
    lobbyMedia: string;
    mimeType: string;
    intercomAppId: string;
    intercomSecretVerificationId: string;
    sidebarMenus: SidebarMenu[];
    hotspots: Hotspot[] | null;
  };
}

export interface ILobbyInitialValues {
  lobbyBackground: string | File;
  mimeType: string;
  appId: string;
  verificationId: string;
  showLobby: SidebarItem;
  showAboutEvent: SidebarItem;
  showFeed: SidebarItem;
  showAuditorium: SidebarItem;
  showExhibitionHall: SidebarItem;
  showBreakoutRoom: SidebarItem;
  showRoundtable: SidebarItem;
  showEventAgenda: SidebarItem;
  showSpeakers: SidebarItem;
  showAttendees: SidebarItem;
  showResourceCenter: SidebarItem;
  showVOD: SidebarItem;
  showSponsors: SidebarItem;
  showFeedback: SidebarItem;
  showSocialWall: SidebarItem;
  hotspots: IHotspot[];
}
