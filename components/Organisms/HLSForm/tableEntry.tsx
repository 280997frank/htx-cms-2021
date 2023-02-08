import { TrashIcon } from "@/components/Atoms/Icons";
import Pagination from "@/components/Atoms/Pagination";
import SearchInput from "@/components/Atoms/SearchInput";
import Panel from "@/components/Molecules/Panel";
import Table from "@/components/Molecules/Table/Table";
import {
  useHLSEntryDelete,
  useHLSEntryPageList,
  useHLSEntryPublish,
} from "@/hooks/hls-entry";
import {
  Flex,
  IconButton,
  Stack,
  Switch as ChakraSwitch,
} from "@chakra-ui/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const COLUMN_HEADERS = [
  { name: "name", label: "NAME" },
  { name: "rank", label: "RANK" },
  { name: "category", label: "CATEGORY" },
  { name: "timing", label: "TIMING" },
  { name: "distance", label: "DISTANCE" },
];

const EntryTable = ({ slug, newData }: any) => {
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    search: "",
  });

  // FETCH LIST
  const { fetchHLSEntryList, data, loading } = useHLSEntryPageList(
    pagination.page,
    pagination.search,
    pagination.limit,
    slug
  );

  const { mutationDelete, loading: loadingDelete } = useHLSEntryDelete(
    pagination.page,
    pagination.search,
    pagination.limit,
    slug
  );

  //PUBLISH
  const { mutationPublish, loading: loadingPublish } = useHLSEntryPublish(
    pagination.page,
    pagination.search,
    pagination.limit,
    slug
  );

  useEffect(() => {
    fetchHLSEntryList();
  }, [fetchHLSEntryList]);

  useEffect(() => {
    if (newData) {
      fetchHLSEntryList();
    }
  }, [newData, fetchHLSEntryList]);

  return (
    <Stack mt="10">
      <Panel label="Entry List">
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
        </Flex>
        <Panel label="">
          <Table
            loading={false}
            columnHeaders={COLUMN_HEADERS}
            data={data ? data?.listHlscomitteeEntry.hlscomitteeEntry : []}
            onTitleClick={(id: string, name: string) => (
              <Link href="#">{name}</Link>
            )}
            actionButtons={(id: string, rowData) => (
              <Flex justifyContent="flex-end">
                <ChakraSwitch
                  id={id}
                  onChange={async (e) => {
                    await mutationPublish({
                      variables: {
                        updateStatusHlscomitteeEntryInput: {
                          id: id,
                          isActive: rowData.isActive === 0 ? true : false,
                        },
                      },
                    });
                  }}
                  colorScheme="red"
                  display="flex"
                  alignItems="center"
                  marginRight="1rem"
                  isChecked={rowData.isActive === 1}
                />
                <IconButton
                  aria-label="Remove image"
                  icon={<TrashIcon />}
                  variant="ghost"
                  bgColor="white"
                  size="sm"
                  type="button"
                  fontSize="1.4rem"
                  onClick={async () => {
                    mutationDelete({
                      variables: {
                        detailHlscomitteeEntryInput: {
                          id: id,
                        },
                      },
                    });
                  }}
                />
              </Flex>
            )}
          />
          {data && (
            <Pagination
              onPrevClick={() => {
                if (pagination.page > 1) {
                  setPagination({
                    ...pagination,
                    page: pagination.page - 1,
                  });
                }
              }}
              onNextClick={() => {
                if (pagination.page < data.listHlscomitteeEntry.totalPage) {
                  setPagination({
                    ...pagination,
                    page: pagination.page + 1,
                  });
                }
              }}
              total={data ? data.listHlscomitteeEntry.totalPage : 1}
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
      </Panel>
    </Stack>
  );
};

export default EntryTable;
