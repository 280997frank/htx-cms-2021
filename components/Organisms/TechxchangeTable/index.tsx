import React, { FC, useEffect, useState } from "react";
import SearchInput from "@/components/Atoms/SearchInput";
import Link from "next/link";
import { BG_GRADIENT } from "@/constants/ui";
import Panel from "@/components/Molecules/Panel";
import Table from "@/components/Molecules/Table/Table";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Switch as ChakraSwitch,
} from "@chakra-ui/react";
import { IoMdTrash } from "react-icons/io";
import Pagination from "@/components/Atoms/Pagination";
import ConfirmDialog from "@/components/Atoms/ConfirmDialog";
import {
  useListTechxchange,
  useRemoveTechxchange,
  useTogglePublishTechxchange,
} from "@/hooks/techxchange";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";
import {
  RequestListTechxchange,
  TechxchangeRespond,
  TechxchangeOrderType,
  SortByType,
} from "@/types/techxchange";
import Modal from "@/components/Molecules/Modal";
import { useModal } from "@/hooks/actionLog";
import { EPageMenu } from "@/types/actionLogs";
import { MdList } from "react-icons/md";
import { usePermissions } from "@/utils";
import { Permission } from "@/constants/users";

dayjs.extend(customParseFormat);

const COLUMN_HEADERS = [
  { name: "title", label: "TITLE" },
  { name: "subTitle", label: "SUBTITLE" },
];

const TechxchangeTable: FC = ({}) => {
  const [isOpenDeleteDialog, setOpenDeleteDialog] = useState({
    openDeleteDialog: false,
    id: "",
  });

  const { data: IdModal, isOpen, setOpen, onClose } = useModal();

  const [initialListTechxchange, setInitialListTechxchange] =
    useState<RequestListTechxchange>({
      page: 1,
      limit: 10,
      search: {
        keyword: "",
      },
      order: {
        orderBy: TechxchangeOrderType.CREATED_AT,
        sortBy: SortByType.DESC,
      },
    });
  //  ==== Get List Techxchange ====
  const {
    fetchListTechxchange,
    loading: isLoadingListTechxchange,
    data: datalistTechxchange,
  } = useListTechxchange(initialListTechxchange);

  const { fetchRemoveTechxchange } = useRemoveTechxchange();
  const { fetchToggleTechxchange } = useTogglePublishTechxchange();
  const permissions = usePermissions();

  useEffect(() => {
    fetchListTechxchange();
  }, [fetchListTechxchange]);

  return (
    <>
      <Modal
        id={IdModal}
        isOpen={isOpen}
        onClose={onClose}
        pageMenu={EPageMenu.TECHXCHANGE}
      />
      <Panel label="">
        <Flex justifyContent="space-evenly" width="100%">
          <SearchInput
            onChange={(e) =>
              setInitialListTechxchange({
                ...initialListTechxchange,
                page: 1,
                search: { keyword: e.target.value },
              })
            }
          />
          <Link href={"/techxchange/detail"} passHref>
            <Button marginLeft="1rem" bgImage={BG_GRADIENT} color="white">
              Add
            </Button>
          </Link>
        </Flex>
        <Table<TechxchangeRespond>
          loading={isLoadingListTechxchange}
          columnHeaders={COLUMN_HEADERS}
          data={datalistTechxchange?.listTechxchange.techxchanges || []}
          onTitleClick={(id: string, name: string) => (
            <Link
              href={{
                pathname: "/techxchange/detail",
                query: { id: id, title: encodeURIComponent(name) },
              }}
            >
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
                (item) => item.name === Permission.TECHXCHANGE
              ) && (
                <ChakraSwitch
                  color={rowData.active ? "#00CCFF" : "#5C068C"}
                  id={id}
                  defaultChecked={rowData.active}
                  onChange={async () => {
                    await fetchToggleTechxchange({
                      variables: {
                        publishTechxchangeInput: {
                          id: rowData.id,
                          isActive: !rowData.active,
                        },
                      },
                    });
                    !rowData.active && fetchListTechxchange();
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
        onPrevClick={() => {
          if (datalistTechxchange && initialListTechxchange.page > 1) {
            setInitialListTechxchange({
              ...initialListTechxchange,
              page: initialListTechxchange.page - 1,
            });
          }
        }}
        onNextClick={() => {
          if (
            datalistTechxchange &&
            initialListTechxchange.page <
              datalistTechxchange.listTechxchange.totalPage
          ) {
            setInitialListTechxchange({
              ...initialListTechxchange,
              page: initialListTechxchange.page + 1,
            });
          }
        }}
        currentPage={datalistTechxchange?.listTechxchange.page ?? 0}
        total={datalistTechxchange?.listTechxchange.totalPage ?? 0}
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
          await fetchRemoveTechxchange({
            variables: {
              params: {
                id: isOpenDeleteDialog.id,
              },
            },
          });
          fetchListTechxchange();
        }}
        header="Delete Entry"
        body="Deleting an entry cannot be undone. Are you sure you wish to delete this entry?"
        type="delete"
      />
    </>
  );
};

export default TechxchangeTable;
