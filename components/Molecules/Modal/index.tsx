import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/modal";
import React, {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  memo,
  useState,
} from "react";
import Table from "@/components/Molecules/Table/Table";
import Pagination from "@/components/Atoms/Pagination";
import { EPageMenu } from "@/types/actionLogs";
import { useListActionLog } from "@/hooks/actionLog";

interface IModals {
  // children?: ReactNode;
  onClose: () => void;
  isOpen: boolean;
  id: string;
  pageMenu: EPageMenu;
}

interface ITable {
  action: string;
  date: string;
  editedBy: string;
}

const COLUMN_HEADERS = [
  { name: "actionLog", label: "ACTION" },
  { name: "createdAt", label: "DATE/TIME" },
  { name: "name", label: "EDITED BY" },
];

const Modals: FC<IModals> = ({ onClose, isOpen, pageMenu, id }) => {
  const [list, setList] = useState<any>([]);
  const [paginate, setPaginate] = useState({ page: 1, limit: 10, pageMenu });

  const { fetchList, loading, data: listData } = useListActionLog(paginate);

  const filterPageMenu = useCallback(
    (data = []) => {
      return data
        .filter((item: any) => item.targetId === id)
        .map((item: any) => ({ ...item, name: item.user.name }));
    },
    [id]
  );

  const setDataFetch = useCallback(() => {
    fetchList();
    const lists = listData?.getLogs.data.map((item: any) => ({
      ...item,
      name: item.user.name,
    }));
    setList(lists);
  }, [fetchList, listData?.getLogs.data]);

  const nextPage = () => {
    if (listData) {
      if (listData?.getLogs?.page < listData?.getLogs?.totalPage) {
        const page = listData?.getLogs.page + 1;
        setPaginate((e) => ({ ...e, page }));
      }
    }
  };

  const prevPage = () => {
    if (listData) {
      if (listData?.getLogs?.page > 1) {
        const page = listData?.getLogs?.page - 1;
        setPaginate((e) => ({ ...e, page }));
      }
    }
  };

  const onCloseModal = () => {
    onClose();
    setPaginate((e) => ({ ...e, page: 1 }));
  };

  useEffect(() => {
    setDataFetch();
  }, [setDataFetch, paginate]);

  useEffect(() => {
    if (isOpen) {
      setPaginate((e) => ({ ...e, targetId: id }));
      setDataFetch();
    }
  }, [setDataFetch, isOpen, id]);

  return (
    <Modal
      // isCentered
      onClose={onCloseModal}
      isOpen={isOpen}
      size="2xl"
      motionPreset="slideInBottom"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Item Change Log</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Table<ITable>
            loading={loading}
            columnHeaders={COLUMN_HEADERS}
            data={list || []}
            onTitleClick={() => ""}
            actionButtons={() => ""}
          />
          <Pagination
            onPrevClick={prevPage}
            onNextClick={nextPage}
            total={listData?.getLogs.totalPage || 0}
            currentPage={listData?.getLogs.page}
            onChange={(e) => {
              ("");
            }}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default memo(Modals);
