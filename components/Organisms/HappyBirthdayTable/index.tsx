import ConfirmDialog from "@/components/Atoms/ConfirmDialog";
import Pagination from "@/components/Atoms/Pagination";
import SearchInput from "@/components/Atoms/SearchInput";
import Modal from "@/components/Molecules/Modal";
import Panel from "@/components/Molecules/Panel";
import Table from "@/components/Molecules/Table/Table";
import { BG_GRADIENT } from "@/constants/ui";
import { useModal } from "@/hooks/actionLog";
import { Permission } from "@/constants/users";
import {
  useBirthdayDelete,
  useHappyBirthdayPageList,
  useHappyBirthdayPublish,
} from "@/hooks/happy-birthday";
import { EPageMenu } from "@/types/actionLogs";
import { THappyBirthday } from "@/types/happy-birthday";
import { usePermissions } from "@/utils";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Stack,
  Switch as ChakraSwitch,
} from "@chakra-ui/react";
import Link from "next/link";
import { PostUploadCsv, PostUploadXlsx } from "@/utils/restApi";
import React, { FC, useEffect, useState, useRef } from "react";
import { FaPlus } from "react-icons/fa";
import { IoMdTrash } from "react-icons/io";
import { MdList } from "react-icons/md";

const COLUMN_HEADERS = [
  { name: "fullName", label: "NAME" },
  { name: "birthday", label: "DATE" },
];

const HappyBirthdayTable: FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isOpenDeleteDialog, setOpenDeleteDialog] = useState({
    openDeleteDialog: false,
    id: "",
  });
  const [data, setData] = useState([]);
  const { data: dataModal, isOpen, setOpen, onClose } = useModal();

  const LIMIT = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  // GRAPHQL GET ALL DATA
  const {
    fetchHappyBirthdayList,
    loading,
    data: birthdayData,
  } = useHappyBirthdayPageList(currentPage, search, LIMIT);

  // const { mutationDelete } = useInProfileDelete(currentPage, search, LIMIT);

  // GRAPHQL UPDATE DATA
  const { mutationPublish } = useHappyBirthdayPublish(
    currentPage,
    search,
    LIMIT
  );

  const { mutationDelete, loading: deleteLoading } = useBirthdayDelete(
    currentPage,
    search,
    LIMIT,
    isOpenDeleteDialog.id
  );

  const permissions = usePermissions();

  useEffect(() => {
    fetchHappyBirthdayList();
  }, [fetchHappyBirthdayList]);
  // delete sponsor

  const initializeData = (data: any) => {
    return data.map((item: THappyBirthday) => ({
      ...item,
      fullName: `${item.firstName ? item.firstName : ""} ${
        item.lastName ? item.lastName : ""
      }`,
    }));
  };

  useEffect(() => {
    if (birthdayData) {
      console.log(birthdayData.listBirthday.birthdays, "firstName");
      const newData = initializeData(birthdayData.listBirthday.birthdays);
      setData(newData);
    }
  }, [birthdayData]);

  const totalPage: number = birthdayData
    ? birthdayData?.listBirthday.totalPage
    : 1;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        id={dataModal}
        pageMenu={EPageMenu.HAPPY_BIRTHDAY}
      />
      <Panel label="">
        <Flex justifyContent="space-evenly" width="100%">
          <SearchInput onChange={(e) => setSearch(e.target.value)} />
          <Stack direction="row" ml="1rem">
            <input
              type="file"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              style={{ display: "none" }}
              id="contained-button-file"
              ref={fileInputRef}
              onChange={async (e) => {
                if (
                  e.currentTarget.files instanceof window.FileList &&
                  e.currentTarget.files.length > 0
                ) {
                  const file = e?.currentTarget?.files[0];
                  if (file?.type === "text/csv") {
                    await PostUploadCsv({ file });
                    fetchHappyBirthdayList();
                  } else {
                    await PostUploadXlsx({ file });
                    fetchHappyBirthdayList();
                  }
                }
              }}
            />
            <label htmlFor="contained-button-file">
              <Button
                colorScheme={BG_GRADIENT}
                bgImage={BG_GRADIENT}
                color="white"
                type="button"
                onClick={() => fileInputRef?.current?.click()}
              >
                Import Spreadsheet
              </Button>
            </label>
            <Link href={`/happy-birthday/new`} passHref>
              <Button
                leftIcon={<FaPlus />}
                marginLeft="1rem"
                bgImage={BG_GRADIENT}
                color="white"
              >
                Add
              </Button>
            </Link>
          </Stack>
        </Flex>
        <Table<THappyBirthday>
          loading={loading}
          columnHeaders={COLUMN_HEADERS}
          // data={data !== undefined ? birthdayData.listBirthday.birthdays : []}
          data={data}
          onTitleClick={(id: string, name: string) => (
            <Link href={`/happy-birthday/${encodeURIComponent(id)}`}>
              {name}
            </Link>
          )}
          actionButtons={(id: string, rowData: THappyBirthday) => (
            <Flex justifyContent="flex-end">
              {console.log(
                rowData.isActive === 1 ? true : false,
                "rowData.isActive"
              )}
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
                (item) => item.name === Permission.HAPPY_BIRTHDAY
              ) && (
                <ChakraSwitch
                  color="#00CCFF"
                  id={id}
                  onChange={(e) =>
                    mutationPublish({
                      variables: {
                        updateStatusBirthdayInput: {
                          id: e.currentTarget.id,
                          isActive: rowData.isActive === 0 ? true : false,
                        },
                      },
                    })
                  }
                  display="flex"
                  alignItems="center"
                  isChecked={rowData.isActive === 1}
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
          await mutationDelete();
        }}
        header="Delete Entry"
        body="Deleting an entry cannot be undone. Are you sure you wish to delete this entry?"
        type="delete"
      />
    </>
  );
};

export default HappyBirthdayTable;
