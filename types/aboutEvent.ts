export interface AboutEventInitialValues {
  id: string;
  eventDescription: string;
  logo: string | File;
  socialFacebook: string;
  socialFacebookActive: boolean;
  socialLinkedin: string;
  socialLinkedinActive: boolean;
  socialTwitter: string;
  socialTwitterActive: boolean;
  eventStart: string;
  eventStartTime: string;
  eventStartZone: number;
  eventEnd: string;
  eventEndTime: string;
  eventEndZone: number;
  eventStartZoneName: string;
  eventEndZoneName: string;
}

export interface AboutEventDetail {
  getAboutEvent: {
    id: string;
    logo: string | File;
    eventDescription: string;
    socialFacebook: string;
    socialFacebookActive: boolean;
    socialLinkedin: string;
    socialLinkedinActive: boolean;
    socialTwitter: string;
    socialTwitterActive: boolean;
    eventStart: string;
    eventStartZone: number;
    eventEnd: string;
    eventEndZone: number;
    eventStartZoneName: string;
    eventEndZoneName: string;
  };
}

export interface AboutEventEditValues {
  id: string;
  logo: string | File;
  eventDescription: string;
  socialFacebook: string;
  socialFacebookActive: boolean;
  socialLinkedin: string;
  socialLinkedinActive: boolean;
  socialTwitter: string;
  socialTwitterActive: boolean;
  eventStart: string;
  eventStartTime: string;
  eventStartZone: number;
  eventEnd: string;
  eventEndTime: string;
  eventEndZone: number;
  eventStartZoneName: string;
  eventEndZoneName: string;
}
