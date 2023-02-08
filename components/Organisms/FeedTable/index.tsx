import { FC, useState, useEffect, useMemo } from "react";
import { Box, VStack, Stack, Flex, IconButton, Select } from "@chakra-ui/react";
import ConfirmDialog from "@/components/Atoms/ConfirmDialog";
import Pagination from "@/components/Atoms/Pagination";
import SearchInput from "@/components/Atoms/SearchInput";
import Panel from "@/components/Molecules/Panel";
import Table from "@/components/Molecules/Table/Table";
import Link from "next/link";

import DropdownFilterArray from "@/components/Atoms/DropdownFilterArray";
import { IoMdTrash } from "react-icons/io";
import {
  useFeedEvents,
  useUpdateStatusFeedEvent,
  useFeedEventRemove,
} from "@/hooks/feed";
import { TDataFeedEvents, TEStatusFeedEvent } from "@/types/feed";
// import { usePrevious } from "@/hooks";
// import debounce from "lodash/debounce";
interface DropdownFilterOption {
  label: string;
  value: string;
}
const dataOptions = [
  {
    label: "Approved",
    value: "Approved",
  },
  {
    label: "Rejected",
    value: "Rejected",
  },
  {
    label: "Under Moderation",
    value: "UnderModeration",
  },
];
// const data = [
//   {
//     id: "1",
//     type: "Status",
//     postOwner: "Firstname Lastname",
//     totalLikes: 10,
//     totalComments: 12,
//     status: "approved",
//   },
//   {
//     id: "2",
//     type: "Image",
//     postOwner: "Firstname Lastname",
//     totalLikes: 10,
//     totalComments: 12,
//     status: "rejected",
//   },
// ];

const COLUMN_HEADERS = [
  { name: "type", label: "TYPE" },
  { name: "postOwner", label: "POST OWNER" },
  { name: "totalLikes", label: "LIKES" },
  { name: "totalComments", label: "COMMENTS" },
  { name: "status", label: "STATUS" },
];

// interface TFeedList {
//   id: string;
//   type: string;
//   postOwner: string;
//   totalLikes: number;
//   totalComments: number;
//   status: string;
// }
const FeedTable: FC = () => {
  const [valueSearch, setValueSearch] = useState("");
  // const [valueSearchNew, setValueSearchNew] = useState("");
  // const previousText = usePrevious(valueSearch, "");
  const [page, setPage] = useState(1);
  const [isSelected, setSelected] = useState<string[]>([]);
  const [totalPage, setTotalPage] = useState(0);
  const [data, setData] = useState<TDataFeedEvents[]>([]);
  const [isOpenDeleteDialog, setOpenDeleteDialog] = useState({
    openDeleteDialog: false,
    id: "",
  });

  const {
    fetchFeedEvents,
    loading: isLoadingFeedEvent,
    data: DataaFeedEvent,
  } = useFeedEvents({
    params: {
      page: page,
      limit: 10,
      search: valueSearch,
      filter: isSelected as TEStatusFeedEvent[],
    },
  });
  // const debouncedRefreshList = useMemo(
  //   () =>
  //     debounce((text: string) => {
  //       if (text.length > 2 || (text.length === 0 && previousText.length > 0)) {
  //         // console.log("text", text);
  //         setPage(1);
  //         setValueSearchNew(text);
  //         fetchFeedEvents({
  //           variables: {
  //             params: {
  //               page: 1,
  //               limit: 10,
  //               search: text,
  //               filter: isSelected as TEStatusFeedEvent[],
  //             },
  //           },
  //         });
  //       }
  //     }, 1500),
  //   // eslint-disable-next-line
  //   [fetchFeedEvents, previousText, isSelected]
  // );

  // useEffect(() => {
  //   debouncedRefreshList(valueSearch);
  // }, [debouncedRefreshList, valueSearch]);
  useEffect(() => {
    fetchFeedEvents();
  }, [fetchFeedEvents, page, isSelected]);

  // get feed event
  useEffect(() => {
    if (DataaFeedEvent !== undefined) {
      setData(DataaFeedEvent.getFeedEvents.data);
      setTotalPage(DataaFeedEvent.getFeedEvents.totalPage);
      setPage(DataaFeedEvent.getFeedEvents.page);
    }
  }, [data, totalPage, page, DataaFeedEvent]);

  const { fetchUpdateStatusFeedEvent } = useUpdateStatusFeedEvent();
  const { FeedEventRemove, data: responseRemove } = useFeedEventRemove();

  // delete
  // useEffect(() => {
  //   if (responseRemove !== undefined && responseRemove !== null) {
  //     if (responseRemove.success) fetchFeedEvents();
  //   }
  // }, [ responseRemove, fetchFeedEvents ]);
  // console.log("data detail", DataaFeedEvent);

  // console.log("page", page);
  // console.log("valueSearch", valueSearch);
  // console.log("isSelected;", isSelected);
  return (
    <Box minHeight="100vh" width="100%" padding="2rem 0rem">
      <Panel label="">
        <Stack width="100%" direction={["column", "row"]} align="flex-start">
          <VStack spacing="10" flex="1" align="flex-start">
            <SearchInput
              onChange={(e) => {
                if (
                  e.currentTarget.value.length > 2 ||
                  e.currentTarget.value.length === 0 ||
                  (e.currentTarget.value.length === 0 &&
                    e.currentTarget.value.length > 0)
                ) {
                  setValueSearch(e.currentTarget.value);
                  setPage(1);
                }
              }}
            />
          </VStack>
          <VStack spacing="6">
            <DropdownFilterArray
              options={dataOptions}
              isSelected={isSelected}
              setSelected={(e: string[]) => {
                setSelected(e);
                setPage(1);
              }}
            />
          </VStack>
        </Stack>
        <Panel label="">
          <Table<TDataFeedEvents>
            loading={isLoadingFeedEvent}
            columnHeaders={COLUMN_HEADERS}
            data={data}
            onTitleClick={(id: string, name: string) => (
              <Link href={`/feed/${encodeURIComponent(id)}`}>{name}</Link>
            )}
            DropdownStatus={(id: string, label: string, name: string) => (
              <Select
                name="status"
                value={name}
                // onChange={(e) => alert(id + "= " + e.currentTarget.value)}
                onChange={async (e) => {
                  await fetchUpdateStatusFeedEvent({
                    variables: {
                      params: {
                        id,
                        status: e.currentTarget.value as TEStatusFeedEvent,
                      },
                    },
                  });
                  await fetchFeedEvents();
                }}
                width="max-content"
              >
                {dataOptions.map((data, index) => {
                  return (
                    <option key={index} value={data.value}>
                      {data.label}
                    </option>
                  );
                })}
              </Select>
            )}
            actionButtons={(id: string) => (
              <Flex justifyContent="flex-end">
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
          <Pagination
            onPrevClick={() =>
              page <= 1
                ? fetchFeedEvents({
                    variables: {
                      params: {
                        page: 1,
                        limit: 10,
                        search: valueSearch,
                        filter: isSelected as TEStatusFeedEvent[],
                      },
                    },
                  })
                : fetchFeedEvents({
                    variables: {
                      params: {
                        page: page - 1,
                        limit: 10,
                        search: valueSearch,
                        filter: isSelected as TEStatusFeedEvent[],
                      },
                    },
                  })
            }
            onNextClick={() =>
              page < totalPage
                ? fetchFeedEvents({
                    variables: {
                      params: {
                        page: page + 1,
                        limit: 10,
                        search: valueSearch,
                        filter: isSelected as TEStatusFeedEvent[],
                      },
                    },
                  })
                : fetchFeedEvents({
                    variables: {
                      params: {
                        page: totalPage,
                        limit: 10,
                        search: valueSearch,
                        filter: isSelected as TEStatusFeedEvent[],
                      },
                    },
                  })
            }
            total={totalPage}
            currentPage={page}
            onChange={(e) => {
              if (e.currentTarget.value === "") return;
              setPage(parseInt(e.currentTarget.value));
            }}
          />
        </Panel>
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
          await FeedEventRemove({
            variables: {
              id: isOpenDeleteDialog.id,
            },
          });
          await fetchFeedEvents();
        }}
        header="Delete Entry"
        body="Deleting an entry cannot be undone. Are you sure you wish to delete this entry?"
        type="delete"
      />
    </Box>
  );
};

export default FeedTable;
