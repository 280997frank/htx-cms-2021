import MediaUpload from "@/components/Atoms/MediaUpload";
import TextInput from "@/components/Atoms/TextInput";
import { BG_GRADIENT } from "@/constants/ui";
import { requiredString } from "@/constants/validationSchema";
import {
  useAddEventHighlight,
  useGetByIdEventHighlight,
  useUpdateEventHighlight,
} from "@/hooks/event-highlight";
import { useUploadMultiFileViaAPI } from "@/hooks/upload";
import {
  DetailResponseEventHighlight,
  EventHighlightAsset,
  IEventHighlightRequest,
} from "@/types/event-highlight";
import { MediaFolderType } from "@/types/upload";
import { Button, ButtonGroup } from "@chakra-ui/button";
import Icon from "@chakra-ui/icon";
import { Grid, Stack, Text, VStack } from "@chakra-ui/layout";
import { Box, Flex, FormLabel } from "@chakra-ui/react";
import arrayMove from "array-move";
import { FieldArray, Form, Formik } from "formik";
import { isNil } from "lodash";
import { useRouter } from "next/router";
import React, { FC, useCallback, useEffect, useState } from "react";
import SortableList, { SortableItem } from "react-easy-sort";
import { MdAdd } from "react-icons/md";
import { object } from "yup";

const FormValidation = object({
  title: requiredString,
});

const EventHighlighForm: FC = () => {
  const router = useRouter();
  const { slug }: any = router.query;
  const [initialForm, setInitialForm] = useState<IEventHighlightRequest | any>({
    title: "",
    medias: [],
  });
  const [items, setItems] = useState<EventHighlightAsset[]>([]);

  const {
    fetchByIdEventHighlight,
    loading: loadingDetail,
    data: dataDetail,
  } = useGetByIdEventHighlight(slug);

  useEffect(() => {
    if (slug && slug !== "new") {
      fetchByIdEventHighlight();
    }
  }, [fetchByIdEventHighlight, slug]);

  useEffect(() => {
    if (dataDetail) {
      let { detailEventHighlight } = dataDetail as DetailResponseEventHighlight;
      const newEventHighlightMedia: EventHighlightAsset[] =
        detailEventHighlight.eventHighlightMedia.map((item) => ({
          id: (Math.random() + 1).toString(36).substring(2),
          image: item.image,
        }));
      setInitialForm({
        id: detailEventHighlight.id,
        title: detailEventHighlight.title,
        medias: newEventHighlightMedia,
      });
      setItems(newEventHighlightMedia);
    }
  }, [dataDetail]);

  const handleOnDragEnd = useCallback(
    (oldIndex: number, newIndex: number) => {
      const newItems = arrayMove(items, oldIndex, newIndex);
      console.log("newItems", newItems);
      setItems(newItems);
      // setItems((items) => arrayMove(items, oldIndex, newIndex));
      if (!isNil(dataDetail)) {
        let { detailEventHighlight } =
          dataDetail as DetailResponseEventHighlight;
        setInitialForm({
          id: detailEventHighlight.id,
          title: detailEventHighlight.title,
          medias: newItems,
        });
      } else {
        setInitialForm({
          title: "",
          medias: newItems,
        });
      }
    },
    [items, dataDetail]
  );

  // const { fetchAddEventHighlight } = useAddEventHighlight();
  const {
    fetchAddEventHighlight,
    loading: loadingPost,
    data: responseData,
  } = useAddEventHighlight();
  const { fetchUploadMultiFile } = useUploadMultiFileViaAPI();
  const { fetchUpdateEventHighlight, loading } = useUpdateEventHighlight();
  return (
    <Formik
      enableReinitialize
      initialValues={initialForm}
      validationSchema={FormValidation}
      onSubmit={async (values, { resetForm, setSubmitting }) => {
        // filter medias array fields
        const files = values.medias
          .filter((item: any, i: number) => {
            return {
              sequence: i,
              image: item.image,
            };
          })
          .map((item: any, i: number) => {
            return {
              sequence: i,
              image: item.image,
            };
          });

        // get URLs only
        const fileUrls = files.filter((item: any) => {
          if (!(item instanceof File))
            return {
              sequence: item.sequence,
              image: item.image,
            };
        });

        // get Files only
        const fileInstance = files.filter((item: any) => {
          if (item.image instanceof File)
            return {
              sequence: item.sequence,
              image: item.image,
            };
        });

        // upload file to get the URL
        let responUploadFile: any;
        if (fileInstance.length > 0) {
          const filesOnly = fileInstance.map((item: any) => item.image);
          responUploadFile = await fetchUploadMultiFile({
            files: filesOnly,
            folder: MediaFolderType.EVENTHIGHLIGHT,
          });
        } else {
          responUploadFile = {
            data: [],
          };
        }

        let newURLsAndSequences: any = [];
        responUploadFile.data.map((item: any, i: number) => {
          newURLsAndSequences.push({
            sequence: fileInstance[i].sequence,
            image: item,
          });
        });

        const newFileUrls = [] as any;
        fileUrls.map((item: any, i: number) => {
          if (item.image instanceof File) {
            newFileUrls.push({
              sequence: item.sequence,
              image: newURLsAndSequences.find(
                (single: any) => single.sequence === item.sequence
              ).image,
            });
          } else {
            newFileUrls.push({ sequence: item.sequence, image: item.image });
          }
        });

        if (slug && slug !== "new") {
          delete values.medias;
          values.medias = newFileUrls;
          // console.log({ values });

          await fetchUpdateEventHighlight({
            variables: {
              updateEventHighlightInput: {
                ...values,
              },
            },
          });
        } else {
          delete values.medias;
          values.medias = newFileUrls;
          // console.log({ values });

          await fetchAddEventHighlight({
            variables: {
              createEventHighlightInput: {
                ...values,
              },
            },
          });
        }
        setSubmitting(false);
      }}
    >
      {({ values, handleSubmit, isSubmitting, resetForm }) => (
        <Form style={{ width: "100%" }}>
          <Stack direction={["column", "row"]} align="flex-start" spacing="10">
            <VStack w="100%" textAlign="left">
              <FormLabel
                px="10px"
                w="inherit"
                fontWeight="bold"
                textTransform="uppercase"
              >
                MEDIA UPLOAD
              </FormLabel>

              <Box w="100%">
                <SortableList onSortEnd={handleOnDragEnd}>
                  <Grid w="100%" gap="2" templateColumns="repeat(2, 1fr)">
                    <FieldArray name="medias">
                      {({ remove, push }) => {
                        return (
                          <>
                            {values.medias.map((list: any, i: number) => {
                              return (
                                <SortableItem key={i}>
                                  <Flex
                                    cursor="grab"
                                    justifyContent="center"
                                    alignItems="center"
                                    userSelect="none"
                                  >
                                    <MediaUpload
                                      key={i}
                                      name={`medias.${i}.image`}
                                      type="image"
                                      accept="image"
                                      ratio={40}
                                      onRemove={() => {
                                        remove(i);
                                      }}
                                      onChange={(e: any) => {
                                        // console.log("event", e.target.files[0]);
                                        setItems((items) => [
                                          ...items,
                                          {
                                            id: (Math.random() + 1)
                                              .toString(36)
                                              .substring(2),
                                            image: e.target.files[0],
                                          },
                                        ]);
                                      }}
                                    />
                                  </Flex>
                                </SortableItem>
                              );
                            })}
                            <Button
                              border="2px dashed #5C058C"
                              bg="transparent"
                              borderRadius="1rem"
                              w="100%"
                              color="#5C058C"
                              h="100%"
                              p="8%"
                              textAlign="center"
                              justifyContent="center"
                              display="flex"
                              flexDir="column"
                              _focus={{ border: "2px dashed #5C058C" }}
                              onClick={() => {
                                push({
                                  id: (Math.random() + 1)
                                    .toString(36)
                                    .substring(2),
                                });
                              }}
                            >
                              <Icon
                                color="#5C058C"
                                as={MdAdd}
                                fontSize="3rem"
                              />
                              <Text>Add</Text>
                            </Button>
                          </>
                        );
                      }}
                    </FieldArray>
                  </Grid>
                </SortableList>
              </Box>
            </VStack>
            <VStack spacing="4" w={["100%", "40%"]}>
              <Stack
                direction={["row"]}
                align="flex-start"
                spacing="10"
                width="100%"
              >
                <VStack spacing="6" w={["100%", "100%"]}>
                  <TextInput
                    name="title"
                    label="Title"
                    id="name"
                    placeholder="Event Title"
                  />
                </VStack>
              </Stack>
            </VStack>
          </Stack>

          <ButtonGroup mt="8">
            <Button
              bgImage={BG_GRADIENT}
              color="white"
              isLoading={isSubmitting}
              type="submit"
            >
              Save Changes
            </Button>
            <Button
              variant="outline"
              color="gray.500"
              bg="white"
              disabled={isSubmitting}
              onClick={() => router.push("/event-highlights")}
            >
              Cancel
            </Button>
          </ButtonGroup>
        </Form>
      )}
    </Formik>
  );
};

export default EventHighlighForm;
