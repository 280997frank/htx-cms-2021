import { FC, useState, useEffect } from "react";
import {
  Box,
  VStack,
  Stack,
  Flex,
  IconButton,
  Select,
  Text,
  Switch as ChakraSwitch,
} from "@chakra-ui/react";
import isNil from "lodash/isNil";
import ConfirmDialog from "@/components/Atoms/ConfirmDialog";
import Pagination from "@/components/Atoms/Pagination";
import SearchInput from "@/components/Atoms/SearchInput";
import Panel from "@/components/Molecules/Panel";
import Table from "@/components/Molecules/Table/Table";
// import Link from "next/link";

// import DropdownFilterArray from "@/components/Atoms/DropdownFilterArray";
import { IoMdTrash } from "react-icons/io";
import {
  useLocations,
  useEventsAgenda,
  useUpdateLocationEventAgenda,
  useSetPublishEventAgenda,
  useEventAgendaRemove,
} from "@/hooks/eventsAgenda";
import { TLocationType } from "@/types/eventsAgenda";

// const data = [
//   {
//     id: "1",
//     title: "Session title",
//     startTime: new Date().getTime(),
//     location: "Auditorium",
//   },
//   {
//     id: "2",
//     title: "Session title",
//     startTime: new Date().getTime(),
//     location: "Breakout Room 1",
//   },
// ];

const COLUMN_HEADERS = [
  { name: "title", label: "TITLE" },
  { name: "startDate", label: "START" },
  { name: "locationId", label: "LOCATION" },
];

interface TEventAgendaList {
  id: string;
  title: string;
  location: {
    id: string;
    name: string;
  };
  startDate: string;
  isActive: boolean;
  locationName: string;
  locationId: string;
}

interface RCTableProps {
  dateEventAgenda: string;
}
const EventAgendaTable: FC<RCTableProps> = ({ dateEventAgenda }) => {
  const [isOpenDeleteDialog, setOpenDeleteDialog] = useState({
    openDeleteDialog: false,
    id: "",
  });
  const [valueSearch, setValueSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [data, setData] = useState<TEventAgendaList[]>([]);
  const { fetchLocation, data: DataLocation } = useLocations({
    listLocationInput: {
      page: 1,
      limit: 9999,
      search: {
        name: "",
      },
      filter: {
        ignoreLocation: "ROUNDTABLE" as TLocationType,
      },
    },
  });

  const {
    fetchEventsAgenda,
    loading: isLoadingFeedEvent,
    data: DataEventAgenda,
  } = useEventsAgenda({
    listSessionInput: {
      page: page,
      limit: 10,
      search: {
        title: valueSearch,
      },
      filter: {
        startDate: dateEventAgenda,
        ignoreLocation: [
          "ROUNDTABLE",
          "EXHIBITOR_ROUNDTABLE",
        ] as TLocationType[],
      },
    },
  });

  useEffect(() => {
    fetchLocation();
    fetchEventsAgenda();
  }, [fetchLocation, fetchEventsAgenda, page, dateEventAgenda]);

  useEffect(() => {
    if (DataEventAgenda !== undefined) {
      setTotalPage(DataEventAgenda.listSession.totalPage);
      setPage(DataEventAgenda.listSession.page + 1);
    }
  }, [totalPage, page, DataEventAgenda]);

  useEffect(() => {
    if (DataEventAgenda !== undefined) {
      var newResult: Array<any> = [];
      DataEventAgenda.listSession.sessions.map((data) => {
        const locName = data.location.name;
        const locId = data.location.id;
        const updatedValues: any = {
          ...data,
          locationName: locName,
          locationId: locId,
        };
        newResult.push(updatedValues);
      });
      // console.log("newResult", newResult);
      setData(newResult);
    }
  }, [DataEventAgenda]);
  const { fetchUpdateLocationEventAgenda } = useUpdateLocationEventAgenda();
  const { fetchSetPublishEventAgenda } = useSetPublishEventAgenda();
  const { EventAgendaRemove } = useEventAgendaRemove();

  // console.log("locations.", DataLocation?.listLocation.locations);
  // console.log("session.", DataEventAgenda?.listSession.sessions);
  // console.log("valueSearch", valueSearch);
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
        </Stack>
        <Panel label="">
          <Table<TEventAgendaList>
            loading={isLoadingFeedEvent}
            columnHeaders={COLUMN_HEADERS}
            data={data}
            onTitleClick={(id: string, name: string) => <Text>{name}</Text>}
            DropdownStatus={(id: string, label: string, name: string) => {
              return (
                <Select
                  // name="location"
                  value={name}
                  // onChange={(e) => alert(label + " =" + e.currentTarget.value)}
                  onChange={async (e) => {
                    await fetchUpdateLocationEventAgenda({
                      variables: {
                        setLocationInput: {
                          sessionId: id,
                          locationId: e.currentTarget.value,
                        },
                      },
                    });
                    // await fetchEventsAgenda();
                  }}
                  width="max-content"
                >
                  <option value="" disabled selected>
                    Select an option
                  </option>
                  {!isNil(DataLocation) &&
                    DataLocation.listLocation.locations.map((data, index) => {
                      return (
                        <option key={index} value={data.id}>
                          {data.name}
                        </option>
                      );
                    })}
                </Select>
              );
            }}
            actionButtons={(id: string, rowData: TEventAgendaList) => (
              <Flex justifyContent="flex-end">
                <ChakraSwitch
                  id={id}
                  // onChange={(e) =>
                  //   alert(`changed state of id ${e.currentTarget.}`)
                  // }
                  onChange={async (e) => {
                    await fetchSetPublishEventAgenda({
                      variables: {
                        publishSessionInput: {
                          id,
                          isActive: !rowData.isActive,
                        },
                      },
                    });
                  }}
                  colorScheme="red"
                  display="flex"
                  alignItems="center"
                  isChecked={rowData.isActive}
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
          <Pagination
            onPrevClick={() =>
              page <= 1
                ? fetchEventsAgenda({
                    variables: {
                      listSessionInput: {
                        page: 1,
                        limit: 10,
                        search: {
                          title: valueSearch,
                        },
                        filter: {
                          startDate: dateEventAgenda,
                          ignoreLocation: [
                            "ROUNDTABLE",
                            "EXHIBITOR_ROUNDTABLE",
                          ] as TLocationType[],
                        },
                      },
                    },
                  })
                : fetchEventsAgenda({
                    variables: {
                      listSessionInput: {
                        page: page - 1,
                        limit: 10,
                        search: {
                          title: valueSearch,
                        },
                        filter: {
                          startDate: dateEventAgenda,
                          ignoreLocation: [
                            "ROUNDTABLE",
                            "EXHIBITOR_ROUNDTABLE",
                          ] as TLocationType[],
                        },
                      },
                    },
                  })
            }
            onNextClick={() =>
              page < totalPage
                ? fetchEventsAgenda({
                    variables: {
                      listSessionInput: {
                        page: page + 1,
                        limit: 10,
                        search: {
                          title: valueSearch,
                        },
                        filter: {
                          startDate: dateEventAgenda,
                          ignoreLocation: [
                            "ROUNDTABLE",
                            "EXHIBITOR_ROUNDTABLE",
                          ] as TLocationType[],
                        },
                      },
                    },
                  })
                : fetchEventsAgenda({
                    variables: {
                      listSessionInput: {
                        page: totalPage,
                        limit: 10,
                        search: {
                          title: valueSearch,
                        },
                        filter: {
                          startDate: dateEventAgenda,
                          ignoreLocation: [
                            "ROUNDTABLE",
                            "EXHIBITOR_ROUNDTABLE",
                          ] as TLocationType[],
                        },
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
          await EventAgendaRemove({
            variables: {
              id: isOpenDeleteDialog.id,
            },
          });
          await fetchEventsAgenda();
        }}
        header="Delete Entry"
        body="Deleting an entry cannot be undone. Are you sure you wish to delete this entry?"
        type="delete"
      />
    </Box>
  );
};

export default EventAgendaTable;
