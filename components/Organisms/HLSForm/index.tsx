import DatePicker from "@/components/Atoms/DatePicker";
import MediaUpload from "@/components/Atoms/MediaUpload";
import TextInput from "@/components/Atoms/TextInput";
import { BG_GRADIENT } from "@/constants/ui";
import {
  requiredNumber,
  requiredString,
  requiredTiming,
} from "@/constants/validationSchema";
import {
  useHLSGetById,
  useHLSInsert,
  useHLSUpdate,
} from "@/hooks/hls-committee";
import { useHLSEntryInsert } from "@/hooks/hls-entry";
import { /* useUploadFile, */ useUploadFileViaAPI } from "@/hooks/upload";
import { HLSFormProps, SubmitHLSCommittee } from "@/types/hls-committee";
import { MediaFolderType } from "@/types/upload";
import {
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  Stack,
  VStack,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Form, Formik } from "formik";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { object } from "yup";
import EntryForm from "./entry";
import EntryTable from "./tableEntry";

const emptyValues: SubmitHLSCommittee = {
  title: "",
  date: "",
  thumbnail: "",
};

const valuesEntery = {
  name: "",
  rank: "",
  timing: "",
  distance: "",
  category: "",
};

const entryFormValidation = object({
  name: requiredString,
  timing: requiredTiming,
  rank: requiredNumber,
  category: requiredString,
  distance: requiredNumber,
});

const validationSchema = object({
  title: requiredString,
});

const CommitteeForm = ({ loading, slug }: HLSFormProps) => {
  //ADD HLS DATA
  const { mutationAddHLS, loading: loadingAdd } = useHLSInsert();

  //GET HLS DETAILS
  const {
    fetchHLSById,
    data: dataDetails,
    loading: loadingDetail,
  } = useHLSGetById(slug as string);

  //INSERT HLS ENTRY DATA
  const {
    mutationAddHLSEntry,
    data: addDataEntry,
    loading: loadingAddEntry,
  } = useHLSEntryInsert();

  //UPDATE HLS DATA
  const { loading: loadingEdit, mutationEditHLS } = useHLSUpdate();

  const { fetchUploadFile } = useUploadFileViaAPI();
  useEffect(() => {
    if (slug !== "new") {
      fetchHLSById();
    }
  }, [slug, fetchHLSById]);

  // SET INITIAL VALUE
  const initialValues: any = useMemo(() => {
    if (slug !== "new" && dataDetails) {
      const detail: any = { ...dataDetails.detailHlscomittee };
      return detail;
    } else {
      return emptyValues;
    }
  }, [slug, dataDetails]);

  return (
    <>
      <Stack direction={["column", "row"]} align="flex-start" spacing="10">
        <Stack
          direction={["column", "column"]}
          width="50%"
          align="flex-start"
          spacing="10"
        >
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            enableReinitialize
            onSubmit={async (values) => {
              dayjs.extend(customParseFormat);
              let UrlFile = "";
              let date: any = "";
              if (values.thumbnail instanceof File) {
                const dataFile = await fetchUploadFile({
                  file: values.thumbnail,
                  folder: MediaFolderType.HLS_COMMITTEE,
                });
                UrlFile = dataFile.data;
              } else {
                UrlFile = values.thumbnail;
              }

              if (slug !== "new") {
                if (values.date !== dataDetails?.detailHlscomittee.date) {
                  date = dayjs(values.date, "DD/MM/YYYY").format("MM-DD-YYYY");
                } else {
                  date = dataDetails?.detailHlscomittee.date;
                }

                console.log(date, "date");
                mutationEditHLS({
                  variables: {
                    updateHlscomitteeInput: {
                      id: slug,
                      title: values.title,
                      date: date,
                      thumbnail: UrlFile,
                    },
                  },
                });
              } else {
                date = dayjs(values.date, "DD/MM/YYYY").format("MM-DD-YYYY");
                mutationAddHLS({
                  variables: {
                    createHlscomitteeInput: {
                      title: values.title,
                      date: date,
                      thumbnail: UrlFile,
                    },
                  },
                });
              }
            }}
          >
            <Form style={{ width: "100%" }}>
              <Stack
                width="100%"
                direction={["column", "row"]}
                align="flex-start"
                spacing="10"
              >
                <VStack spacing="6" w={["100%", "30%"]}>
                  <MediaUpload
                    label="THUMBNAIL upload"
                    name="thumbnail"
                    type="image"
                    accept="image"
                    ratio={100}
                  />
                </VStack>
                <VStack spacing="6" w={["100%", "70%"]}>
                  <TextInput
                    name="title"
                    label="Title"
                    id="title"
                    placeholder="Title"
                    bgColor="white"
                    isRequired
                  />
                  <FormControl>
                    <FormLabel fontWeight="bold" textTransform="uppercase">
                      Date
                    </FormLabel>
                    <DatePicker name="date" />
                  </FormControl>
                </VStack>
              </Stack>
              <ButtonGroup mt="8">
                <Button
                  bgImage={BG_GRADIENT}
                  color="white"
                  isLoading={loading}
                  type="submit"
                >
                  Save Changes
                </Button>
                <Link href="/hls-committee" passHref>
                  <Button variant="outline" color="gray.500" bg="white">
                    Cancel
                  </Button>
                </Link>
              </ButtonGroup>
            </Form>
          </Formik>
        </Stack>

        {slug !== "new" && (
          <Stack
            direction={["row"]}
            align="flex-start"
            spacing="10"
            width="50%"
          >
            <Formik
              initialValues={valuesEntery}
              enableReinitialize
              validationSchema={entryFormValidation}
              onSubmit={async (values, { resetForm }) => {
                mutationAddHLSEntry({
                  variables: {
                    createHlscomitteeEntryInput: {
                      comitteeId: slug,
                      name: values.name,
                      timing: values.timing !== "" ? values.timing : "00:00",
                      rank: Number(values.rank),
                      distance:
                        values.distance !== ""
                          ? Number(values.distance)
                          : Number("00.00"),
                      category: values.category,
                    },
                  },
                });
                resetForm();
              }}
            >
              <EntryForm />
            </Formik>
          </Stack>
        )}
      </Stack>

      {slug !== "new" && <EntryTable slug={slug} newData={addDataEntry} />}
    </>
  );
};

export default CommitteeForm;
