export interface THappyBirthday {
  id: string;
  firstName: string;
  lastName: string;
  designation: string;
  birthday: string;
  isActive: number;
  createdAt: Date;
}
export interface InsertBirthdayResponse {
  id: string;
  firstName: string;
  lastName: string;
  designation: string;
  birthday: string;
  isActive: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BirthdayFormProps {
  loading: boolean;
}

export interface BirthdayInput {
  firstName: string;
  lastName: string;
  designation: string;
  birthday: string | undefined;
}

export interface HappyBirtdaySearch {
  keyword: string;
}
export interface DeleteProfileResponse {
  success: boolean;
}

export interface DeleteProfileArg {
  inProfileId: string;
}

export interface PublishProfileResponse {
  success: boolean;
}
export interface PublishBirthdayArg {
  updateStatusBirthdayInput: {
    id: string;
    isActive: boolean;
  };
}

export interface InsertBirthdayArgs {
  createBirthdayInput: {
    firstName: string;
    lastName: string;
    designation: string;
    birthday: string;
  };
}

export interface UpdateBirthdayArgs {
  updateBirthdayInput: {
    id: string | string[] | undefined;
    firstName: string;
    lastName: string;
    designation: string;
    birthday: string | undefined;
  };
}

export interface UpdateInProfileResponse {
  updateInProfile: {
    success: boolean;
  };
}
export interface UpdateInProfileArgs {
  param: {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
  };
}
