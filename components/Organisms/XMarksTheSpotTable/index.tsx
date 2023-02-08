import ConfirmDialog from "@/components/Atoms/ConfirmDialog";
import Pagination from "@/components/Atoms/Pagination";
import SearchInput from "@/components/Atoms/SearchInput";
import Modal from "@/components/Molecules/Modal";
import Panel from "@/components/Molecules/Panel";
import Table from "@/components/Molecules/Table/Table";
import { BG_GRADIENT } from "@/constants/ui";
import { useModal } from "@/hooks/actionLog";
import { Permission } from "@/constants/users";
import {
  useXMarksTheSpotPageList,
  useDelete,
  usePublish,
} from "@/hooks/xmarksthespot";
import { EPageMenu } from "@/types/actionLogs";
import { TXMarksTheSpotTable } from "@/types/xmarksthespot";
import { usePermissions } from "@/utils";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Switch as ChakraSwitch,
} from "@chakra-ui/react";
import Link from "next/link";
import React, { FC, useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { IoMdTrash } from "react-icons/io";
import { MdList } from "react-icons/md";

const COLUMN_HEADERS = [{ name: "question", label: "QUESTIONS" }];

const LIMIT = 10;

const XMarksTheSpotTable: FC = () => {
  const [isOpenDeleteDialog, setOpenDeleteDialog] = useState({
    openDeleteDialog: false,
    id: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const { isOpen, onClose, setOpen, data: IdModal } = useModal();

  const { fetchXMarksTheSpotList, loading, data } = useXMarksTheSpotPageList(
    currentPage,
    search,
    LIMIT
  );

  const { mutationDelete } = useDelete(currentPage, search, LIMIT);
  const { mutationPublish } = usePublish(currentPage, search, LIMIT);

  useEffect(() => {
    fetchXMarksTheSpotList();
  }, [fetchXMarksTheSpotList]);

  const totalPage = data !== undefined ? data.listXmark.totalPage : 1;
  const permissions = usePermissions();

  return (
    <>
      <Modal
        id={IdModal}
        isOpen={isOpen}
        onClose={onClose}
        pageMenu={EPageMenu.XMARKS_THE_SPOT}
      />
      <Panel label="">
        <Flex justifyContent="space-evenly" width="100%">
          <SearchInput onChange={(e) => setSearch(e.target.value)} />
          <Link href={`/xmarks-the-spot/new`} passHref>
            <Button marginLeft="1rem" bgImage={BG_GRADIENT} color="white">
              <AiOutlinePlus fontSize="24" />
              &nbsp; Add
            </Button>
          </Link>
        </Flex>
        <Table
          loading={loading}
          columnHeaders={COLUMN_HEADERS}
          data={data !== undefined ? data.listXmark.questions : []}
          onTitleClick={(id: string, name: string) => (
            <Link href={`/xmarks-the-spot/${encodeURIComponent(id)}`}>
              {name}
            </Link>
          )}
          actionButtons={(id: string, row: TXMarksTheSpotTable) => (
            <Flex justifyContent="flex-end">
              <IconButton
                aria-label="modal"
                icon={<MdList />}
                variant="ghost"
                size="sm"
                fontSize="1.4rem"
                mr="3px"
                onClick={() => setOpen(row.id)}
              />
              {permissions.some((item) => item.name === Permission.X_MARK) && (
                <ChakraSwitch
                  color={row.isActive ? "#00CCFF" : "#5C068C"}
                  id={id}
                  isChecked={row.isActive === 1}
                  onChange={(e) =>
                    mutationPublish({
                      variables: {
                        updateStatusXmarkInput: {
                          id: e.currentTarget.id,
                          isActive: !row.isActive,
                        },
                      },
                    })
                  }
                  display="flex"
                  alignItems="center"
                />
              )}

              {!row.isActive ? (
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
        onPrevClick={() =>
          currentPage <= 1 ? setCurrentPage(1) : setCurrentPage(currentPage - 1)
        }
        onNextClick={() =>
          currentPage < totalPage
            ? setCurrentPage(currentPage + 1)
            : setCurrentPage(totalPage)
        }
        total={totalPage}
        currentPage={currentPage}
        onChange={(e) => {
          if (e.currentTarget.value === "") return;
          setCurrentPage(parseInt(e.currentTarget.value));
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
          await mutationDelete({
            variables: {
              detailXmarkInput: {
                id: isOpenDeleteDialog.id,
              },
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

export default XMarksTheSpotTable;
