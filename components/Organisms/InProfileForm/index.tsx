import MediaUpload from "@/components/Atoms/MediaUpload";
import RichTextInput from "@/components/Atoms/RichTextInput";
import TextInput from "@/components/Atoms/TextInput";
import Panel from "@/components/Molecules/Panel";
import { BG_GRADIENT, PRIMARY_COLOR } from "@/constants/ui";
import {
  requiredDescriptionInProfile,
  requiredFile,
  requiredString,
  requiredTitleInProfile,
} from "@/constants/validationSchema";
import {
  useInProfileInsert,
  useInProfilePageGetById,
  useInProfileUpdate,
} from "@/hooks/inprofile";
import { useUploadFileViaAPI } from "@/hooks/upload";
import { TInProfileForm } from "@/types/inprofile";
import { MediaFolderType } from "@/types/upload";
import { Button, ButtonGroup } from "@chakra-ui/button";
import Icon from "@chakra-ui/icon";
import {
  Box,
  Heading,
  SimpleGrid,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/layout";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import { FC, useCallback, useEffect, useState } from "react";
import { object } from "yup";
import { MdThumbUp } from "react-icons/md";
import { AiFillHeart } from "react-icons/ai";
import ClapsEmoji from "@/assets/images/claps_emoji.svg";
import { Image } from "@chakra-ui/image";

const InProfileFormInitialValues: TInProfileForm = {
  title: "",
  description: "",
  imageUrl: "",
};

const validationSchemaInProfile = object({
  description: requiredDescriptionInProfile,
  title: requiredTitleInProfile,
  imageUrl: requiredFile,
});

interface InProfileFormArgs {
  breadcrumbItem: (item: string) => void;
}

export const InProfileForm: FC<InProfileFormArgs> = ({ breadcrumbItem }) => {
  const router = useRouter();
  const { slug } = router.query;
  const [initialValues, setInitialValues] = useState<TInProfileForm>(
    InProfileFormInitialValues
  );

  const { fetchUploadFile } = useUploadFileViaAPI();
  const { mutationAddInProfile } = useInProfileInsert();
  const { mutationEditInProfile } = useInProfileUpdate();
  const { fetchInProfileById, data: inProfileById } = useInProfilePageGetById(
    slug as string
  );

  useEffect(() => {
    if (slug !== undefined && (slug as string) !== "new") {
      fetchInProfileById();
    }
  }, [fetchInProfileById, slug]);

  useEffect(() => {
    if (slug !== undefined && slug === "new") {
      breadcrumbItem("New");
      setInitialValues(InProfileFormInitialValues);
    } else {
      if (inProfileById !== undefined) {
        breadcrumbItem(inProfileById.inProfileById.title);
        setInitialValues({
          id: inProfileById.inProfileById.id,
          title: inProfileById.inProfileById.title,
          description: inProfileById.inProfileById.description,
          imageUrl: inProfileById.inProfileById.imageUrl,
        });
      }
    }
  }, [slug, fetchInProfileById, inProfileById, breadcrumbItem]);

  const submitForm = useCallback(
    async (values: TInProfileForm) => {
      // Thumbnail
      let mediaUrl = "";
      if (values.imageUrl instanceof File) {
        // NOTE: upload separately and save the URL
        const dataFile = await fetchUploadFile({
          file: values.imageUrl,
          folder: MediaFolderType.INPROFILE,
        });
        mediaUrl = dataFile.data;
      } else {
        mediaUrl = values.imageUrl;
      }

      if (slug !== undefined && slug === "new") {
        const properValues = {
          title: values.title,
          description: values.description,
          imageUrl: mediaUrl,
        };
        // console.log({ properValues });
        await mutationAddInProfile({
          variables: { param: properValues },
        });
      } else {
        const properValues = {
          id: slug as string,
          title: values.title,
          description: values.description,
          imageUrl: mediaUrl,
        };
        // console.log({ properValues });
        await mutationEditInProfile({
          variables: {
            param: properValues,
          },
        });
      }
    },
    [mutationAddInProfile, mutationEditInProfile, slug, fetchUploadFile]
  );

  return (
    <Formik
      enableReinitialize
      validationSchema={validationSchemaInProfile}
      initialValues={initialValues}
      onSubmit={async (values) => {
        await submitForm(values);
      }}
    >
      {({ isSubmitting, resetForm }) => (
        <Form style={{ width: "100%" }}>
          <Stack direction={["column", "row"]} align="flex-start" spacing="10">
            <VStack
              spacing="6"
              w={
                slug !== undefined && slug === "new"
                  ? ["100%", "75%"]
                  : ["100%", "50%"]
              }
            >
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
            {slug !== undefined && slug !== "new" && (
              <VStack spacing="6" w={["100%", "25%"]}>
                <Panel label="REACTION">
                  <SimpleGrid columns={2} spacing={2} w="100%">
                    <Box
                      border="2px"
                      borderColor="blackAlpha.300"
                      p="1rem"
                      borderRadius="0.5rem"
                    >
                      <Icon as={MdThumbUp} w={5} h={5} color={PRIMARY_COLOR} />
                      <Text color="grey" mb="0.5rem">
                        Like Count
                      </Text>
                      <Heading>
                        {inProfileById !== undefined &&
                          inProfileById.inProfileById.likes}
                      </Heading>
                    </Box>
                    <Box
                      border="2px"
                      borderColor="blackAlpha.300"
                      p="1rem"
                      borderRadius="0.5rem"
                    >
                      <Icon
                        as={AiFillHeart}
                        w={5}
                        h={5}
                        color={PRIMARY_COLOR}
                      />
                      <Text color="grey" mb="0.5rem">
                        Love Count
                      </Text>
                      <Heading>
                        {inProfileById !== undefined &&
                          inProfileById.inProfileById.loves}
                      </Heading>
                    </Box>
                    <Box
                      border="2px"
                      borderColor="blackAlpha.300"
                      p="1rem"
                      borderRadius="0.5rem"
                    >
                      <Image src={ClapsEmoji.src} alt="icon" />
                      <Text color="grey" mb="0.5rem">
                        Clap Count
                      </Text>
                      <Heading>
                        {inProfileById !== undefined &&
                          inProfileById.inProfileById.claps}
                      </Heading>
                    </Box>
                    <Box
                      border="2px"
                      borderColor="blackAlpha.300"
                      p="1rem"
                      borderRadius="0.5rem"
                    >
                      <Text color="transparent" textShadow="0 0 0 #5C068C">
                        &#x1F4AA;
                      </Text>
                      <Text color="grey" mb="0.5rem">
                        Fighting Count
                      </Text>
                      <Heading>
                        {inProfileById !== undefined &&
                          inProfileById.inProfileById.fightings}
                      </Heading>
                    </Box>
                  </SimpleGrid>
                </Panel>
              </VStack>
            )}
            <VStack spacing="6" w={["100%", "25%"]}>
              <MediaUpload
                name="imageUrl"
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
export default InProfileForm;
