import MediaUpload from "@/components/Atoms/MediaUpload";
import RichTextInput from "@/components/Atoms/RichTextInput";
import TextInput from "@/components/Atoms/TextInput";
import Panel from "@/components/Molecules/Panel";
import { BG_GRADIENT } from "@/constants/ui";
import {
  requiredDescriptionSpotlight,
  requiredString,
} from "@/constants/validationSchema";
import {
  useSpotlightInsert,
  useSpotlightPageGetById,
  useSpotlightUpdate,
} from "@/hooks/spotlight";
import { useUploadFileViaAPI } from "@/hooks/upload";
import { TSpotlightForm } from "@/types/spotlight";
import { MediaFolderType } from "@/types/upload";
import { Button, ButtonGroup } from "@chakra-ui/button";
import { Stack, VStack } from "@chakra-ui/layout";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import { FC, useCallback, useEffect, useState } from "react";
import { object } from "yup";

const SpotlightFormInitialValues: TSpotlightForm = {
  title: "",
  description: "",
  thumbnailUrl: "",
};

const validationSchema = object({
  description: requiredDescriptionSpotlight,
  title: requiredString,
  // thumbnailUrl: requiredFile,
});

interface SpotlightFormArgs {
  breadcrumbItem: (item: string) => void;
}

export const SpotlightForm: FC<SpotlightFormArgs> = ({ breadcrumbItem }) => {
  const router = useRouter();
  const { slug } = router.query;

  const { fetchUploadFile } = useUploadFileViaAPI();
  const { mutationAddSpotlight } = useSpotlightInsert();
  const { mutationEditSpotlight } = useSpotlightUpdate();
  const { fetchSpotlightById, data: spotlightById } = useSpotlightPageGetById(
    slug as string
  );

  const [initialValues, setInitialValues] = useState<TSpotlightForm>(
    SpotlightFormInitialValues
  );

  useEffect(() => {
    if (slug !== undefined && (slug as string) !== "new") {
      fetchSpotlightById();
    }
  }, [fetchSpotlightById, slug]);

  useEffect(() => {
    if (slug !== undefined && slug === "new") {
      breadcrumbItem("New");
      setInitialValues(SpotlightFormInitialValues);
    } else {
      if (spotlightById !== undefined) {
        breadcrumbItem(spotlightById.getSpotlightById.title);
        setInitialValues({
          id: spotlightById.getSpotlightById.id,
          title: spotlightById.getSpotlightById.title,
          description: spotlightById.getSpotlightById.description,
          thumbnailUrl: spotlightById.getSpotlightById.thumbnailUrl,
        });
      }
    }
  }, [slug, fetchSpotlightById, spotlightById, breadcrumbItem]);

  const submitForm = useCallback(
    async (values: TSpotlightForm) => {
      // Thumbnail
      let mediaUrl = "";
      if (values.thumbnailUrl instanceof File) {
        // NOTE: upload separately and save the URL
        const dataFile = await fetchUploadFile({
          file: values.thumbnailUrl,
          folder: MediaFolderType.SPOTLIGHT,
        });
        mediaUrl = dataFile.data;
      } else {
        mediaUrl = values.thumbnailUrl;
      }

      if (slug !== undefined && slug === "new") {
        const properValues = {
          title: values.title,
          description: values.description,
          thumbnailUrl: mediaUrl,
        };
        // console.log({ properValues });
        await mutationAddSpotlight({
          variables: { addSpotlightInput: properValues },
        });
      } else {
        const properValues = {
          id: slug as string,
          title: values.title,
          description: values.description,
          thumbnailUrl: mediaUrl,
        };
        // console.log({ properValues });
        await mutationEditSpotlight({
          variables: {
            editSpotlightInput: properValues,
          },
        });
      }
    },
    [fetchUploadFile, slug, mutationAddSpotlight, mutationEditSpotlight]
  );

  return (
    <Formik
      enableReinitialize
      validationSchema={validationSchema}
      initialValues={initialValues}
      onSubmit={async (values) => {
        await submitForm(values);
      }}
    >
      {({ isSubmitting, resetForm }) => (
        <Form style={{ width: "100%" }}>
          <Stack direction={["column", "row"]} align="flex-start" spacing="10">
            <VStack spacing="6" w={["100%", "75%"]}>
              <Panel label="TITLE">
                <TextInput
                  name="title"
                  label=""
                  id="title"
                  placeholder="Title"
                />
              </Panel>
              <Stack
                direction={["row"]}
                align="flex-start"
                spacing="10"
                width="100%"
              >
                <VStack spacing="6" w={["100%", "100%"]}>
                  <Panel label="DESCRIPTION">
                    <RichTextInput
                      id="description"
                      label=""
                      name="description"
                    />
                  </Panel>
                </VStack>
              </Stack>
            </VStack>
            <VStack spacing="6" w={["100%", "25%"]}>
              <MediaUpload
                name="thumbnailUrl"
                type="image"
                accept="image"
                label="IMAGE UPLOAD"
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
export default SpotlightForm;
