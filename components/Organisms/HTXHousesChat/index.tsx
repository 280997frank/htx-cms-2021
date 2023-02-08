import Panel from "@/components/Molecules/Panel";
import { Stack, Text, IconButton, VStack, ButtonGroup } from "@chakra-ui/react";
import React, { FC, useEffect, useRef, useState } from "react";
import { Form, Formik } from "formik";
import Select from "@/components/Atoms/Select";
import TextInput from "@/components/Atoms/TextInput";
import { requiredString } from "@/constants/validationSchema";
import { object } from "yup";
import { MdSend } from "react-icons/md";
import { IoSaveSharp } from "react-icons/io5";
import { FaTimes } from "react-icons/fa";
import ConfirmDialog from "@/components/Atoms/ConfirmDialog";
import {
  useDeleteHTXHouseChat,
  useEditHTXHouseChat,
  useListHtxHouses,
  useListHtxHousesChat,
  useSetHTXHouseChat,
} from "@/hooks/htxHouses";
import { isNil } from "lodash";
import {
  ThtxHouseChats,
  THTXHouses,
  TOrderBy,
  TSortBY,
  TDataItemChat,
  TIntialValue,
} from "@/types/htxHouses";
import dayjs from "dayjs";

const ItemHtxHouseChat: FC<TDataItemChat> = ({
  Data,
  isEditChat,
  setOpenDeleteDialog,
  setEditChat,
}) => {
  return (
    <Stack direction="row" align="flex-start">
      <Stack
        direction="column"
        align="flex-start"
        border="1px"
        borderColor="gray.300"
        borderRadius="md"
        p="2"
        spacing="1"
        width="md"
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          align="center"
          width="full"
        >
          <Text color="#5C068C" fontWeight="bold" fontSize="lg">
            {Data.htxHouse.name}
          </Text>
          <Text color="#7D7D7D" fontSize="14px">
            {Data?.user?.name}
          </Text>
        </Stack>
        <Stack
          direction="row"
          justifyContent="space-between"
          align="center"
          width="full"
        >
          <Text color="#7D7D7D" fontSize="lg">
            {Data.message}
          </Text>
          <Text color="#7D7D7D" fontSize="14px">
            {/* {Data.createdAt} */}
            {dayjs(Data.createdAt).format("DD/MM/YYYY HH:mm a")}
          </Text>
        </Stack>
      </Stack>
      <Stack
        direction="column"
        justifyContent="center"
        verticalAlign="middle"
        spacing="2"
        height="full"
      >
        <Text
          fontWeight="bold"
          cursor="pointer"
          onClick={() =>
            setEditChat({
              id: Data.id,
              htxHouseId: Data.htxHouse.id,
              isEdit: true,
              message: Data.message,
            })
          }
        >
          Edit
        </Text>
        <Text
          fontWeight="bold"
          cursor="pointer"
          color="red"
          onClick={() => {
            if (isEditChat.isEdit && Data.id === isEditChat.id) {
              setEditChat({
                id: "",
                htxHouseId: "",
                isEdit: false,
                message: "",
              });
            } else {
              setOpenDeleteDialog({
                id: Data.id,
                openDeleteDialog: true,
              });
            }
          }}
        >
          {isEditChat.isEdit && Data.id === isEditChat.id ? "Cancel" : "Delete"}
        </Text>
      </Stack>
    </Stack>
  );
};

const validationSchema = object({
  htxHouseId: requiredString,
  Message: requiredString,
});

const FormInitialValue = {
  htxHouseId: "",
  Message: "",
};

const HTXHousesChat: FC = () => {
  const refChat = useRef<any>();
  // const [hasMore, setHasMore] = useState(true);
  // const [nowHeightScroll, setNowHeightScroll] = useState(0);
  const [intialValue, setIntialValue] =
    useState<TIntialValue>(FormInitialValue);
  const [TotalPageChatNew, setTotalPageChatNew] = useState(1);
  const [PageChat, setPageChat] = useState(1);
  const [isSubmitting, setSubmitting] = useState(false);
  const [ListHTXHouses, setListHTXHouses] = useState<THTXHouses[]>([]);
  const [ListHTXHousesChat, setListHTXHousesChat] = useState<ThtxHouseChats[]>(
    []
  );
  const [isOpenDeleteDialog, setOpenDeleteDialog] = useState({
    openDeleteDialog: false,
    id: "",
  });

  const [isEditChat, setEditChat] = useState({
    isEdit: false,
    id: "",
    htxHouseId: "",
    message: "",
  });

  const scrollToBottom = () => {
    refChat.current?.scrollIntoView({ behavior: "smooth" });
  };

  const { fetchListHtxHouses, responseListHtx, loading } = useListHtxHouses({
    listHtxHouseInput: {
      search: {
        keyword: "",
      },
      page: 1,
      limit: 10,
    },
  });
  // const wadahChat = document.getElementById("wadahChat") as HTMLElement;

  const {
    fetchListHtxHousesChat,
    responseListHtxChat,
    loadingChat,
    totalPageChat,
  } = useListHtxHousesChat({
    listHtxHouseChatInput: {
      order: {
        orderBy: "CREATED_AT" as TOrderBy,
        sortBy: "DESC" as TSortBY,
      },
      page: PageChat,
      limit: 10,
    },
  });

  const {
    fetchSetHTXHouseChat,
    responseHTXHouseChat,
    loading: isLoadingSendChat,
  } = useSetHTXHouseChat();
  const {
    fetchDeleteHTXHouseChat,
    loading: loadingDeleteChat,
    responseHTXHouseChatDel,
  } = useDeleteHTXHouseChat();
  const { fetchEditHTXHouseChat, responseHTXHouseChatEdit } =
    useEditHTXHouseChat();

  // useEffect(() => {
  //   refChat.current.addEventListener("scroll", function () {
  //     setNowHeightScroll(refChat.current.scrollTop);
  //     refChat.current.scrollTo(0, 11);
  //   });
  // }, [refChat]);

  useEffect(() => {
    fetchListHtxHousesChat();
    scrollToBottom();
  }, [fetchListHtxHousesChat, PageChat]);
  useEffect(() => {
    fetchListHtxHouses();
    scrollToBottom();
  }, [fetchListHtxHouses]);

  useEffect(() => {
    if (!isNil(responseListHtx)) {
      setListHTXHouses(responseListHtx.listHtxHouse.htxHouses);
    }
    if (!isNil(responseListHtxChat)) {
      setListHTXHousesChat(responseListHtxChat);
    }
    if (!isNil(totalPageChat)) {
      setTotalPageChatNew(totalPageChat);
    }
  }, [responseListHtx, responseListHtxChat, totalPageChat, PageChat]);

  useEffect(() => {
    if (!isNil(responseHTXHouseChat)) {
      fetchListHtxHousesChat();
    }
  }, [responseHTXHouseChat, fetchListHtxHousesChat]);

  useEffect(() => {
    if (!isNil(responseHTXHouseChatDel)) {
      fetchListHtxHousesChat();
    }
    if (!isNil(responseHTXHouseChatEdit)) {
      fetchListHtxHousesChat();
      setEditChat({
        isEdit: false,
        message: "",
        htxHouseId: "",
        id: "",
      });
    }
  }, [
    responseHTXHouseChatDel,
    responseHTXHouseChatEdit,
    fetchListHtxHousesChat,
  ]);
  // console.log("ListHTXHousesChat", responseListHtxChat);

  useEffect(() => {
    if (isEditChat.isEdit) {
      setIntialValue({
        htxHouseId: isEditChat.htxHouseId,
        Message: isEditChat.message,
      });
    } else {
      setIntialValue({
        htxHouseId: "",
        Message: "",
      });
    }
  }, [isEditChat]);

  // console.log("PageChat", PageChat);
  return (
    <Panel label="MESSAGE LOG">
      <Stack direction="column" align="flex-start" width="full" height="unset">
        <Stack
          ref={refChat}
          id="wadahChat"
          direction="column-reverse"
          align="flex-start"
          width="full"
          height="20rem"
          overflowY="auto"
          onScroll={(e) => {
            const { scrollTop } = e.currentTarget;

            if (scrollTop === 0 && PageChat < TotalPageChatNew) {
              setTimeout(function timer() {
                setPageChat(PageChat + 1);
              }, 500);
            }
          }}
        >
          {ListHTXHousesChat.map((item, index: number) => {
            return (
              <ItemHtxHouseChat
                Data={item}
                key={index}
                setOpenDeleteDialog={setOpenDeleteDialog}
                setEditChat={setEditChat}
                isEditChat={isEditChat}
              />
            );
          })}
        </Stack>
        <Stack direction="row" align="flex-start" width="full" height="10%">
          <Formik
            enableReinitialize
            validationSchema={validationSchema}
            initialValues={intialValue}
            onSubmit={async (values, { resetForm }) => {
              setSubmitting(true);
              await setPageChat(1);
              if (isEditChat.isEdit) {
                // console.log("id", isEditChat.id);
                // console.log("values", values);
                await fetchEditHTXHouseChat({
                  variables: {
                    editHtxHouseChatInput: {
                      id: isEditChat.id,
                      htxHouseId: values.htxHouseId,
                      message: values.Message,
                    },
                  },
                });
              } else {
                await fetchSetHTXHouseChat({
                  variables: {
                    addHtxHouseChatInput: {
                      htxHouseId: values.htxHouseId,
                      message: values.Message,
                    },
                  },
                });
              }

              await resetForm();

              for (let i = 2; i <= PageChat; i++) {
                setTimeout(function timer() {
                  setPageChat(i);
                }, i * 500);
              }
              // if (isEditChat.isEdit) {
              //   refChat.current.scrollTo(0, nowHeightScroll);
              // }
              // console.log("values", values);
              // console.log("slug id", slug);
              setSubmitting(false);
            }}
          >
            {() => (
              <Form style={{ width: "100%" }}>
                {isEditChat.isEdit ? (
                  <Text color="#5C068C" fontWeight="bold" fontSize="lg">
                    Edit Message
                  </Text>
                ) : null}

                <Stack
                  direction="row"
                  align="flex-start"
                  spacing="2"
                  w="full"
                  justifyContent="center"
                  alignItems="center"
                  verticalAlign="middle"
                  height="full"
                >
                  <Stack
                    direction="row"
                    border="1px"
                    borderColor="gray.300"
                    borderRadius="md"
                    spacing="1"
                    width="full"
                    height="unset"
                    p="2"
                  >
                    <VStack w="full">
                      <TextInput
                        id="Message"
                        name="Message"
                        placeholder="Type A Message"
                        borderColor="transparent"
                        maxLength={20}
                        _hover={{
                          borderColor: "transparent",
                        }}
                        _focus={{
                          borderColor: "transparent",
                        }}
                      />
                    </VStack>
                    <VStack
                      w={{
                        base: "35%",
                        "2xl": "20%",
                      }}
                    >
                      <Select
                        width="100%"
                        bgColor="#7D7D7D"
                        isCustomField
                        id="htxHouseId"
                        name="htxHouseId"
                        placeholder="Send as:[House Name]"
                        backgroundColor="white"
                        data={ListHTXHouses.map((item) => ({
                          label: item.name,
                          value: item.id,
                        }))}
                      />
                    </VStack>
                  </Stack>
                  <ButtonGroup>
                    <IconButton
                      size="sm"
                      fontSize="1.4rem"
                      bg={isEditChat.isEdit ? "transparent" : "#5C068C"}
                      color={isEditChat.isEdit ? "black" : "white"}
                      isLoading={isSubmitting || isLoadingSendChat}
                      isRound
                      aria-label="Approve"
                      icon={
                        isEditChat.isEdit ? (
                          <IoSaveSharp />
                        ) : (
                          <MdSend fill="white" />
                        )
                      }
                      type="submit"
                      // onClick={onClick}
                      _hover={{
                        background: isEditChat.isEdit
                          ? "transparent"
                          : "#5C068C",
                      }}
                    />
                    {isEditChat.isEdit ? (
                      <IconButton
                        size="sm"
                        fontSize="1.4rem"
                        bg="transparent"
                        color="black"
                        isLoading={isSubmitting || isLoadingSendChat}
                        isRound
                        aria-label="Approve"
                        icon={<FaTimes fill="black" />}
                        type="button"
                        onClick={() =>
                          setEditChat({
                            isEdit: false,
                            message: "",
                            htxHouseId: "",
                            id: "",
                          })
                        }
                        _hover={{
                          background: "transparent",
                        }}
                      />
                    ) : null}
                  </ButtonGroup>
                </Stack>
              </Form>
            )}
          </Formik>
        </Stack>
      </Stack>
      <ConfirmDialog
        isOpen={isOpenDeleteDialog.openDeleteDialog}
        onClose={() =>
          setOpenDeleteDialog({
            id: "",
            openDeleteDialog: false,
          })
        }
        onConfirmAction={async () => {
          await setPageChat(1);
          await fetchDeleteHTXHouseChat({
            variables: {
              id: isOpenDeleteDialog.id,
            },
          });
          // await setPageChat(1);
          for (let i = 2; i <= PageChat; i++) {
            setTimeout(function timer() {
              setPageChat(i);
            }, i * 500);
          }
          // await fetchEventsAgenda();
        }}
        header="Delete Entry"
        body="Deleting an entry cannot be undone. Are you sure you wish to delete this entry?"
        type="delete"
      />
    </Panel>
  );
};

export default HTXHousesChat;
