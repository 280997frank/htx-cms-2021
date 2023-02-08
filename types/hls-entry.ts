export interface HLSEntryProps {
  id: string;
  comitteeId: string;
  name: string;
  timing: string;
  rank: number;
  distance: number;
  category: string;
  isActive: number;
}

export interface HSLEntryInsertProps {
  createHlscomitteeEntry: HLSEntryProps;
  createHlscomitteeEntryInput: {
    comitteeId: string;
    name: string;
    timing: string;
    rank: number;
    distance: number;
    category: string;
  };
}

export interface FetchedHLSEntryList {
  listHlscomitteeEntry: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
    search: string;
    hlscomitteeEntry: HLSEntryProps[];
  };
}

export interface PublishHLSEntryArg {
  updateStatusHlscomitteeEntryInput: {
    id: string;
    isActive: boolean;
  };
}
