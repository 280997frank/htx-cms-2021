import { AboutEventInitialValues } from "@/types/aboutEvent";
import { AuditoriumFormInitial } from "@/types/auditorium";
import { SessionFormInitial } from "@/types/breakoutrooms";
import { LandingPageInput } from "@/types/landingPage";
import { ILobbyInitialValues } from "@/types/lobby";
import { SettingPageInput } from "@/types/setting";

export const lobbyInitialValues: ILobbyInitialValues = {
  lobbyBackground: "",
  mimeType: "",
  appId: "",
  verificationId: "",
  showLobby: {
    id: "",
    isActive: false,
  },
  showAboutEvent: {
    id: "",
    isActive: false,
  },
  showFeed: {
    id: "",
    isActive: false,
  },
  showAuditorium: {
    id: "",
    isActive: false,
  },
  showExhibitionHall: {
    id: "",
    isActive: false,
  },
  showBreakoutRoom: {
    id: "",
    isActive: false,
  },
  showRoundtable: {
    id: "",
    isActive: false,
  },
  showEventAgenda: {
    id: "",
    isActive: false,
  },
  showSpeakers: {
    id: "",
    isActive: false,
  },
  showAttendees: {
    id: "",
    isActive: false,
  },
  showResourceCenter: {
    id: "",
    isActive: false,
  },
  showVOD: {
    id: "",
    isActive: false,
  },
  showSponsors: {
    id: "",
    isActive: false,
  },
  showFeedback: {
    id: "",
    isActive: false,
  },
  showSocialWall: {
    id: "",
    isActive: false,
  },
  hotspots: [],
};

export const aboutEventInitialValues: AboutEventInitialValues = {
  id: "",
  logo: "",
  eventDescription: "",
  socialFacebook: "",
  socialFacebookActive: false,
  socialLinkedin: "",
  socialLinkedinActive: false,
  socialTwitter: "",
  socialTwitterActive: false,
  eventStart: "",
  eventStartTime: "",
  eventStartZone: 0,
  eventEnd: "",
  eventEndTime: "",
  eventEndZone: 0,
  eventStartZoneName: "",
  eventEndZoneName: "",
};

export const AuditoriumInitialValues: AuditoriumFormInitial = {
  description: "",
  endDate: "",
  endTime: "",
  getStreamId: "",
  livestreamUrl: "",
  resources: [],
  slido: "",
  speakers: [],
  startDate: "",
  startTime: "",
  tags: [],
  thumbnailUrl: "",
  timezoneNameEnd: "",
  timezoneNameStart: "",
  timezoneEnd: 0,
  timezoneStart: 0,
  title: "",
  offsetStart: 0,
  offsetEnd: 0,
};

export const SessionInitialValues: SessionFormInitial = {
  description: "",
  endDate: "",
  endTime: "",
  getStreamId: "",
  livestreamUrl: "",
  resources: [],
  slido: "",
  speakers: [],
  startDate: "",
  startTime: "",
  tags: [],
  thumbnailUrl: "",
  timezoneNameEnd: "",
  timezoneNameStart: "",
  timezoneEnd: 0,
  timezoneStart: 0,
  title: "",
  offsetStart: 0,
  offsetEnd: 0,
};

export const SettingsInitialValues: SettingPageInput = {
  interests: {
    id: "",
    tags: [],
  },
  industry: {
    id: "",
    tags: [],
  },
  topics: {
    id: "",
    tags: [],
  },
};

export const landingPageInitialValues: LandingPageInput = {
  id: "",
  eventTitle: "",
  emailConfigHost: "",
  emailConfigPort: null,
  emailConfigUser: "",
  emailConfigPassword: "",
  registrationUrl: "",
  otpEmailHeader: "",
  otpEmailBody: "",
  forgotEmailHeader: "",
  forgotEmailBody: "",
  otpEmailActive: false,
  otpSMSActive: false,
  heroImageUrl: "",
};

//===Feedback===
export const FeedBackFormInitialValue = {
  url: "",
};
//===Feedback===

//===Social Wall===
export const SocialWallFormInitialValue = {
  url: "",
};
//===Social Wall===
