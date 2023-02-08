export enum FeedbackOrderType {
  CREATED_AT = "CREATED_AT",
  FEEDBACK = "FEEDBACK",
}

export enum SortByType {
  ASC = "ASC",
  DESC = "DESC",
}

export interface IFeedbackParams {
  page: number;
  limit: number;
  search: {
    keyword: string;
  };
  filter: {
    isActive: boolean;
  };
  order: {
    orderBy: FeedbackOrderType;
    sortBy: SortByType;
  };
}

export interface IFeedback {
  id: string;
  feedback: number;
  createdAt: string;
  updatedAt: string;
}

export interface TGetsFeedback {
  listFeedback: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
    feedbacks: IFeedback[];
  };
}
