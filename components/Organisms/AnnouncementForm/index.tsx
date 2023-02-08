import React, { FC, useEffect, useState } from "react";
import { Form, Formik } from "formik";
import { Stack, VStack } from "@chakra-ui/layout";

import { Button, ButtonGroup } from "@chakra-ui/button";
import { useRouter } from "next/router";

import TextInput from "@/components/Atoms/TextInput";

import {
  announcementInitialValues,
  announcementValidationSchema,
} from "@/constants/announcement";

import { BG_GRADIENT } from "@/constants/ui";

import {
  useAnnouncementAddSubmit,
  useAnnouncementDetail,
  useAnnouncementEditSubmit,
} from "@/hooks/announcement";

import { TAnnouncementInitialValue } from "@/types/announcement";
import RichTextInput from "@/components/Atoms/RichTextInput";
import Switch from "@/components/Atoms/Switch";
import { FormControl, FormLabel } from "@chakra-ui/form-control";

interface AnnouncementFormProps {
  breadcrumbItem: (item: string) => void;
}

const AnnouncementForm: FC<AnnouncementFormProps> = ({ breadcrumbItem }) => {
  const [isSubmitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { slug } = router.query;
  const id = slug as string;
  const { getSponsor, response } = useAnnouncementDetail(id);
  const { announcementEditSubmit, loading: loadingEdit } =
    useAnnouncementEditSubmit();
  const {
    announcementAddSubmit,
    response: responseAdd,
    loading: loadingAdd,
  } = useAnnouncementAddSubmit();
  const [dataAnnouncement, setDataAnnouncement] =
    useState<TAnnouncementInitialValue>(announcementInitialValues);

  // get sponsor
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
      breadcrumbItem("New");
      setSubmitting(loadingAdd);
    }
  }, [isSubmitting, loadingEdit, loadingAdd, id, breadcrumbItem]);

  // redirect after success add sponsor
  useEffect(() => {
    if (responseAdd !== undefined) router.push("/announcement");
  }, [responseAdd, router]);

  useEffect(() => {
    if (response) {
      let tempData = response.getAnnouncementById;
      breadcrumbItem("Edit");
      setDataAnnouncement(tempData);
    }
  }, [setDataAnnouncement, dataAnnouncement, response, breadcrumbItem]);

  return (
    <Formik
      enableReinitialize
      initialValues={dataAnnouncement}
      validationSchema={announcementValidationSchema}
      onSubmit={async (values) => {
        // Submit data
        if (id !== "new") {
          await announcementEditSubmit({
            variables: {
              id: id,
              text: values.text,
              active: values.active,
            },
          });
        } else {
          await announcementAddSubmit({
            variables: {
              text: values.text,
              active: values.active,
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
                  <RichTextInput
                    name="text"
                    label="ANNOUNCEMENT TEXT"
                    id="text"
                  />
                  <FormControl>
                    <FormLabel fontWeight="bold" textTransform="uppercase">
                      Publish
                    </FormLabel>
                    <Switch name="active" id={"active"} />
                  </FormControl>
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

export default AnnouncementForm;
