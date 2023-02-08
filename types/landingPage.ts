export interface LandingPageInput {
  id: string;
  eventTitle: string;
  emailConfigHost: string;
  emailConfigPort: string | number | null;
  emailConfigUser: string;
  emailConfigPassword: string;
  registrationUrl: string;
  otpEmailHeader: string;
  otpEmailBody: string;
  forgotEmailHeader: string;
  forgotEmailBody: string;
  otpEmailActive: boolean;
  otpSMSActive: boolean;
  heroImageUrl: File | string;
}

export interface LandingPage extends LandingPageInput {}
