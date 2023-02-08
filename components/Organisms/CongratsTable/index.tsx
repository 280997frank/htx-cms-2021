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
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";
import {
  useListCongrats,
  useUpdateStatusCongrats,
  useRemoveCongrats,
} from "@/hooks/congrats";
import { RequestListCongrats } from "@/types/congrats";
import Modal from "@/components/Molecules/Modal";
import { useModal } from "@/hooks/actionLog";
import { EPageMenu } from "@/types/actionLogs";
import { MdList } from "react-icons/md";
import { usePermissions } from "@/utils";
import { Permission } from "@/constants/users";

dayjs.extend(customParseFormat);

const COLUMN_HEADERS = [
  { name: "category", label: "CATEGORY" },
  { name: "title", label: "TITLE" },
  { name: "name", label: "NAME" },
  { name: "like", label: "LIKES" },
  { name: "love", label: "LOVES" },
  { name: "clap", label: "CLAPS" },
  { name: "fighting", label: "CHEERS" },
];

interface InitDataCongrats {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  name: string;
  designation: string;
  message: string;
  imageUrl: string;
  like: number;
  love: number;
  clap: number;
  fighting: number;
  isActive: number;
  createdAt: Date;
}

const CongratsTable: FC = ({}) => {
  const [isOpenDeleteDialog, setOpenDeleteDialog] = useState({
    openDeleteDialog: false,
    id: "",
  });
  const { data: dataModal, isOpen, onClose, setOpen } = useModal();
  const [initialListCongrats, setInitialListCongrasts] =
    useState<RequestListCongrats>({
      page: 1,
      limit: 10,
      search: {
        keyword: "",
      },
    });
  const [listCongrats, setListCongrats] = useState<InitDataCongrats[]>([]);

  const permissions = usePermissions();

  //  ==== Get List Congrats ====
  const {
    fetchListCongrats,
    loading: isLoadingListVod,
    data: datalistCongrats,
  } = useListCongrats({
    listCongratsInput: {
      page: initialListCongrats.page,
      limit: initialListCongrats.limit,
      search: {
        keyword: initialListCongrats.search.keyword,
      },
      order: {
        orderBy: "CREATED_AT",
        sortBy: "DESC",
      },
    },
  });

  useEffect(() => {
    fetchListCongrats();
  }, [fetchListCongrats, initialListCongrats]);

  useEffect(() => {
    if (datalistCongrats) {
      const data = datalistCongrats?.listCongrats.congrats;
      setListCongrats(data);
    }
  }, [datalistCongrats]);

  //==== TOGGLE STATUS CONGRATS =======
  const {
    fetchUpdateStatusCongrats,
    loading: isLoadingToggleStatusVod,
    data: dataToggleStatusVod,
  } = useUpdateStatusCongrats();

  useEffect(() => {
    fetchListCongrats();
  }, [dataToggleStatusVod, fetchListCongrats]);

  //==== REMOVE CONGRATS ====
  const {
    fetchRemoveCongrats,
    loading: isLoadingRemoveVod,
    data: dataRemoveCongrats,
  } = useRemoveCongrats();

  useEffect(() => {
    fetchListCongrats();
  }, [dataRemoveCongrats, fetchListCongrats]);

  return (
    <>
      <Modal
        onClose={onClose}
        pageMenu={EPageMenu.CONGRATS}
        id={dataModal}
        isOpen={isOpen}
      />
      <Panel label="">
        <Flex justifyContent="space-evenly" width="100%">
          <SearchInput
            onChange={(e) => {
              setInitialListCongrasts({
                page: initialListCongrats.page,
                limit: initialListCongrats.limit,
                search: {
                  keyword: e.target.value,
                },
              });
            }}
          />
          <Link href={"/congrats/details"} passHref>
            <Button marginLeft="1rem" bgImage={BG_GRADIENT} color="white">
              Add
            </Button>
          </Link>
        </Flex>
        <Table<InitDataCongrats>
          loading={false}
          columnHeaders={COLUMN_HEADERS}
          data={listCongrats}
          onTitleClick={(id: string, name: string) => (
            <Link
              href={{
                pathname: "/congrats/details",
                query: { id: id },
              }}
            >
              {name}
            </Link>
          )}
          actionButtons={(id: string, rowData: InitDataCongrats) => (
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
                (item) => item.name === Permission.CONGRATS
              ) && (
                <ChakraSwitch
                  color={rowData.isActive ? "#00CCFF" : "#5C068C"}
                  id={id}
                  isChecked={rowData.isActive === 1 ? true : false}
                  onChange={(e) =>
                    fetchUpdateStatusCongrats({
                      variables: {
                        updateStatusCongratsInput: {
                          id: rowData.id,
                          isActive: rowData.isActive === 1 ? false : true,
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
        onPrevClick={() =>
          setInitialListCongrasts({
            page: initialListCongrats.page - 1,
            limit: initialListCongrats.limit,
            search: {
              keyword: initialListCongrats.search.keyword,
            },
          })
        }
        onNextClick={() =>
          setInitialListCongrasts({
            page: initialListCongrats.page + 1,
            limit: initialListCongrats.limit,
            search: {
              keyword: initialListCongrats.search.keyword,
            },
          })
        }
        currentPage={datalistCongrats ? datalistCongrats.listCongrats.page : 1}
        total={datalistCongrats ? datalistCongrats.listCongrats.totalPage : 0}
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
        onConfirmAction={() => {
          return fetchRemoveCongrats({
            variables: {
              detailCongratsInput: {
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

export default CongratsTable;
