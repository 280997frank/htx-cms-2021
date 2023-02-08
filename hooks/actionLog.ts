import { useCallback, useState } from "react";
import { useDisclosure } from "@chakra-ui/hooks";
import { gql, useLazyQuery } from "@apollo/client";
import { useErrorMessage } from ".";
import { IResponListAction } from "@/types/actionLogs";

interface IActionlog {
  data?: {};
}

export const useModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [data, setData] = useState<any>();

  const setOpen = useCallback(
    (params = "") => {
      onOpen();
      setData(params);
    },
    [onOpen]
  );

  const setClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return {
    data,
    isOpen,
    onClose: setClose,
    setOpen,
  };
};

const QUERY_LOGS = gql`
  query getLogs($param: GetLogsInput!) {
    getLogs(param: $param) {
      page
      limit
      totalPage
      total
      data {
        id
        pageMenu
        actionLog
        targetId
        secondDuration
        createdAt
        user {
          id
          email
          name
        }
      }
    }
  }
`;

export const useListActionLog = (body: any) => {
  const [fetchList, { error, loading, data }] = useLazyQuery<IResponListAction>(
    QUERY_LOGS,
    {
      notifyOnNetworkStatusChange: true,
      errorPolicy: "all",
      variables: { param: body },
      fetchPolicy: "cache-and-network",
    }
  );

  useErrorMessage(error);
  return {
    fetchList,
    loading,
    data,
  };
};
