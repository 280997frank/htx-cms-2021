import ConfirmDialog from "@/components/Atoms/ConfirmDialog";
import Pagination from "@/components/Atoms/Pagination";
import SearchInput from "@/components/Atoms/SearchInput";
import Panel from "@/components/Molecules/Panel";
import Table from "@/components/Molecules/Table/Table";
import { BG_GRADIENT } from "@/constants/ui";
import Link from "next/link";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Switch as ChakraSwitch,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { FC, useEffect, useState } from "react";
import { IoMdTrash } from "react-icons/io";
import { MdList } from "react-icons/md";
import { TWhatsupTable } from "@/types/whatsup";
import {
  useWhatsupList,
  useWhatsupRemove,
  useWhatsupToggleStatus,
} from "@/hooks/whatsup";
import { dataPerPage } from "@/constants/announcement";
import { FaPlus } from "react-icons/fa";
import Modals from "@/components/Molecules/Modal";
import { useModal } from "@/hooks/actionLog";
import { EPageMenu } from "@/types/actionLogs";
import { usePermissions } from "@/utils";
import { Permission } from "@/constants/users";

const COLUMN_HEADERS = [
  { name: "title", label: "TITLE" },
  { name: "date", label: "DATE" },
];

const WhatsupTable: FC = () => {
  const [isOpenDeleteDialog, setOpenDeleteDialog] = useState({
    openDeleteDialog: false,
    id: "",
  });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [data, setData] = useState<TWhatsupTable[]>([]);
  const { isOpen, setOpen, onClose, data: dataModal } = useModal();

  const { fetchMore, response, loading } = useWhatsupList({
    page: page,
    limit: dataPerPage,
    search: search,
  });

  const { whatsupRemove, response: responseRemove } = useWhatsupRemove();
  const { whatsupToggleStatus, response: responseToggle } =
    useWhatsupToggleStatus();

  const permissions = usePermissions();

  // get whatsup
  useEffect(() => {
    fetchMore();
  }, [fetchMore]);

  // get after responseToggle
  useEffect(() => {
    if (responseToggle !== undefined) {
      fetchMore();
    }
  }, [responseToggle, fetchMore]);

  // get whatsup
  useEffect(() => {
    if (response !== undefined) {
      setData(response.listWhatsUp.whatsUps);

      // set totalPage if has no data
      let tempTotalPage = 1;
      if (response.listWhatsUp.totalPage > 0)
        tempTotalPage = response.listWhatsUp.totalPage;
      setTotalPage(tempTotalPage);

      // set page if has no data
      let tempPage = 1;
      if (response.listWhatsUp.page > 0) tempPage = response.listWhatsUp.page;
      setPage(tempPage);
    }
  }, [data, totalPage, page, response]);

  // delete whatsup
  useEffect(() => {
    if (responseRemove !== undefined && responseRemove !== null) {
      if (responseRemove.deleteWhatsUp) fetchMore();
    }
  }, [responseRemove, fetchMore]);

  return (
    <>
      <Modals
        isOpen={isOpen}
        id={dataModal}
        pageMenu={EPageMenu.WHATS_UP}
        onClose={onClose}
      />
      <Panel label="">
        <Flex justifyContent="space-evenly" width="100%">
          <SearchInput onChange={(e) => setSearch(e.target.value)} />
          <Link href={`/whats-up/new`} passHref>
            <Button
              leftIcon={<FaPlus />}
              marginLeft="1rem"
              bgImage={BG_GRADIENT}
              color="white"
            >
              Add
            </Button>
          </Link>
        </Flex>
        <Table<TWhatsupTable>
          loading={loading}
          columnHeaders={COLUMN_HEADERS}
          data={data}
          onTitleClick={(id: string, name: string) => (
            <Text fontWeight="bold">
              <Link href={`/whats-up/${encodeURIComponent(id)}`}>{name}</Link>
            </Text>
          )}
          actionButtons={(id: string, rowData: TWhatsupTable) => (
            <Flex justifyContent="flex-end">
              <IconButton
                aria-label="modal"
                icon={<MdList />}
                variant="ghost"
                size="sm"
                fontSize="1.4rem"
                mr="3px"
                onClick={() => setOpen(id)}
              />
              {permissions.some(
                (item) => item.name === Permission.WHATS_UP
              ) && (
                <ChakraSwitch
                  color={rowData.isActive ? "#00CCFF" : "#5C068C"}
                  id={id}
                  onChange={async (e) => {
                    await whatsupToggleStatus({
                      variables: {
                        id: id,
                        isActive: !rowData.isActive,
                      },
                    });
                  }}
                  display="flex"
                  alignItems="center"
                  isChecked={rowData.isActive}
                />
              )}
              {!rowData.isActive ? (
                <IconButton
                  aria-label="Remove image"
                  icon={<IoMdTrash />}
                  variant="ghost"
                  bgColor="white"
                  size="sm"
                  type="button"
                  fontSize="1.4rem"
                  onClick={() =>
                    setOpenDeleteDialog({
                      id: id,
                      openDeleteDialog: true,
                    })
                  }
                />
              ) : (
                <Box w="32px"></Box>
              )}
            </Flex>
          )}
        />
      </Panel>
      <Pagination
        onPrevClick={() => (page <= 1 ? setPage(1) : setPage(page - 1))}
        onNextClick={() =>
          page < totalPage ? setPage(page + 1) : setPage(totalPage)
        }
        total={totalPage}
        currentPage={page}
        onChange={(e) => {
          if (e.currentTarget.value === "") return;
          setPage(parseInt(e.currentTarget.value));
        }}
      />
      <ConfirmDialog
        isOpen={isOpenDeleteDialog.openDeleteDialog}
        onClose={() =>
          setOpenDeleteDialog({
            id: "",
            openDeleteDialog: false,
          })
        }
        onConfirmAction={async () => {
          await whatsupRemove({
            variables: {
              id: isOpenDeleteDialog.id,
            },
          });
        }}
        header="Delete Entry"
        body="Deleting an entry cannot be undone. Are you sure you wish to delete this entry?"
        type="delete"
      />
    </>
  );
};

export default WhatsupTable;
