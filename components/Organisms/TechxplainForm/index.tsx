import PDFUpload from "@/components/Atoms/PDFUpload";
import TextInput from "@/components/Atoms/TextInput";
import Panel from "@/components/Molecules/Panel";
import { BG_GRADIENT } from "@/constants/ui";
import {
  optionalFile,
  requiredFile,
  requiredString,
  requiredUrl,
} from "@/constants/validationSchema";
import {
  useTechxplainInsert,
  useTechxplainPageGetById,
  useTechxplainUpdate,
} from "@/hooks/techxplain";
import { useUploadFilePDFViaAPI, useUploadFileViaAPI } from "@/hooks/upload";
import { TTechxplainForm } from "@/types/techxplain";
import { MediaFolderType } from "@/types/upload";
import { Button, ButtonGroup } from "@chakra-ui/button";
import { Image } from "@chakra-ui/image";
import { Box, Stack, VStack } from "@chakra-ui/layout";
import { IoMdLink } from "react-icons/io";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import { FC, useCallback, useEffect, useState } from "react";
import { object } from "yup";

const TechxplainFormInitialValues: TTechxplainForm = {
  id: "",
  title: "",
  url: "",
  urls: "",
};

const validationSchemaInsert = object({
  title: requiredString,
  urls: requiredFile,
});
const validationSchemaUpdate = object({
  title: requiredString,
});

interface TechxplainFormArgs {
  breadcrumbItem: (item: string) => void;
}

export const TechxplainForm: FC<TechxplainFormArgs> = ({ breadcrumbItem }) => {
  const router = useRouter();
  const { slug } = router.query;

  const [initialValues, setInitialValues] = useState<TTechxplainForm>(
    TechxplainFormInitialValues
  );

  const { fetchUploadFilePDF } = useUploadFilePDFViaAPI();
  const { mutationAddTechxplain } = useTechxplainInsert();
  const { mutationEditTechxplain } = useTechxplainUpdate();
  const { fetchTechxplainById, data } = useTechxplainPageGetById(
    slug as string
  );
  console.log("object", data);
  useEffect(() => {
    if (slug !== undefined && (slug as string) !== "new") {
      fetchTechxplainById();
    }
  }, [fetchTechxplainById, slug]);

  useEffect(() => {
    if (slug !== undefined && slug === "new") {
      breadcrumbItem("New");
      setInitialValues(TechxplainFormInitialValues);
    } else {
      if (data !== undefined) {
        breadcrumbItem(data.getTechxplainById.title);
        setInitialValues({
          id: data.getTechxplainById.id,
          title: data.getTechxplainById.title,
          url: data.getTechxplainById.url,
          urls: data.getTechxplainById.techxplainAssets.map((item) => item.url),
        });
      }
    }
  }, [slug, fetchTechxplainById, data, breadcrumbItem]);

  const submitForm = useCallback(
    async (values: TTechxplainForm) => {
      // Thumbnail
      let mediaUrl: string[] = [];
      if (values.urls instanceof File) {
        // NOTE: upload separately and save the URL
        const dataFile = await fetchUploadFilePDF({
          file: values.urls,
          folder: MediaFolderType.TECHXPLAIN,
          height: "3508",
          width: "2480",
        });
        mediaUrl = dataFile.data;
      } else {
        mediaUrl = values.urls as string[];
      }

      if (slug !== undefined && slug === "new") {
        const properValues = {
          addTechxplainInput: {
            title: values.title,
            url: values.url,
            urls: mediaUrl,
          },
        };
        // console.log({ properValues });
        await mutationAddTechxplain({
          variables: properValues,
        });
      } else {
        const properValues = {
          editTechxplainInput: {
            id: slug as string,
            title: values.title,
            url: values.url,
            urls: mediaUrl,
          },
        };
        // console.log({ properValues });
        await mutationEditTechxplain({
          variables: properValues,
        });
      }
    },
    [mutationAddTechxplain, mutationEditTechxplain, slug, fetchUploadFilePDF]
  );

  return (
    <Formik
      enableReinitialize
      validationSchema={
        slug !== undefined && (slug as string) === "new"
          ? validationSchemaInsert
          : validationSchemaUpdate
      }
      initialValues={initialValues}
      onSubmit={async (values) => {
        await submitForm(values);
      }}
    >
      {({ isSubmitting, resetForm }) => (
        <Form style={{ width: "100%" }}>
          <Stack direction={["column", "row"]} align="flex-start" spacing="10">
            <VStack spacing="6" w={["100%", "50%"]} alignItems="flex-start">
              <TextInput
                name="title"
                label="Title"
                id="title"
                placeholder="Title"
              />
              <TextInput
                LeftElement={<IoMdLink style={{ fill: "#6A2095" }} />}
                name="url"
                label="URL"
                id="urlInput"
                placeholder="URL"
              />
              <Box width="100%">
                <PDFUpload
                  name="urls"
                  type="application/pdf"
                  accept="application/pdf"
                  label="FILE UPLOAD"
                />
              </Box>
            </VStack>
            {slug !== undefined && (slug as string) !== "new" && (
              <VStack w={["100%", "50%"]}>
                <Panel label="PREVIEW">
                  {data !== undefined && (
                    <Image
                      src={data.getTechxplainById.techxplainAssets[0].url}
                      alt="Preview"
                    />
                  )}
                </Panel>
              </VStack>
            )}
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
export default TechxplainForm;
