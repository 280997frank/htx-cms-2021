import _ from "lodash";
import { object } from "yup";
import Icon from "@chakra-ui/icon";
import { MdAdd } from "react-icons/md";
import { useRouter } from "next/router";
import { IoMdLink } from "react-icons/io";
import { BG_GRADIENT } from "@/constants/ui";
import { MediaFolderType } from "@/types/upload";
import { FormLabel } from "@chakra-ui/form-control";
import TextInput from "@/components/Atoms/TextInput";
import React, { FC, useEffect, useState } from "react";
import { Button, ButtonGroup } from "@chakra-ui/button";
import MediaUpload from "@/components/Atoms/MediaUpload/";
import { useUploadMultiFileViaAPI } from "@/hooks/upload";
import { FieldArray, Form, Formik, ErrorMessage } from "formik";
import { Grid, Stack, VStack, Text, Box } from "@chakra-ui/layout";
import {
  requiredString,
  requiredUrl,
  arrayOfRequiredFilesObject,
} from "@/constants/validationSchema";
import {
  ITechxchangeRequest,
  DetailResponseTechxchange,
} from "@/types/techxchange";
import {
  useAddTechxchange,
  useGetByIdTechxchange,
  useUpdateTechxchange,
} from "@/hooks/techxchange";

// import "react-day-picker/lib/style.css";

const FormValidation = object({
  title: requiredString,
  subTitle: requiredString,
  urls: arrayOfRequiredFilesObject,
});

const TechxchangeForm: FC = () => {
  const router = useRouter();
  const { id: idTechxchange, title }: any = router.query;
  const [initialForm, setInitialForm] = useState<ITechxchangeRequest | any>({
    title: "",
    subTitle: "",
    QRCodeUrl: "",
    urls: [{ id: (Math.random() + 1).toString(36).substring(2) }],
  });

  const { fetchAddTechxchange } = useAddTechxchange();

  const { fetchUploadMultiFile } = useUploadMultiFileViaAPI();

  const { fetchUpdateTechxchange } = useUpdateTechxchange();

  const {
    fetchByIdTechxchange,
    loading: loadingDetail,
    data: dataDetail,
  } = useGetByIdTechxchange(idTechxchange);

  useEffect(() => {
    if (idTechxchange) {
      fetchByIdTechxchange();
    }
  }, [fetchByIdTechxchange, idTechxchange]);

  useEffect(() => {
    if (dataDetail) {
      let { getTechxchangeById } = dataDetail as DetailResponseTechxchange;
      setInitialForm({
        id: getTechxchangeById.id,
        title: getTechxchangeById.title,
        subTitle: getTechxchangeById.subTitle,
        QRCodeUrl: getTechxchangeById.QRCodeUrl,
        urls: getTechxchangeById.techxchangeAssets,
      });
    }
  }, [dataDetail]);

  return (
    <Formik
      enableReinitialize
      validationSchema={FormValidation}
      initialValues={initialForm}
      onSubmit={async (values, { resetForm, setSubmitting }) => {
        const files = values.urls
          .filter((item: any) => {
            return item.url;
          })
          .map((item: any) => {
            return item.url;
          });
        const fileUrls = files.filter((item: any) => {
          if (!(item instanceof File)) return item;
        });
        const fileInstance = files.filter((item: any) => {
          if (item instanceof File) return item;
        });
        let responUploadFile: any;
        if (fileInstance.length > 0) {
          responUploadFile = await fetchUploadMultiFile({
            files: fileInstance,
            folder: MediaFolderType.TECHXCHANGE,
          });
        } else {
          responUploadFile = {
            data: [],
          };
        }
        if (idTechxchange && title) {
          const updated: any = await fetchUpdateTechxchange({
            variables: {
              editTechxchangeInput: {
                ...values,
                urls: [...fileUrls, ...responUploadFile.data],
              },
            },
          });
          // router.push("/techxchange");
          // fetchByIdTechxchange()
          if (updated?.data) {
            router.push(
              {
                pathname: router.pathname,
                query: {
                  id: idTechxchange,
                  title: encodeURIComponent(
                    updated?.data?.editTechxchange?.title
                  ),
                },
              },
              undefined,
              { shallow: true }
            );
          }
        } else {
          await fetchAddTechxchange({
            variables: {
              addTechxchangeInput: { ...values, urls: responUploadFile.data },
            },
          });
          // resetForm();
        }
        setSubmitting(false);
      }}
    >
      {({ values, handleSubmit, isSubmitting, touched, errors }) => (
        <Form style={{ width: "100%" }} onSubmit={handleSubmit}>
          <Stack direction={["column", "row"]} align="flex-start" spacing="10">
            <VStack spacing="4" w={["100%", "40%"]}>
              <Stack
                direction={["row"]}
                align="flex-start"
                spacing="10"
                width="100%"
              >
                <VStack spacing="6" w={["100%", "100%"]}>
                  <Stack width="100%">
                    <label style={{ fontWeight: "bold" }}>TITLE</label>
                    <TextInput
                      name="title"
                      label=""
                      id="title"
                      isDisabled={loadingDetail}
                      placeholder="Event Title"
                    />
                  </Stack>
                  <Stack width="100%">
                    <label style={{ fontWeight: "bold" }}>SUBTITLE</label>
                    <TextInput
                      name="subTitle"
                      label=""
                      id="subtitle"
                      isDisabled={loadingDetail}
                      placeholder="Subtitle"
                    />
                  </Stack>
                  <Stack width="100%">
                    <label style={{ fontWeight: "bold" }}>URL</label>
                    <TextInput
                      LeftElement={<IoMdLink style={{ fill: "#6A2095" }} />}
                      name="QRCodeUrl"
                      label=""
                      id="QRCodeUrl"
                      isDisabled={loadingDetail}
                      placeholder="URL"
                    />
                  </Stack>
                </VStack>
              </Stack>
            </VStack>
            <VStack w="100%" textAlign="left">
              <FormLabel
                px="10px"
                w="inherit"
                fontWeight="bold"
                textTransform="uppercase"
              >
                VIDEO UPLOAD
                <ErrorMessage name="urls">
                  {(msg: any) => (
                    <Box
                      color="red"
                      textTransform="capitalize"
                      fontWeight="normal"
                      fontSize=".8rem"
                    >
                      {_.isArray(msg)
                        ? `${
                            msg.filter(
                              (item: string) => typeof item === "string"
                            )[0]
                          }`
                        : msg}
                    </Box>
                  )}
                </ErrorMessage>
              </FormLabel>
              <Grid w="100%" gap="2" templateColumns="repeat(2, 1fr)">
                <FieldArray name="urls">
                  {({ remove, push }) => {
                    return (
                      <>
                        {values.urls.map((list: any, i: number) => {
                          return (
                            <MediaUpload
                              key={list.id}
                              name={`urls.${i}.url`}
                              type="video"
                              accept="video"
                              onRemove={() => {
                                remove(i);
                              }}
                            />
                          );
                        })}
                        <Button
                          border="2px dashed #5C058C"
                          bg="transparent"
                          borderRadius="1rem"
                          w="100%"
                          color="#5C058C"
                          h="100%"
                          p="17%"
                          textAlign="center"
                          justifyContent="center"
                          display="flex"
                          flexDir="column"
                          _focus={{ border: "2px dashed #5C058C" }}
                          onClick={() =>
                            push({
                              id: (Math.random() + 1).toString(36).substring(2),
                            })
                          }
                        >
                          <Icon color="#5C058C" as={MdAdd} fontSize="3rem" />
                          <Text>Add</Text>
                        </Button>
                      </>
                    );
                  }}
                </FieldArray>
              </Grid>
            </VStack>
          </Stack>
          <ButtonGroup mt="8">
            <Button
              bgImage={BG_GRADIENT}
              color="white"
              isLoading={isSubmitting}
              type="submit"
            >
              {idTechxchange && title ? "Save Changes" : "Save"}
            </Button>
            <Button
              variant="outline"
              color="gray.500"
              bg="white"
              onClick={() => {
                router.back();
              }}
            >
              Cancel
            </Button>
          </ButtonGroup>
        </Form>
      )}
    </Formik>
  );
};

export default TechxchangeForm;
