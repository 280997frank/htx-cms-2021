export interface TSpotlight {
  title: string;
  description: string;
  thumbnailUrl: string | File;
}

export interface TSpotlightTable extends TSpotlight {
  id: string;
  active: boolean;
}

export interface TSpotlightForm extends TSpotlight {
  id?: string;
}

export interface InsertSpotlightArg {
  addSpotlightInput: TSpotlight;
}

export interface InsertSpotlightResponse {
  data: {
    addSpotlight: {
      id: string;
    };
  };
}

export interface UpdateSpotlightArgs {
  editSpotlightInput: {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string;
  };
}

export interface UpdateSpotlightResponse {
  id: string;
}

export interface DeleteSpotlightResponse {
  status: boolean;
}

export interface DeleteSpotlightArg {
  removeSpotlightInput: {
    id: string;
  };
}

export interface PublishSpotlightResponse {
  toggleStatusSpotlight: {
    id: string;
  };
}
export interface PublishSpotlightArg {
  toggleStatusSpotlightInput: {
    id: string;
    status: boolean;
  };
}
