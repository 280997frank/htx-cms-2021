import Link from "next/link";
import React, { useState, useEffect, useCallback } from "react";
import { FeedbackOrderType, IFeedback, SortByType } from "@/types/feedback";
import Layout from "@/components/Templates/Layout";
import { BG_GRADIENT } from "@/constants/ui";
import { TrashIcon } from "@/components/Atoms/Icons";
import ConfirmDialog from "@/components/Atoms/ConfirmDialog";
import Table from "@/components/Molecules/Table/Table";
import Pagination from "@/components/Atoms/Pagination";
import SearchInput from "@/components/Atoms/SearchInput";
import DayPickerInput from "react-day-picker/DayPickerInput";
import dayjs from "dayjs";
import { RiCalendarEventFill } from "react-icons/ri";
import "react-day-picker/lib/style.css";
import {
  Box,
  Flex,
  Heading,
  IconButton,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Stack,
  Button,
  InputGroup,
  InputLeftElement,
  Input,
} from "@chakra-ui/react";
import {
  useFeedback,
  useMutationFeedback,
  useExportFeedbacks,
} from "@/hooks/feedback";
import withAuth from "@/utils/withAuth";

const COLUMN_HEADERS = [
  { name: "createdAt", label: "DATE" },
  { name: "createdAt", label: "TIME" },
  { name: "feedback", label: "FEEDBACK" },
];

const Feedback: React.FC = () => {
  const [isOpenDeleteDialog, setOpenDeleteDialog] = useState({
    openDeleteDialog: false,
    id: "",
  });

  const dayEvent = dayjs(new Date().getTime());
  const [dateEventAgenda, setDateEventAgend] = useState(
    dayEvent.format("YYYY-MM-DD")
  );

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    search: {
      keyword: "",
    },
    filter: {
      isActive: true,
    },
    order: {
      orderBy: FeedbackOrderType.CREATED_AT,
      sortBy: SortByType.ASC,
    },
  });

  const { fetchFeedback, loading, data } = useFeedback(pagination);
  const { fetchMutationFeedback } = useMutationFeedback(pagination);
  const onCloseConfirmDialog = useCallback(() => {
    setOpenDeleteDialog({
      id: "",
      openDeleteDialog: false,
    });
  }, []);

  const onConfirmActionDialog = useCallback(async () => {
    await fetchMutationFeedback({
      variables: { detailFeedbackInput: { id: isOpenDeleteDialog.id } },
    });
  }, [fetchMutationFeedback, isOpenDeleteDialog]);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback, pagination]);

  const { fetchExportFeedbacks } = useExportFeedbacks();

  const handleExport = async (date: string) => {
    console.log("handleExport", date);
    await fetchExportFeedbacks({ startDate: date, endDate: date });
  };

  return (
    <Layout title="Feedback | HTX">
      <Box h="100%" width="100%" minHeight="100vh" padding={["7", "10"]}>
        <Flex flexDir="column">
          <Flex width="100%" justifyContent="space-between">
            <Heading size="xl" mb="8">
              <Breadcrumb>
                <BreadcrumbItem isCurrentPage>
                  <BreadcrumbLink>Feedback</BreadcrumbLink>
                </BreadcrumbItem>
              </Breadcrumb>
            </Heading>
            <Stack direction="row">
              <Button
                colorScheme={BG_GRADIENT}
                bgImage={BG_GRADIENT}
                color="white"
                onClick={() => handleExport(dateEventAgenda)}
              >
                Export Spreadsheet
              </Button>
              <DayPickerInput
                format="DD-MM-YYYY"
                value={dateEventAgenda}
                component={(props: Record<string, unknown>) => {
                  return (
                    <InputGroup
                      color="#5C068C"
                      fontSize="1.2em"
                      borderColor="#5C068C"
                      width="260px"
                    >
                      <InputLeftElement
                        // pointerEvents="none"
                        color="#5C068C"
                        fontSize="1.2em"
                        borderColor="#5C068C"
                      >
                        <RiCalendarEventFill style={{ fill: "#5C068C" }} />
                      </InputLeftElement>
                      <Input {...props} />
                    </InputGroup>
                  );
                }}
                onDayChange={(date) => {
                  const day = dayjs(date);
                  setDateEventAgend(day.format("YYYY-MM-DD"));
                  // setDateEventAgendEnd(day.format("YYYY-MM-DD"));
                }}
              />
            </Stack>
          </Flex>

          <Flex
            flexDirection="column"
            bg="white"
            fontSize="16px"
            p="16px"
            border="1px solid #d7d7d7"
            borderRadius="8px"
            mt="20px"
          >
            <SearchInput
              mb="20px"
              onChange={(e) =>
                setPagination({
                  ...pagination,
                  page: 1,
                  search: { keyword: e.target.value },
                })
              }
              _focus={{ border: "1px solid #5C068C" }}
            />
            <Table<IFeedback>
              columnHeaders={COLUMN_HEADERS}
              loading={loading}
              data={data?.listFeedback?.feedbacks || []}
              onTitleClick={() => <></>}
              actionButtons={(id: string, rowData) => (
                <Flex justifyContent="flex-end">
                  <IconButton
                    aria-label="Remove image"
                    icon={<TrashIcon />}
                    variant="ghost"
                    fontSize="1.4rem"
                    _focus={{ border: "none" }}
                    type="button"
                    onClick={() => {
                      setOpenDeleteDialog({
                        openDeleteDialog: true,
                        id: id,
                      });
                    }}
                  />
                </Flex>
              )}
            />
          </Flex>
        </Flex>
        {!!data?.listFeedback?.feedbacks.length && (
          <Pagination
            onPrevClick={() => {
              if (pagination.page > 1) {
                setPagination({ ...pagination, page: pagination.page - 1 });
              }
            }}
            onNextClick={() => {
              if (pagination.page < data.listFeedback.totalPage) {
                setPagination({ ...pagination, page: pagination.page + 1 });
              }
            }}
            total={data ? data.listFeedback.totalPage : 1}
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
          onClose={onCloseConfirmDialog}
          onConfirmAction={onConfirmActionDialog}
          header="Delete Entry"
          body="Deleting an entry cannot be undone. Are you sure you wish to delete this entry?"
          type="delete"
        />
      </Box>
    </Layout>
  );
};

export default withAuth(Feedback);
