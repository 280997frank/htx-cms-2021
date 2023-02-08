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
import {
  RequestListEventHighlight,
  EventHighlightRespond,
  SortByType,
  EventHighlightOrderType,
} from "@/types/event-highlight";

import {
  useListEventHighlight,
  useRemoveEventHighlight,
  useTogglePublishEventHighlight,
} from "@/hooks/event-highlight";
import { FaPlus } from "react-icons/fa";
import { MdList } from "react-icons/md";
import { useModal } from "@/hooks/actionLog";
import Modal from "@/components/Molecules/Modal";
import { EPageMenu } from "@/types/actionLogs";
import { usePermissions } from "@/utils";
import { Permission } from "@/constants/users";

const COLUMN_HEADERS = [{ name: "title", label: "TITLE" }];

const EventHighlightTable: FC = () => {
  const [isOpenDeleteDialog, setOpenDeleteDialog] = useState({
    openDeleteDialog: false,
    id: "",
  });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { data: IdModal, isOpen, onClose, setOpen } = useModal();
  const [initialListEventHighlight, setinitialListEventHighlight] =
    useState<RequestListEventHighlight>({
      page: 1,
      limit: 10,
      search: {
        keyword: "",
      },
      order: {
        orderBy: EventHighlightOrderType.CREATED_AT,
        sortBy: SortByType.DESC,
      },
    });

  const {
    fetchListEventHighlight,
    loading: isLoadingListTechxchange,
    data: datalistEventHighlight,
  } = useListEventHighlight(initialListEventHighlight);

  const { fetchRemoveEventHighlight } = useRemoveEventHighlight();
  const { fetchToggleEventHighlight } = useTogglePublishEventHighlight();
  const permissions = usePermissions();

  useEffect(() => {
    fetchListEventHighlight();
  }, [fetchListEventHighlight]);

  return (
    <>
      <Modal
        id={IdModal}
        onClose={onClose}
        isOpen={isOpen}
        pageMenu={EPageMenu.EVENT_HIGHLIGHTS}
      />
      <Panel label="">
        <Flex justifyContent="space-evenly" width="100%">
          <SearchInput
            onChange={(e) =>
              setinitialListEventHighlight({
                ...initialListEventHighlight,
                page: 1,
                search: { keyword: e.target.value },
              })
            }
          />
          <Link href={`/event-highlights/new`} passHref>
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
        <Table<EventHighlightRespond>
          loading={isLoadingListTechxchange}
          columnHeaders={COLUMN_HEADERS}
          data={
            datalistEventHighlight?.listEventHighlight.eventHighlights || []
          }
          onTitleClick={(id: string, name: string) => (
            <Link href={`/event-highlights/${encodeURIComponent(id)}`}>
              {name}
            </Link>
          )}
          actionButtons={(id: string, rowData) => (
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
                (item) => item.name === Permission.EVENT_HIGHLIGHTS
              ) && (
                <ChakraSwitch
                  id={id}
                  defaultChecked={rowData.isActive}
                  onChange={() =>
                    fetchToggleEventHighlight({
                      variables: {
                        publishEventHighlightInput: {
                          id: rowData.id,
                          isActive: !rowData.isActive,
                        },
                      },
                    })
                  }
                  display="flex"
                  alignItems="center"
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
        onPrevClick={() => {
          if (datalistEventHighlight && initialListEventHighlight.page > 1) {
            setinitialListEventHighlight({
              ...initialListEventHighlight,
              page: initialListEventHighlight.page - 1,
            });
          }
        }}
        onNextClick={() => {
          if (
            datalistEventHighlight &&
            initialListEventHighlight.page <
              datalistEventHighlight.listEventHighlight.totalPage
          ) {
            setinitialListEventHighlight({
              ...initialListEventHighlight,
              page: initialListEventHighlight.page + 1,
            });
          }
        }}
        currentPage={datalistEventHighlight?.listEventHighlight.page ?? 0}
        total={datalistEventHighlight?.listEventHighlight.totalPage ?? 0}
        onChange={(e) => console.log("aaa", e.currentTarget.value)}
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
          await fetchRemoveEventHighlight({
            variables: {
              params: {
                id: isOpenDeleteDialog.id,
              },
            },
          });
          fetchListEventHighlight();
        }}
        header="Delete Entry"
        body="Deleting an entry cannot be undone. Are you sure you wish to delete this entry?"
        type="delete"
      />
    </>
  );
};

export default EventHighlightTable;
