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
} from "@chakra-ui/react";
import React, { FC, useEffect, useState } from "react";
import { IoMdTrash } from "react-icons/io";
import { TAnnouncementTable } from "@/types/announcement";

import {
  useAnnouncementList,
  useAnnouncementRemove,
  useAnnouncementToggleStatus,
} from "@/hooks/announcement";
import { dataPerPage } from "@/constants/announcement";
import { FaPlus } from "react-icons/fa";
import { useModal } from "@/hooks/actionLog";
import Modal from "@/components/Molecules/Modal";
import { EPageMenu } from "@/types/actionLogs";
import { MdList } from "react-icons/md";
import { usePermissions } from "@/utils";
import { Permission } from "@/constants/users";

const COLUMN_HEADERS = [{ name: "text", label: "ANNOUNCEMENT" }];

const AnnouncementTable: FC = () => {
  const [isOpenDeleteDialog, setOpenDeleteDialog] = useState({
    openDeleteDialog: false,
    id: "",
  });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [data, setData] = useState<TAnnouncementTable[]>([]);
  const { data: IdModal, isOpen, onClose, setOpen } = useModal();

  const { fetchMore, response, loading } = useAnnouncementList({
    page: page,
    limit: dataPerPage,
    search: search,
  });

  const { announcementRemove, response: responseRemove } =
    useAnnouncementRemove();
  const { sponsorToggleStatus, response: responseToggle } =
    useAnnouncementToggleStatus();

  const permissions = usePermissions();

  // get sponsor
  useEffect(() => {
    fetchMore();
  }, [fetchMore]);

  // get after responseToggle
  useEffect(() => {
    if (responseToggle !== undefined) {
      fetchMore();
    }
  }, [responseToggle, fetchMore]);

  // get sponsor
  useEffect(() => {
    if (response !== undefined) {
      setData(response.listAnnouncements.announcements);

      // set totalPage if has no data
      let tempTotalPage = 1;
      if (response.listAnnouncements.totalPage > 0)
        tempTotalPage = response.listAnnouncements.totalPage;
      setTotalPage(tempTotalPage);

      // set page if has no data
      let tempPage = 1;
      if (response.listAnnouncements.page > 0)
        tempPage = response.listAnnouncements.page;
      setPage(tempPage);
    }
  }, [data, totalPage, page, response]);

  // delete sponsor
  useEffect(() => {
    if (responseRemove !== undefined && responseRemove !== null) {
      if (responseRemove.removeAnnouncement.status) fetchMore();
    }
  }, [responseRemove, fetchMore]);

  return (
    <>
      <Modal
        id={IdModal}
        pageMenu={EPageMenu.ANNOUNCEMENT}
        isOpen={isOpen}
        onClose={onClose}
      />
      <Panel label="">
        <Flex justifyContent="space-evenly" width="100%">
          <SearchInput onChange={(e) => setSearch(e.target.value)} />
          <Link href={`/announcement/new`} passHref>
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
        <Table<TAnnouncementTable>
          loading={loading}
          columnHeaders={COLUMN_HEADERS}
          data={data}
          onTitleClick={(id: string, name: string) => (
            <Link href={`/announcement/${encodeURIComponent(id)}`} passHref>
              <span
                dangerouslySetInnerHTML={{
                  __html: name,
                }}
                style={{ cursor: "pointer" }}
              />
            </Link>
          )}
          actionButtons={(id: string, rowData: TAnnouncementTable) => (
            <Flex justifyContent="flex-end">
              <IconButton
                aria-label="modal"
                icon={<MdList />}
                variant="ghost"
                size="sm"
                fontSize="1.4rem"
                mr="3px"
                onClick={() => setOpen(rowData.id)}
              />
              {permissions.some(
                (item) => item.name === Permission.ANNOUNCEMENT
              ) && (
                <ChakraSwitch
                  isChecked={rowData.active}
                  color={rowData.active ? "#00CCFF" : "#5C068C"}
                  id={id}
                  onChange={async (e) => {
                    await sponsorToggleStatus({
                      variables: {
                        id: id,
                        status: !rowData.active,
                      },
                    });
                  }}
                  display="flex"
                  alignItems="center"
                />
              )}
              {!rowData.active ? (
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
          await announcementRemove({
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

export default AnnouncementTable;
