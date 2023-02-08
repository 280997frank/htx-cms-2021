import DatePicker from "@/components/Atoms/DatePicker";
import MediaUpload from "@/components/Atoms/MediaUpload";
import TextInput from "@/components/Atoms/TextInput";
import TimePicker from "@/components/Atoms/TimePicker";
import { BG_GRADIENT } from "@/constants/ui";
import {
  // offsetDateStart,
  whatsupInitialValues,
  whatsupValidationSchema,
} from "@/constants/whatsup";
import { /* useUploadFile, */ useUploadFileViaAPI } from "@/hooks/upload";
import {
  useWhatsupAddSubmit,
  useWhatsupDetail,
  useWhatsupEditSubmit,
} from "@/hooks/whatsup";
import { MediaFolderType } from "@/types/upload";
import { TWhatsupInitialValue } from "@/types/whatsup";
import { Button, ButtonGroup } from "@chakra-ui/button";
import { HStack, Stack, VStack } from "@chakra-ui/layout";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React, { FC, useEffect, useState } from "react";
import { AiOutlineMail } from "react-icons/ai";

interface WhatsupFormProps {
  breadcrumbItem: (item: string) => void;
}

const WhatsupForm: FC<WhatsupFormProps> = ({ breadcrumbItem }) => {
  dayjs.extend(customParseFormat);
  const [isSubmitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { slug } = router.query;
  const id = slug as string;
  const { getSponsor, response } = useWhatsupDetail(id);
  const { whatsupEditSubmit, loading: loadingEdit } = useWhatsupEditSubmit();
  const [dataWhatsup, setDataWhatsup] =
    useState<TWhatsupInitialValue>(whatsupInitialValues);
  const { whatsupAddSubmit, loading: loadingAdd } = useWhatsupAddSubmit();
  // const { uploadFile } = useUploadFile();
  const { fetchUploadFile } = useUploadFileViaAPI();

  // get whatsup
  useEffect(() => {
    if (id && id !== "new") {
      getSponsor();
    }
  }, [getSponsor, id]);

  // set loading status
  useEffect(() => {
    if (id !== "new") {
      setSubmitting(loadingEdit);
    } else {
      setSubmitting(loadingAdd);
    }
  }, [isSubmitting, loadingEdit, loadingAdd, id]);

  // set value response update
  useEffect(() => {
    if (response) {
      let tempDataWhatsup = response.detailWhatsUp;
      breadcrumbItem(tempDataWhatsup.title);
      let tempResultData: TWhatsupInitialValue = Object.assign(
        {
          dDate: dayjs(tempDataWhatsup.date, "YYYY-MM-DDTHH:mm:ss.000Z").format(
            "DD/MM/YYYY"
          ),
          tDate: dayjs(tempDataWhatsup.date, "YYYY-MM-DDTHH:mm:ss.000Z").format(
            "HH:mm"
          ),
          dRegisterBy: dayjs(
            tempDataWhatsup.registerBy,
            "YYYY-MM-DDTHH:mm:ss.000Z"
          ).format("DD/MM/YYYY"),
          tRegisterBy: dayjs(
            tempDataWhatsup.registerBy,
            "YYYY-MM-DDTHH:mm:ss.000Z"
          ).format("HH:mm"),
        },
        tempDataWhatsup
      );
      setDataWhatsup(tempResultData);
    }
  }, [response, breadcrumbItem]);

  return (
    <Formik
      enableReinitialize
      initialValues={dataWhatsup}
      validationSchema={whatsupValidationSchema}
      onSubmit={async (values) => {
        let UrlFile = "";

        // Process date
        const date = dayjs(
          `${values.dDate}/${values.tDate}`,
          "DD/MM/YYYY/HH:mm"
        ).format(`YYYY-MM-DDTHH:mm:ss.000Z`);

        const registerBy = dayjs(
          `${values.dRegisterBy} ${values.tRegisterBy}`,
          "DD/MM/YYYY/HH:mm"
        ).format(`YYYY-MM-DDTHH:mm:ss.000Z`);

        if (values.image instanceof File) {
          const dataFile = await fetchUploadFile({
            file: values.image,
            folder: MediaFolderType.WHATS_UP,
          });
          UrlFile = dataFile.data;
        } else {
          UrlFile = values.image;
        }

        // Submit data
        if (id !== "new") {
          await whatsupEditSubmit({
            variables: {
              id: id,
              title: values.title,
              image: UrlFile,
              date: date,
              registerBy: registerBy,
              venueName: values.venueName,
              contactName: values.contactName,
              contactPhone: values.contactPhone,
            },
          });
        } else {
          await whatsupAddSubmit({
            variables: {
              title: values.title,
              image: UrlFile,
              date: date,
              registerBy: registerBy,
              venueName: values.venueName,
              contactName: values.contactName,
              contactPhone: values.contactPhone,
            },
          });
        }
      }}
    >
      {({ resetForm }) => (
        <Form style={{ width: "100%" }}>
          <Stack direction={["column", "row"]} align="flex-start" spacing="10">
            <VStack spacing="6" w={["100%", "60%"]}>
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
                    id="title"
                    placeholder="Event Title"
                  />
                  <TextInput
                    name="venueName"
                    label="VENUE"
                    id="venueName"
                    placeholder="Venue name"
                  />
                  <HStack w={["100%", "100%"]} spacing={6}>
                    <DatePicker name="dDate" label="DATE" />
                    <DatePicker name="dRegisterBy" label="REGISTER BY" />
                  </HStack>
                  <HStack w={["100%", "100%"]} spacing={6}>
                    <TimePicker name="tDate" label="TIME" />
                    <TimePicker name="tRegisterBy" label="&nbsp;" />
                  </HStack>
                  <VStack
                    bgColor="white"
                    w={["100%", "100%"]}
                    p={4}
                    borderStyle="solid"
                    borderWidth="thin"
                    borderRadius={6}
                    spacing={6}
                  >
                    <TextInput
                      name="contactName"
                      label="NAME"
                      id="contactName"
                      placeholder="Contact Name"
                    />
                    <TextInput
                      name="contactPhone"
                      label="EMAIL"
                      id="contactPhone"
                      placeholder="Email"
                      LeftElement={<AiOutlineMail stroke="url(#gradient)" />}
                    />
                  </VStack>
                </VStack>
              </Stack>
            </VStack>
            <VStack spacing="6" w={["100%", "40%"]}>
              <MediaUpload
                name="image"
                type="image"
                accept="image"
                label="THUMBNAIL UPLOAD"
                aspectRatio="1:1"
              />
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
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </ButtonGroup>
        </Form>
      )}
    </Formik>
  );
};

export default WhatsupForm;
