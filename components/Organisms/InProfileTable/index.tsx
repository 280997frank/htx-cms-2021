import ConfirmDialog from "@/components/Atoms/ConfirmDialog";
import Pagination from "@/components/Atoms/Pagination";
import SearchInput from "@/components/Atoms/SearchInput";
import Modals from "@/components/Molecules/Modal";
import Panel from "@/components/Molecules/Panel";
import Table from "@/components/Molecules/Table/Table";
import { BG_GRADIENT } from "@/constants/ui";
import { useModal } from "@/hooks/actionLog";
import { Permission } from "@/constants/users";
import {
  useInProfilePageList,
  useInProfileDelete,
  useInProfilePublish,
} from "@/hooks/inprofile";
import { EPageMenu } from "@/types/actionLogs";
import { TInProfileTable } from "@/types/inprofile";
import { usePermissions } from "@/utils";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Switch as ChakraSwitch,
} from "@chakra-ui/react";
import Link from "next/link";
import React, { FC, useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { IoMdTrash } from "react-icons/io";
import { MdList } from "react-icons/md";

const COLUMN_HEADERS = [
  { name: "title", label: "TITLE" },
  { name: "likes", label: "LIKES" },
  { name: "loves", label: "LOVES" },
  { name: "claps", label: "CLAPS" },
  { name: "fightings", label: "CHEERS" },
];

const LIMIT = 10;

const InProfileTable: FC = () => {
  const [isOpenDeleteDialog, setOpenDeleteDialog] = useState({
    openDeleteDialog: false,
    id: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const { setOpen, isOpen, data: dataModal, onClose } = useModal();

  const { fetchInProfileList, loading, data } = useInProfilePageList(
    currentPage,
    search,
    LIMIT
  );

  const { mutationDelete } = useInProfileDelete(currentPage, search, LIMIT);
  const { mutationPublish } = useInProfilePublish(currentPage, search, LIMIT);

  useEffect(() => {
    fetchInProfileList();
  }, [fetchInProfileList]);

  const totalPage = data !== undefined ? data.getInProfiles.totalPage : 1;
  const permissions = usePermissions();

  return (
    <>
      <Modals
        isOpen={isOpen}
        id={dataModal}
        pageMenu={EPageMenu.IN_PROFILE}
        onClose={onClose}
      />
      <Panel label="">
        <Flex justifyContent="space-evenly" width="100%">
          <SearchInput onChange={(e) => setSearch(e.target.value)} />
          <Link href={`/in-profile/new`} passHref>
            <Button marginLeft="1rem" bgImage={BG_GRADIENT} color="white">
              <AiOutlinePlus fontSize="24" />
              &nbsp; Add
            </Button>
          </Link>
        </Flex>
        <Table
          loading={loading}
          columnHeaders={COLUMN_HEADERS}
          data={data !== undefined ? data.getInProfiles.data : []}
          onTitleClick={(id: string, name: string) => (
            <Link href={`/in-profile/${encodeURIComponent(id)}`}>{name}</Link>
          )}
          actionButtons={(id: string, row: TInProfileTable) => (
            <Flex justifyContent="flex-end">
              <IconButton
                aria-label="modal"
                icon={<MdList />}
                variant="ghost"
                size="sm"
                fontSize="1.4rem"
                mr="3px"
                onClick={() => setOpen(row.id)}
              />
              {permissions.some(
                (item) => item.name === Permission.IN_PROFILE
              ) && (
                <ChakraSwitch
                  color={row.isActive ? "#00CCFF" : "#5C068C"}
                  id={id}
                  isChecked={row.isActive}
                  onChange={(e) =>
                    mutationPublish({
                      variables: {
                        param: {
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
              {!row.isActive ? (
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
              inProfileId: isOpenDeleteDialog.id,
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

export default InProfileTable;
