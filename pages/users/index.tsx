import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Box,
  Heading,
  Flex,
  Button,
  IconButton,
  Switch as ChakraSwitch,
  Select,
} from "@chakra-ui/react";
import { PlusIcon, TrashIcon } from "@/components/Atoms/Icons";
import Panel from "@/components/Molecules/Panel";
import Layout from "@/components/Templates/Layout";
import SearchInput from "@/components/Atoms/SearchInput";
import Table from "@/components/Molecules/Table/Table";
import ConfirmDialog from "@/components/Atoms/ConfirmDialog";
import Pagination from "@/components/Atoms/Pagination";
import { BG_GRADIENT } from "@/constants/ui";
import { useDeleteUser, useListUsers, useUpdateUser } from "@/hooks/users";
import { IUser } from "@/types/users";
import { userRole } from "@/constants/users";

const COLUMN_HEADERS = [
  { name: "fullname", label: "NAME" },
  { name: "companyName", label: "COMPANY" },
  { name: "email", label: "EMAIL" },
  { name: "roles", label: "ACCOUNT TYPE" },
];

const Users = () => {
  const [isOpenDeleteDialog, setOpenDeleteDialog] = useState({
    openDeleteDialog: false,
    id: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    search: "",
  });

  const { fetchUsers, loading, data } = useListUsers(pagination);

  const { updateUser } = useUpdateUser();
  const { deleteUser } = useDeleteUser();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const userList = useMemo(() => {
    if (!data) return [];
    return data.getUsers.data.map((item) => {
      return {
        ...item,
        companyName: item.company ? item.company.companyName : "",
      };
    });
  }, [data]);

  return (
    <Layout title="Users | ZodiacLive CMS">
      <Box padding={["7", "10"]}>
        <Heading as="h1" size="xl" marginBottom="8">
          Users
        </Heading>
        <Panel label="User List">
          <Flex width="full">
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
            <Link href={`/users/new`} passHref>
              <Button
                marginLeft="1rem"
                leftIcon={<PlusIcon fill="white" boxSize={5} />}
                bgImage={BG_GRADIENT}
                color="white"
              >
                Add
              </Button>
            </Link>
          </Flex>
          <Panel label="">
            <Table<IUser>
              loading={loading}
              columnHeaders={COLUMN_HEADERS}
              data={userList}
              DropdownStatus={(id, label, name, rowData) => (
                <Select
                  name="status"
                  value={name}
                  onChange={async (e) => {
                    await updateUser({
                      variables: {
                        params: {
                          fullname: rowData?.fullname,
                          id: id,
                          roles: e.target.value,
                        },
                      },
                    });
                    fetchUsers();
                  }}
                  width="max-content"
                >
                  {userRole.map((data, index) => {
                    return (
                      <option key={index} value={data.value}>
                        {data.label}
                      </option>
                    );
                  })}
                </Select>
              )}
              onTitleClick={(id: string, name: string) => (
                <Link href={`/users/${encodeURIComponent(id)}`}>{name}</Link>
              )}
              actionButtons={(id: string, rowData) => (
                <Flex justifyContent="flex-end">
                  <ChakraSwitch
                    id={id}
                    onChange={async (e) => {
                      await updateUser({
                        variables: {
                          params: {
                            fullname: rowData.fullname,
                            id: id,
                            isActive: e.target.checked,
                          },
                        },
                      });
                      fetchUsers();
                    }}
                    colorScheme="red"
                    display="flex"
                    alignItems="center"
                    marginRight="1rem"
                    isChecked={rowData.isActive}
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
                  if (pagination.page < data.getUsers.totalPage) {
                    setPagination({ ...pagination, page: pagination.page + 1 });
                  }
                }}
                total={data ? data.getUsers.totalPage : 1}
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
              await deleteUser({
                variables: { userId: isOpenDeleteDialog.id },
              });
              fetchUsers();
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

export default Users;
