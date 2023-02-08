import ConfirmDialog from "@/components/Atoms/ConfirmDialog";
import Pagination from "@/components/Atoms/Pagination";
import SearchInput from "@/components/Atoms/SearchInput";
import Panel from "@/components/Molecules/Panel";
import Table from "@/components/Molecules/Table/Table";
import { BG_GRADIENT } from "@/constants/ui";
import { Permission } from "@/constants/users";
import {
  useTechxplainPageList,
  useTechxplainDelete,
  useTechxplainPublish,
} from "@/hooks/techxplain";
import { TTechxplainTable } from "@/types/techxplain";
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
import Modal from "@/components/Molecules/Modal";
import { useModal } from "@/hooks/actionLog";
import { EPageMenu } from "@/types/actionLogs";
import { MdList } from "react-icons/md";

const COLUMN_HEADERS = [{ name: "title", label: "TITLE" }];

const LIMIT = 10;

const TechxplainTable: FC = () => {
  const [isOpenDeleteDialog, setOpenDeleteDialog] = useState({
    openDeleteDialog: false,
    id: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const { data: IdModal, isOpen, setOpen, onClose } = useModal();

  const { fetchTechxplainList, loading, data } = useTechxplainPageList(
    currentPage,
    search,
    LIMIT
  );
  const { mutationDeleteTechxplain } = useTechxplainDelete(
    currentPage,
    search,
    LIMIT
  );
  const { mutationPublishTechxplain } = useTechxplainPublish(
    currentPage,
    search,
    LIMIT
  );
  const permissions = usePermissions();

  useEffect(() => {
    fetchTechxplainList();
  }, [fetchTechxplainList]);

  const totalPage = data !== undefined ? data.listTechxplain.totalPage : 1;

  return (
    <>
      <Modal
        pageMenu={EPageMenu.TECHXPLAIN}
        id={IdModal}
        isOpen={isOpen}
        onClose={onClose}
      />
      <Panel label="">
        <Flex justifyContent="space-evenly" width="100%">
          <SearchInput onChange={(e) => setSearch(e.target.value)} />
          <Link href={`/techxplain/new`} passHref>
            <Button marginLeft="1rem" bgImage={BG_GRADIENT} color="white">
              <AiOutlinePlus fontSize="24" />
              &nbsp; Add
            </Button>
          </Link>
        </Flex>
        <Table
          loading={loading}
          columnHeaders={COLUMN_HEADERS}
          data={data !== undefined ? data.listTechxplain.techxplains : []}
          onTitleClick={(id: string, name: string) => (
            <Link href={`/techxplain/${encodeURIComponent(id)}`}>{name}</Link>
          )}
          actionButtons={(id: string, row: TTechxplainTable) => (
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
                (item) => item.name === Permission.TECHXPLAIN
              ) && (
                <ChakraSwitch
                  color={row.active ? "#00CCFF" : "#5C068C"}
                  id={id}
                  isChecked={row.active}
                  onChange={(e) =>
                    mutationPublishTechxplain({
                      variables: {
                        publishTechxplainInput: {
                          id: e.currentTarget.id,
                          isActive: !row.active,
                        },
                      },
                    })
                  }
                  display="flex"
                  alignItems="center"
                />
              )}
              {!row.active ? (
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
          await mutationDeleteTechxplain({
            variables: {
              removeTechxplainInput: {
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

export default TechxplainTable;
