import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Box,
  Heading,
  Flex,
  Button,
  Switch as ChakraSwitch,
  IconButton,
} from "@chakra-ui/react";
import { PlusIcon, TrashIcon } from "@/components/Atoms/Icons";
import SearchInput from "@/components/Atoms/SearchInput";
import Panel from "@/components/Molecules/Panel";
import Layout from "@/components/Templates/Layout";
import Table from "@/components/Molecules/Table/Table";
import ConfirmDialog from "@/components/Atoms/ConfirmDialog";
import Pagination from "@/components/Atoms/Pagination";
import { BG_GRADIENT } from "@/constants/ui";
import { INotification } from "@/types/notification";
import {
  useDeleteNotification,
  useListNotification,
  usePublishNotification,
} from "@/hooks/notification";

const COLUMN_HEADERS = [
  { name: "title", label: "TITLE" },
  { name: "publishDate", label: "PUBLISH DATE" },
];

const Notification = () => {
  const [isOpenDeleteDialog, setOpenDeleteDialog] = useState({
    openDeleteDialog: false,
    id: "",
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    search: "",
  });

  const { fetchNotification, loading, data } = useListNotification(pagination);
  const { publishNotification } = usePublishNotification();
  const { deleteNotification } = useDeleteNotification();

  useEffect(() => {
    fetchNotification();
  }, [fetchNotification]);

  return (
    <Layout title="Notification | ZodiacLive CMS">
      <Box padding={["7", "10"]}>
        <Heading as="h1" size="xl" marginBottom="8">
          Notification
        </Heading>
        <Panel label="Notification List">
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
            <Link href="/notification/new" passHref>
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
          <Panel label="">
            <Table<INotification>
              loading={loading}
              columnHeaders={COLUMN_HEADERS}
              data={data ? data.listNotifications.notifications : []}
              onTitleClick={(id: string, name: string) => (
                <Link href={`/notification/${encodeURIComponent(id)}`}>
                  {name}
                </Link>
              )}
              actionButtons={(id: string, rowData: INotification) => (
                <Flex justifyContent="flex-end">
                  <ChakraSwitch
                    id={id}
                    onChange={async (e) => {
                      await publishNotification({
                        variables: {
                          id,
                          isPublish: e.target.checked,
                        },
                      });
                      fetchNotification();
                    }}
                    colorScheme="red"
                    display="flex"
                    alignItems="center"
                    marginRight="1rem"
                    isChecked={rowData.isPublish}
                  />
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
                </Flex>
              )}
            />
            {data && (
              <Pagination
                onPrevClick={() => {
                  if (pagination.page > 1) {
                    setPagination({ ...pagination, page: pagination.page - 1 });
                  }
                }}
                onNextClick={() => {
                  if (pagination.page < data.listNotifications.totalPage) {
                    setPagination({ ...pagination, page: pagination.page + 1 });
                  }
                }}
                total={data ? data.listNotifications.totalPage : 1}
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
          </Panel>
          <ConfirmDialog
            isOpen={isOpenDeleteDialog.openDeleteDialog}
            onClose={() =>
              setOpenDeleteDialog({
                id: "",
                openDeleteDialog: false,
              })
            }
            onConfirmAction={async () => {
              await deleteNotification({
                variables: {
                  id: isOpenDeleteDialog.id,
                },
              });
              fetchNotification();
            }}
            header="Delete Entry"
            body="Deleting an entry cannot be undone. Are you sure you wish to delete this entry?"
            type="delete"
          />
        </Panel>
      </Box>
    </Layout>
  );
};

export default Notification;
