export interface HLSProps {
  id: string;
  title: string;
  date: string;
  thumbnail: string;
  isActive: number;
}

export interface FetchedHLSList {
  listHlscomittee: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
    search: string;
    hlscomittee: HLSProps[];
  };
}

export interface PublishHLSArg {
  updateStatusHlscomitteeInput: {
    id: string;
    isActive: boolean;
  };
}

export interface createHlscomitteeInput {
  title: string;
  date: string;
  thumbnail: string;
}

export interface HLSFormProps {
  loading: boolean;
  slug: string | string[] | undefined;
}

export interface SubmitHLSCommittee {
  title: string;
  date: string;
  thumbnail: any;
}

export interface InsertHLSArgs {
  createHlscomitteeInput: createHlscomitteeInput;
}
