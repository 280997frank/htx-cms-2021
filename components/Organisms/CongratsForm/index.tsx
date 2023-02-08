import React, { FC, useEffect, useState } from "react";
import { Form, Formik } from "formik";
import { Flex, Stack, VStack } from "@chakra-ui/layout";
import TextInput from "@/components/Atoms/TextInput";
import Panel from "@/components/Molecules/Panel";
import { IoMdHeart } from "react-icons/io";
import { FaThumbsUp } from "react-icons/fa";
import MediaUpload from "@/components/Atoms/MediaUpload";
import { Select } from "@chakra-ui/select";
import { Button, ButtonGroup } from "@chakra-ui/button";
import { BG_GRADIENT } from "@/constants/ui";
import { SimpleGrid, Box, Text, Image } from "@chakra-ui/react";
import "react-day-picker/lib/style.css";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import RichTextInput from "@/components/Atoms/RichTextInput";
import claps from "@/assets/images/claps.svg";
import fighting from "@/assets/images/fighting.svg";
import { object } from "yup";
import {
  requiredEmail,
  requiredFile,
  requiredString,
} from "@/constants/validationSchema";
import {
  useCreateCongrats,
  useEditCongrats,
  useDetailCongrats,
} from "@/hooks/congrats";
import { useRouter } from "next/router";
import { RequestCongratsById } from "@/types/congrats";
import { MediaFolderType } from "@/types/upload";
import { useUploadFileViaAPI } from "@/hooks/upload";

dayjs.extend(customParseFormat);
const CongratsFormValidation = object({
  title: requiredString,
  category: requiredString,
  subtitle: requiredString,
  name: requiredString,
  designation: requiredString,
  message: requiredString,
});

interface CongratsFormInitialValue {
  category: string;
  title: string;
  subtitle: string;
  name: string;
  designation: string;
  message: string;
  imageUrl: string | any;
}

const categoryList = [
  {
    name: "eXceeding eXpectations",
    value: "EXCEED",
  },
  {
    name: "Thanks-A-Latte",
    value: "THANK",
  },
];

interface CongratsForm {
  onChange?: any;
}

const CongratsForm: FC<CongratsForm> = ({ onChange = () => {} }) => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [initialForm, setInitialForm] = useState<CongratsFormInitialValue>({
    category: "EXCEED",
    title: "",
    subtitle: "",
    name: "",
    designation: "",
    message: "",
    imageUrl: undefined,
  });
  const [idEdit, setIdEdit] = useState<RequestCongratsById>({
    id: null,
  });
  const router = useRouter();
  const pid = router.query;
  const { fetchUploadFile } = useUploadFileViaAPI();
  //=== check params id ====
  useEffect(() => {
    if (pid.id) {
      setIdEdit({
        id: pid.id,
      });
    }
  }, [pid]);

  // ==== Get Congrats By Id ====
  const {
    fetchDetailCongrats,
    loading: isLoadingGetCongratsById,
    data: dataGetCongratsById,
  } = useDetailCongrats({
    detailCongratsInput: {
      id: idEdit.id,
    },
  });

  useEffect(() => {
    if (idEdit.id) {
      fetchDetailCongrats();
    } else {
      onChange(idEdit.id);
    }
  }, [fetchDetailCongrats, idEdit, onChange]);

  useEffect(() => {
    if (dataGetCongratsById) {
      onChange(
        dataGetCongratsById.detailCongrats.category === "eXceeding eXpectations"
          ? "EXCEED"
          : "THANK"
      );
      setInitialForm({
        category:
          dataGetCongratsById.detailCongrats.category ===
          "eXceeding eXpectations"
            ? "EXCEED"
            : "THANK",
        title: dataGetCongratsById.detailCongrats.title,
        subtitle: dataGetCongratsById.detailCongrats.subtitle,
        name: dataGetCongratsById.detailCongrats.name,
        designation: dataGetCongratsById.detailCongrats.designation,
        message: dataGetCongratsById.detailCongrats.message,
        imageUrl: dataGetCongratsById.detailCongrats.imageUrl,
      });
    }
  }, [dataGetCongratsById, onChange]);

  //=== Add CONGRATS ====
  const {
    fetchCreateCongrats,
    loading: isLoadingAddCongrats,
    data: dataAddCongrats,
  } = useCreateCongrats();

  useEffect(() => {
    if (dataAddCongrats?.createCongrats.id) {
      router.back();
    }
  }, [dataAddCongrats, router]);

  //=== Edit CONGRATS ====
  const {
    fetchUpdateCongrats,
    loading: isLoadingEditCongrats,
    data: dataEditCongrats,
  } = useEditCongrats();

  useEffect(() => {
    if (dataEditCongrats?.updateCongrats.id) {
      router.back();
    }
  }, [dataEditCongrats, router]);

  return (
    <Formik
      enableReinitialize
      validationSchema={CongratsFormValidation}
      initialValues={initialForm}
      onSubmit={async (values) => {
        setSubmitting(true);
        let UrlFile = "";

        // Upload image if type value of logo is file
        if (values.imageUrl instanceof File) {
          // NOTE: upload separately and save the URL
          try {
            const uploadResult = await fetchUploadFile({
              file: values.imageUrl,
              folder: MediaFolderType.CONGRATS,
            });
            UrlFile = uploadResult.data || "";
          } catch (e) {
            UrlFile = "";
          }
        } else {
          UrlFile = values.imageUrl;
        }
        if (idEdit.id) {
          await fetchUpdateCongrats({
            variables: {
              updateCongratsInput: {
                id: idEdit.id,
                title: values.title,
                category: values.category,
                subtitle: values.subtitle,
                name: values.name,
                email: "",
                designation: values.designation,
                message: values.message,
                imageUrl: UrlFile,
              },
            },
          });
        } else {
          await fetchCreateCongrats({
            variables: {
              createCongratsInput: {
                title: values.title,
                category: values.category,
                subtitle: values.subtitle,
                name: values.name,
                email: "",
                designation: values.designation,
                message: values.message,
                imageUrl: UrlFile,
              },
            },
          });
        }
        setSubmitting(false);
      }}
    >
      {({ values, setFieldValue, errors, isValid }) => (
        <Form style={{ width: "100%" }}>
          <Stack direction={["column", "row"]} align="flex-start" spacing="10">
            <VStack spacing="6" w={["100%", "75%"]}>
              <Stack
                direction={["row"]}
                align="flex-start"
                spacing="10"
                width="100%"
              >
                <VStack spacing="6" w={["100%", "100%"]}>
                  <Stack width="100%">
                    <label style={{ fontWeight: "bold" }}>CATEGORY</label>
                    <Flex>
                      <Select
                        style={{ background: "white" }}
                        id="category"
                        name="category"
                        isRequired={true}
                        defaultValue={""}
                        value={values.category}
                        onChange={(e) => {
                          setFieldValue("category", e.currentTarget.value);
                        }}
                      >
                        {categoryList.map((data, index) => {
                          return (
                            <option key={index} value={data.value}>
                              {data.name}
                            </option>
                          );
                        })}
                      </Select>
                    </Flex>
                  </Stack>
                  <Stack width="100%">
                    <label style={{ fontWeight: "bold" }}>TITLE</label>
                    <TextInput
                      name="title"
                      label=""
                      id="title"
                      placeholder="Title"
                    />
                  </Stack>
                  <Stack width="100%">
                    <label style={{ fontWeight: "bold" }}>SUBTITLE</label>
                    <TextInput
                      name="subtitle"
                      label=""
                      id="subtitle"
                      placeholder="Subtitle"
                    />
                  </Stack>
                  {idEdit.id ? (
                    <Stack width="100%">
                      <label style={{ fontWeight: "bold" }}>SUBTITLE</label>
                      <SimpleGrid columns={2} spacing={2}>
                        <Box
                          bg="white"
                          style={{
                            borderRadius: 10,
                            borderWidth: 1,
                            padding: 15,
                          }}
                        >
                          <Stack direction={["column"]}>
                            <FaThumbsUp
                              style={{
                                fill: "#5C068C",
                                width: 18,
                                height: 18,
                              }}
                            />
                            <Text style={{ fontSize: 14 }}>Like Count</Text>
                            <Text style={{ fontWeight: "bold", fontSize: 36 }}>
                              {dataGetCongratsById?.detailCongrats.like}
                            </Text>
                          </Stack>
                        </Box>
                        <Box
                          bg="white"
                          style={{
                            borderRadius: 10,
                            borderWidth: 1,
                            padding: 15,
                          }}
                        >
                          <Stack direction={["column"]}>
                            <IoMdHeart
                              style={{
                                fill: "#5C068C",
                                width: 20,
                                height: 20,
                              }}
                            />
                            <Text style={{ fontSize: 14 }}>Love Count</Text>
                            <Text style={{ fontWeight: "bold", fontSize: 36 }}>
                              {dataGetCongratsById?.detailCongrats.love}
                            </Text>
                          </Stack>
                        </Box>
                        <Box
                          bg="white"
                          style={{
                            borderRadius: 10,
                            borderWidth: 1,
                            padding: 15,
                          }}
                        >
                          <Stack direction={["column"]}>
                            <Image
                              style={{
                                width: 20,
                                height: 20,
                              }}
                              src={claps.src}
                              alt="logo"
                              maxW="full"
                            />
                            <Text style={{ fontSize: 14 }}>Clap Count</Text>
                            <Text style={{ fontWeight: "bold", fontSize: 36 }}>
                              {dataGetCongratsById?.detailCongrats.clap}
                            </Text>
                          </Stack>
                        </Box>
                        <Box
                          bg="white"
                          style={{
                            borderRadius: 10,
                            borderWidth: 1,
                            padding: 15,
                          }}
                        >
                          <Stack direction={["column"]}>
                            <Image
                              style={{
                                width: 18,
                                height: 18,
                                color: "black",
                              }}
                              src={fighting.src}
                              alt="logo"
                              maxW="full"
                            />
                            <Text style={{ fontSize: 14 }}>Fighting Count</Text>
                            <Text style={{ fontWeight: "bold", fontSize: 36 }}>
                              {dataGetCongratsById?.detailCongrats.clap}
                            </Text>
                          </Stack>
                        </Box>
                      </SimpleGrid>
                    </Stack>
                  ) : (
                    " "
                  )}
                </VStack>
                <VStack spacing="6" w={["100%", "100%"]}>
                  <VStack spacing="6" w={["100%", "100%"]}>
                    <Panel label="DETAILS">
                      <Stack width="100%">
                        <label style={{ fontWeight: "bold" }}>NAME</label>
                        <TextInput
                          name="name"
                          label=""
                          id="name"
                          placeholder="Name"
                        />
                      </Stack>
                      <Stack width="100%">
                        <label style={{ fontWeight: "bold" }}>
                          DESIGNATION
                        </label>
                        <TextInput
                          name="designation"
                          label=""
                          id="designation"
                          placeholder="Designation"
                        />
                      </Stack>
                      <Stack width="100%">
                        <label style={{ fontWeight: "bold" }}>MESSAGE</label>
                        <RichTextInput
                          id="message"
                          label=""
                          name="message"
                          style={{ borderRadius: "30px" }}
                        />
                      </Stack>
                    </Panel>
                  </VStack>
                </VStack>
              </Stack>
            </VStack>
            <VStack spacing="6" w={["100%", "30%"]}>
              <MediaUpload
                name="imageUrl"
                type="image"
                accept="image"
                label="IMAGE UPLOAD"
                ratio={100}
              />
            </VStack>
          </Stack>
          <ButtonGroup mt="8">
            <Button
              bgImage={BG_GRADIENT}
              color="white"
              disabled={Object.keys(errors).length > 0 || !values.imageUrl}
              isLoading={isSubmitting}
              // onClick={() => {
              //     console.log("error", errors)
              //     console.log("image", values.imageUrl)
              //     console.log(Object.keys(errors).length)
              // }}
              type="submit"
            >
              Save Changes
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

export default CongratsForm;
