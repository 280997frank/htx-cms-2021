import React, { FC, useEffect, useState } from "react";
// import Pagination from "@/components/Atoms/Pagination";
import SearchInput from "@/components/Atoms/SearchInput";
import Panel from "@/components/Molecules/Panel";
import Table from "@/components/Molecules/Table/Table";
import { useListHtxHouses, useSetPublishHTXHouses } from "@/hooks/htxHouses";
import {
  Flex,
  Switch as ChakraSwitch,
  Text,
  IconButton,
} from "@chakra-ui/react";
import { isNil } from "lodash";
import Link from "next/link";

import { THTXHouses } from "@/types/htxHouses";
import { MdList } from "react-icons/md";
import { useModal } from "@/hooks/actionLog";
import Modal from "@/components/Molecules/Modal";
import { EPageMenu } from "@/types/actionLogs";
import { usePermissions } from "@/utils";
import { Permission } from "@/constants/users";

const COLUMN_HEADERS = [
  { name: "name", label: "HOUSE NAME" },
  { name: "point", label: "CURRENT POINT" },
];

const LIMIT = 10;

const HTXHousesTable: FC = () => {
  // const [currentPage, setCurrentPage] = useState(1);
  const [ListData, setListData] = useState<THTXHouses[]>([]);
  const [search, setSearch] = useState("");
  const { data: IdModal, isOpen, setOpen, onClose } = useModal();
  // const totalPage = 10;
  const { fetchListHtxHouses, responseListHtx, loading } = useListHtxHouses({
    listHtxHouseInput: {
      search: {
        keyword: search,
      },
      page: 1,
      limit: LIMIT,
    },
  });
  useEffect(() => {
    fetchListHtxHouses();
  }, [search, fetchListHtxHouses]);
  const { fetchSetPublishHTXHouses, responsePublishHTXHouse } =
    useSetPublishHTXHouses();

  const permissions = usePermissions();

  useEffect(() => {
    if (!isNil(responsePublishHTXHouse)) {
      fetchListHtxHouses();
    }
  }, [responsePublishHTXHouse, fetchListHtxHouses]);
  useEffect(() => {
    if (!isNil(responseListHtx)) {
      setListData(responseListHtx.listHtxHouse.htxHouses);
    }
  }, [responseListHtx]);
  // console.log("search", search);
  return (
    <Panel label="">
      <Modal
        pageMenu={EPageMenu.HTX_HOUSES}
        id={IdModal}
        isOpen={isOpen}
        onClose={onClose}
      />
      <Flex justifyContent="space-evenly" width="100%">
        <SearchInput
          onChange={(e) => {
            if (
              e.target.value.length > 2 ||
              e.target.value.length === 0 ||
              (e.target.value.length === 0 && e.target.value.length > 0)
            ) {
              setSearch(e.target.value);
            }
          }}
        />
      </Flex>
      <Table
        loading={loading}
        columnHeaders={COLUMN_HEADERS}
        data={ListData}
        onTitleClick={(id: string, name: string) => (
          <Text fontWeight="bold">
            <Link href={`/htx-houses/${encodeURIComponent(id)}`}>{name}</Link>
          </Text>
        )}
        actionButtons={(id: string, row: THTXHouses) => (
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
              (item) => item.name === Permission.HTX_HOUSES
            ) && (
              <ChakraSwitch
                color={row.isActive ? "#00CCFF" : "#5C068C"}
                id={id}
                isChecked={row.isActive}
                onChange={async (e) =>
                  await fetchSetPublishHTXHouses({
                    variables: {
                      publishHtxHouseInput: {
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
          </Flex>
        )}
      />
      {/* <Pagination
          onPrevClick={() =>
            currentPage <= 1
              ? setCurrentPage(1)
              : setCurrentPage(currentPage - 1)
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
        /> */}
    </Panel>
  );
};

export default HTXHousesTable;
