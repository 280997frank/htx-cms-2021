export interface TInProfile {
  title: string;
  description: string;
  imageUrl: string | File;
}

export interface TInProfileTable extends TInProfile {
  id: string;
  isActive: boolean;
  likes: number;
  loves: number;
  claps: number;
  fightings: number;
}

export interface TInProfileForm extends TInProfile {
  id?: string;
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
export interface PublishProfileArg {
  param: {
    id: string;
    isActive: boolean;
  };
}

export interface InsertInProfileResponse {
  createInProfile: {
    id: string;
  };
}
export interface InsertInProfileArgs {
  param: {
    title: string;
    description: string;
    imageUrl: string;
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
