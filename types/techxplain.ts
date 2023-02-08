export interface TTechxplain {
  title: string;
  techxplainAssets?: {
    url: string;
  };
}

export interface TTechxplainTable extends TTechxplain {
  id: string;
  active: boolean;
  createdAt: string;
}

export interface TTechxplainForm extends TTechxplain {
  id: string;
  url: string;
  urls: string[] | string | File;
}

export interface DeleteTechxplainResponse {
  removeTechxplain: {
    id: string;
  };
}

export interface DeleteTechxplainArg {
  removeTechxplainInput: {
    id: string;
  };
}

export interface PublishTechxplainResponse {
  publishTechxplain: {
    id: string;
    active: boolean;
  };
}
export interface PublishTechxplainArg {
  publishTechxplainInput: {
    id: string;
    isActive: boolean;
  };
}

export interface InsertTechxplainResponse {
  addTechxplain: {
    id: string;
  };
}
export interface InsertTechxplainArg {
  addTechxplainInput: {
    title: string;
    url: string;
    urls: string[];
  };
}

export interface UpdateTechxplainResponse {
  editTechxplain: {
    id: string;
  };
}
export interface UpdateTechxplainArg {
  editTechxplainInput: {
    id: string;
    title: string;
    url: string;
    urls: string[];
  };
}
