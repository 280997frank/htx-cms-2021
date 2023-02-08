import ConfirmDialog from "@/components/Atoms/ConfirmDialog";
import { PlusIcon, TrashIcon } from "@/components/Atoms/Icons";
import Pagination from "@/components/Atoms/Pagination";
import SearchInput from "@/components/Atoms/SearchInput";
import Modal from "@/components/Molecules/Modal";
import Panel from "@/components/Molecules/Panel";
import Table from "@/components/Molecules/Table/Table";
import { BG_GRADIENT } from "@/constants/ui";
import { useModal } from "@/hooks/actionLog";
import { Permission } from "@/constants/users";
import {
  useHLSPageList,
  useHLSPublish,
  useHLSDelete,
} from "@/hooks/hls-committee";
import { EPageMenu } from "@/types/actionLogs";
import { HLSProps } from "@/types/hls-committee";
import { usePermissions } from "@/utils";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Switch as ChakraSwitch,
} from "@chakra-ui/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { MdList } from "react-icons/md";

const COLUMN_HEADERS = [
  { name: "title", label: "EVENT TITLE" },
  { name: "date", label: "DATE" },
];

const HLSTable = () => {
  const [isOpenDeleteDialog, setOpenDeleteDialog] = useState({
    openDeleteDialog: false,
    id: "",
  });

  const { data: IdModal, isOpen, onClose, setOpen } = useModal();

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    search: "",
  });

  const { fetchHLSList, loading, data } = useHLSPageList(
    pagination.page,
    pagination.search,
    pagination.limit
  );

  const { mutationPublish, loading: loadingPublish } = useHLSPublish(
    pagination.page,
    pagination.search,
    pagination.limit
  );

  const { mutationDelete, loading: loadingDelete } = useHLSDelete(
    pagination.page,
    pagination.search,
    pagination.limit
  );
  const permissions = usePermissions();

  useEffect(() => {
    fetchHLSList();
  }, [fetchHLSList]);
  console.log(data, "data");
  return (
    <>
      <Modal
        pageMenu={EPageMenu.HLS_COMMITTEE}
        id={IdModal}
        isOpen={isOpen}
        onClose={onClose}
      />
      <Panel label="">
        <Flex w="full">
          <SearchInput
            onChange={(e) => {
              if (e.target.value.length > 2 || e.target.value.length === 0) {
                setPagination({
                  ...pagination,
                  search: e.target.value,
                  page: 1,
                });
              }
            }}
          />
          <Link href="/hls-committee/new" passHref>
            <Button
              marginLeft="1rem"
              color="white"
              bgGradient={BG_GRADIENT}
              leftIcon={<PlusIcon fill="white" />}
            >
              Add
            </Button>
          </Link>
        </Flex>
        <Table<HLSProps>
          loading={loading}
          columnHeaders={COLUMN_HEADERS}
          data={data !== undefined ? data.listHlscomittee.hlscomittee : []}
          onTitleClick={(id: string, name: string) => (
            <Link href={`/hls-committee/${encodeURIComponent(id)}`}>
              {name}
            </Link>
          )}
          actionButtons={(id: string, rowData: HLSProps) => (
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
                (item) => item.name === Permission.HLS_COMMITTEE
              ) && (
                <ChakraSwitch
                  color={rowData.isActive ? "#00CCFF" : "#5C068C"}
                  id={id}
                  onChange={async (e) => {
                    await mutationPublish({
                      variables: {
                        updateStatusHlscomitteeInput: {
                          id: id,
                          isActive: rowData.isActive === 0 ? true : false,
                        },
                      },
                    });
                  }}
                  display="flex"
                  alignItems="center"
                  marginRight="1rem"
                  isChecked={rowData.isActive === 1}
                />
              )}
              {!rowData.isActive ? (
                <IconButton
                  aria-label="Remove image"
                  icon={<TrashIcon />}
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
      {data && (
        <Pagination
          onPrevClick={() => {
            if (pagination.page > 1) {
              setPagination({ ...pagination, page: pagination.page - 1 });
            }
          }}
          onNextClick={() => {
            if (pagination.page < data.listHlscomittee.totalPage) {
              setPagination({ ...pagination, page: pagination.page + 1 });
            }
          }}
          total={data ? data.listHlscomittee.totalPage : 1}
          onChange={(e) => {
            if (e.target.value === "") return;
            setPagination({
              ...pagination,
              page: parseInt(e.target.value),
            });
          }}
          currentPage={pagination.page}
        />
      )}
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
              detailHlscomitteeInput: {
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

export default HLSTable;
