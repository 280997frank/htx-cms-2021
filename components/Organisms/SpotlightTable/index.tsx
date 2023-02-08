import ConfirmDialog from "@/components/Atoms/ConfirmDialog";
import Pagination from "@/components/Atoms/Pagination";
import SearchInput from "@/components/Atoms/SearchInput";
import Modal from "@/components/Molecules/Modal";
import Panel from "@/components/Molecules/Panel";
import Table from "@/components/Molecules/Table/Table";
import { BG_GRADIENT } from "@/constants/ui";
import { useModal } from "@/hooks/actionLog";
import { Permission } from "@/constants/users";
import { useSpotlightPageList, useDelete, usePublish } from "@/hooks/spotlight";
import { EPageMenu } from "@/types/actionLogs";
import { TSpotlightTable } from "@/types/spotlight";
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

const COLUMN_HEADERS = [{ name: "title", label: "TITLE" }];

const LIMIT = 10;

const SpotlightTable: FC = () => {
  const [isOpenDeleteDialog, setOpenDeleteDialog] = useState({
    openDeleteDialog: false,
    id: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const { data: IdModal, isOpen, setOpen, onClose } = useModal();

  const { fetchSpotlightList, loading, data } = useSpotlightPageList(
    currentPage,
    search,
    LIMIT
  );

  const { mutationDelete } = useDelete(currentPage, search, LIMIT);
  const { mutationPublish } = usePublish(currentPage, search, LIMIT);

  useEffect(() => {
    fetchSpotlightList();
  }, [fetchSpotlightList]);

  const totalPage = data !== undefined ? data.listSpotlights.totalPage : 1;
  const permissions = usePermissions();

  return (
    <>
      <Modal
        id={IdModal}
        isOpen={isOpen}
        onClose={onClose}
        pageMenu={EPageMenu.SPOTLIGHT}
      />
      <Panel label="">
        <Flex justifyContent="space-evenly" width="100%">
          <SearchInput onChange={(e) => setSearch(e.target.value)} />
          <Link href={`/spotlight/new`} passHref>
            <Button marginLeft="1rem" bgImage={BG_GRADIENT} color="white">
              <AiOutlinePlus fontSize="24" />
              &nbsp; Add
            </Button>
          </Link>
        </Flex>
        <Table
          loading={loading}
          columnHeaders={COLUMN_HEADERS}
          data={data !== undefined ? data.listSpotlights.spotlights : []}
          onTitleClick={(id: string, name: string) => (
            <Link href={`/spotlight/${encodeURIComponent(id)}`}>{name}</Link>
          )}
          actionButtons={(id: string, row: TSpotlightTable) => (
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
                (item) => item.name === Permission.SPOTLIGHT
              ) && (
                <ChakraSwitch
                  color={row.active ? "#00CCFF" : "#5C068C"}
                  id={id}
                  isChecked={row.active}
                  onChange={(e) =>
                    mutationPublish({
                      variables: {
                        toggleStatusSpotlightInput: {
                          id: e.currentTarget.id,
                          status: !row.active,
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
          await mutationDelete({
            variables: {
              removeSpotlightInput: {
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

export default SpotlightTable;
