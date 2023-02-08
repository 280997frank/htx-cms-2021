import ConfirmDialog from "@/components/Atoms/ConfirmDialog";
import Pagination from "@/components/Atoms/Pagination";
import SearchInput from "@/components/Atoms/SearchInput";
import Panel from "@/components/Molecules/Panel";
import Table from "@/components/Molecules/Table/Table";
import { BG_GRADIENT } from "@/constants/ui";
import {
  useManageUsersActivate,
  useManageUsersDelete,
  useManageUsersPageList,
} from "@/hooks/manageusers";
import { TManageUsersTable } from "@/types/manageusers";
import {
  Button,
  Flex,
  IconButton,
  Switch as ChakraSwitch,
} from "@chakra-ui/react";
import Link from "next/link";
import React, { FC, useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { IoMdTrash } from "react-icons/io";

const COLUMN_HEADERS = [
  { name: "email", label: "USERNAME" },
  { name: "role", label: "TIER" },
];

const LIMIT = 10;

const ManageUserTable: FC = () => {
  const [isOpenDeleteDialog, setOpenDeleteDialog] = useState({
    openDeleteDialog: false,
    id: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const { fetchManageUsersList, loading, data } = useManageUsersPageList(
    currentPage,
    search,
    LIMIT
  );

  const { mutationDelete } = useManageUsersDelete(currentPage, search, LIMIT);
  const { mutationPublish } = useManageUsersActivate(
    currentPage,
    search,
    LIMIT
  );

  useEffect(() => {
    fetchManageUsersList();
  }, [fetchManageUsersList]);

  const totalPage = data !== undefined ? data.listUser.totalPage : 1;

  return (
    <>
      <Panel label="">
        <Flex justifyContent="space-evenly" width="100%">
          <SearchInput onChange={(e) => setSearch(e.target.value)} />
          <Link href={`/manage-users/new`} passHref>
            <Button marginLeft="1rem" bgImage={BG_GRADIENT} color="white">
              <AiOutlinePlus fontSize="24" />
              &nbsp; Add
            </Button>
          </Link>
        </Flex>
        <Table
          loading={loading}
          columnHeaders={COLUMN_HEADERS}
          data={data !== undefined ? data.listUser.users : []}
          onTitleClick={(id: string, name: string) => (
            <Link href={`/manage-users/${encodeURIComponent(id)}`}>{name}</Link>
          )}
          actionButtons={(id: string, row: TManageUsersTable) => (
            <Flex justifyContent="flex-end">
              <ChakraSwitch
                color={row.isActive ? "#00CCFF" : "#5C068C"}
                id={id}
                isChecked={row.isActive}
                onChange={(e) =>
                  mutationPublish({
                    variables: {
                      publishUserInput: {
                        id: e.currentTarget.id,
                        isActive: !row.isActive,
                      },
                    },
                  })
                }
                display="flex"
                alignItems="center"
              />
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
              id: isOpenDeleteDialog.id,
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

export default ManageUserTable;
