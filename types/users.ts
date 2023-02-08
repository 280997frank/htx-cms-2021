import { IListResponse } from "@/types/index";
export interface IUser {
  id: string;
  email: string;
  username: string;
  password: string;
  fullname: string;
  createdAt: string;
  updatedAt: string;
  roles: "Admin" | "Attendee" | "Speaker" | "Exhibitor";
  phoneNumber: string;
  country: string;
  interests: string[];
  isActive: boolean;
  profilePicture: string;
  connection: IUserConnection;
  company: IUserCompany;
}

export interface ISocMedConection {
  isActive: boolean;
  url: string;
}

export interface IUserConnection {
  facebook: ISocMedConection;
  linkedin: ISocMedConection;
  twitter: ISocMedConection;
  link: ISocMedConection;
}

export interface IUserCompany {
  companyName: string;
  position: string;
  industry: "FMCG" | "Banking" | "Software" | "OTHERS";
  companyDescription: string;
  companyLogo: File | string;
  companyWebsite: string;
}

export enum ERole {
  Admin = "Admin",
  Attendee = "Attende",
  Exhibitor = "Exhibitor",
  Speaker = "Speaker",
}

export enum EIndustry {
  FMCG = "FMCG",
  Banking = "Banking",
  Software = "Software",
  OTHERS = "OTHERS",
}

export interface IUserListResponse {
  getUsers: IListResponse & {
    data: IUser[];
  };
}

export interface IUsersByRoleListResponse {
  listByRole: {
    users: IUser[];
  };
}

export interface IUserDetailResponse {
  getUserDetail: IUser;
}

export interface IUserInput {
  fullname: string;
  roles: string;
  country: string;
  email: string;
  phoneNumber: string;
  aboutMe: string;
  interests: string[];
  isActive: boolean;
  profilePicture: File | string;
  connection: IUserConnection;
  company: IUserCompany;
}
export interface IUserCreatePayload {
  paramRegister: IUserInput;
}

export interface IUserCreateResponse {
  id: string;
}

export interface IUserUpdatePayload {
  params: {
    fullname?: string;
    email?: string;
    roles?: string;
    country?: string;
    aboutMe?: string;
    phoneNumber?: string;
    isActive?: boolean;
    profilePicture?: File | string;
    connection?: IUserConnection;
    company?: IUserCompany;
    id: string;
  };
}

export interface IUserUpdateResponse {
  id: string;
}

export interface IUserDeleteResponse {
  success: boolean;
}
