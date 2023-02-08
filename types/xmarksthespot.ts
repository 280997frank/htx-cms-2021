export interface TXMarksTheSpot {
  question: string;
}

export interface TXMarksTheSpotTable extends TXMarksTheSpot {
  id: string;
  isActive: number;
  createdAt: string;
}

export interface TXMarksTheSpotForm extends TXMarksTheSpot {
  id: string;
  answer: {
    id: string;
    option: string;
    count: string;
    percentage: string;
  }[];
}

export interface DeleteXMarksTheSpotArg {
  detailXmarkInput: {
    id: string;
  };
}

export interface DeleteXMarksTheSpotResponse {
  id: string;
}

export interface PublishXMarksTheSpotArg {
  updateStatusXmarkInput: {
    id: string;
    isActive: boolean;
  };
}

export interface PublishXMarksTheSpotResponse {
  id: string;
}

export interface InsertXMarksTheSpotArg {
  createXmarkInput: {
    question: string;
    answer: string[];
  };
}

export interface InsertXMarksTheSpotResponse {
  createXmark: {
    id: string;
  };
}

export interface UpdateXMarksTheSpotArg {
  updateXmarkInput: {
    id: string;
    question: string;
    isActive: boolean;
    answer: {
      id: string;
      option: string;
      count: string;
      percentage: string;
    }[];
  };
}

export interface UpdateXMarksTheSpotResponse {
  updateXmark: {
    id: string;
  };
}

export interface DetailXMarksTheSpotArg {
  detailXmarkInput: {
    id: string;
  };
}

export interface DetailXMarksTheSpotResponse {
  detailXmark: {
    id: string;
    question: string;
    isActive: number;
    answers: {
      id: string;
      option: string;
      count: string;
      percentage: string;
    }[];
  };
}
