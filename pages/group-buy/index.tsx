// import Link from "next/link";
import { IGroupBuy } from "@/types/groupBuy";
import React, { useCallback, useEffect, useState } from "react";
import { useListGroupBuy } from "@/hooks/groupBuy";
import Layout from "@/components/Templates/Layout";
import { TrashIcon } from "@/components/Atoms/Icons";
import ConfirmDialog from "@/components/Atoms/ConfirmDialog";
import Table from "@/components/Molecules/Table/Table";
import Pagination from "@/components/Atoms/Pagination";
import SearchInput from "@/components/Atoms/SearchInput";
import {
  Box,
  Flex,
  Heading,
  IconButton,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";
import withAuth from "@/utils/withAuth";

const COLUMN_HEADERS = [
  { name: "Category", label: "CATEGORY" },
  { name: "Item", label: "ITEM" },
  { name: "Brand", label: "BRAND" },
  { name: "OrderClosing", label: "ORDER BY" },
  { name: "ExpectedDelivery", label: "DELIVERY DATE" },
];

const GroupBuy: React.FC = () => {
  const {
    dataGroupBuy: { listData, totalPages, current_page },
    isLoading,
    removeData,
    requestData,
  } = useListGroupBuy();

  const [isOpenDeleteDialog, setOpenDeleteDialog] = useState({
    openDeleteDialog: false,
    id: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    search: "",
  });

  const onCloseConfirmDialog = useCallback(() => {
    setOpenDeleteDialog({
      id: "",
      openDeleteDialog: false,
    });
  }, []);

  const onConfirmDialog = useCallback(async () => {
    removeData(isOpenDeleteDialog.id);
  }, [isOpenDeleteDialog, removeData]);

  useEffect(() => {
    requestData(pagination);
  }, [pagination, requestData]);

  return (
    <Layout title="Group Buy">
      <Box h="100%" width="100%" minHeight="100vh" padding={["7", "10"]}>
        <Flex flexDir="column">
          <Heading size="xl" marginBottom="8">
            <Breadcrumb>
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink pointerEvents="none" href="/group-buy">
                  Group Buy
                </BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
          </Heading>
          <Flex
            flexDirection="column"
            bg="white"
            fontSize="16px"
            p="16px"
            border="1px solid #d7d7d7"
            borderRadius="8px"
            mt="20px"
            minHeight="50vh"
          >
            <SearchInput
              mb="20px"
              onChange={(e) =>
                setPagination({
                  ...pagination,
                  page: 1,
                  search: e.target.value,
                })
              }
              _focus={{ border: "1px solid #5C068C" }}
            />
            <Table<IGroupBuy>
              columnHeaders={COLUMN_HEADERS}
              loading={isLoading}
              data={listData}
              onTitleClick={(Id: string, Name: string) => (
                <a href={`/group-buy/${encodeURIComponent(Id)}`}>{Name}</a>
              )}
              actionButtons={(Id: string, rowData) => (
                <Flex justifyContent="flex-end">
                  <IconButton
                    aria-label="Remove image"
                    icon={<TrashIcon />}
                    variant="ghost"
                    borderRadius="5px"
                    _focus={{ border: "none" }}
                    type="button"
                    fontSize="1.4rem"
                    onClick={() => {
                      setOpenDeleteDialog({
                        openDeleteDialog: true,
                        id: Id,
                      });
                    }}
                  />
                </Flex>
              )}
            />
          </Flex>
        </Flex>
        {!!listData?.length && (
          <Pagination
            onPrevClick={() => {
              if (pagination.page > 1) {
                setPagination({ ...pagination, page: pagination.page - 1 });
              }
            }}
            onNextClick={() => {
              if (pagination.page < totalPages) {
                setPagination({ ...pagination, page: pagination.page + 1 });
              }
            }}
            total={totalPages}
            onChange={(e) => {
              if (e.target.value === "") return;
              setPagination({
                ...pagination,
                page: parseInt(e.target.value),
              });
            }}
            currentPage={current_page}
          />
        )}
        <ConfirmDialog
          isOpen={isOpenDeleteDialog.openDeleteDialog}
          onClose={onCloseConfirmDialog}
          onConfirmAction={onConfirmDialog}
          header="Delete Entry"
          body="Deleting an entry cannot be undone. Are you sure you wish to delete this entry?"
          type="delete"
        />
      </Box>
    </Layout>
  );
};

export default withAuth(GroupBuy);
