import React from "react";
import { Form } from "formik";
import NextLink from "next/link";
import { HStack, Stack, VStack, ButtonGroup, Button } from "@chakra-ui/react";
import TextInput from "@/components/Atoms/TextInput";
import MediaUpload from "@/components/Atoms/MediaUpload";
import RichTextInput from "@/components/Atoms/RichTextInput";
import { BG_GRADIENT } from "@/constants/ui";
import { LinkIcon } from "@/components/Atoms/Icons";
import Select from "@/components/Atoms/Select";

interface UserWorkFormProps {
  loading: boolean;
}

const companyIndustry = [
  { label: "FMCG", value: "FMCG" },
  { label: "Banking", value: "Banking" },
  { label: "Software", value: "Software" },
  { label: "OTHERS", value: "OTHERS" },
];

const UserWorkForm = ({ loading }: UserWorkFormProps) => {
  return (
    <Form>
      <Stack direction={["column", "row"]} align="flex-start" spacing="10">
        <VStack spacing="6" w={["100%", "70%"]}>
          <HStack w="full" alignItems="flex-start">
            <TextInput
              name="company.companyName"
              label="Company Name"
              id="companyName"
              placeholder="Company name"
              bgColor="white"
            />
            <TextInput
              name="company.position"
              label="Position"
              id="position"
              placeholder="Position"
              bgColor="white"
            />
            <Select
              name="company.industry"
              label="Industry"
              id="industry"
              placeholder="Select company industry"
              bgColor="white"
              data={companyIndustry}
            />
          </HStack>
          <RichTextInput
            name="company.companyDescription"
            label="Company Description"
            id="company-description"
            style={{ backgroundColor: "white" }}
          />
        </VStack>
        <VStack spacing="6" w={["100%", "30%"]}>
          <MediaUpload
            label="Company Logo"
            name="company.companyLogo"
            type="image"
            accept="image"
            ratio={100}
          />

          <TextInput
            name="company.companyWebsite"
            label="Wesbsite"
            id="company-website"
            placeholder="URL"
            bgColor="white"
            LeftElement={<LinkIcon fill="url(#gradient)" boxSize={6} />}
          />
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
        <NextLink href="/users" passHref>
          <Button variant="outline" color="gray.500" bg="white" type="submit">
            Cancel
          </Button>
        </NextLink>
      </ButtonGroup>
    </Form>
  );
};

export default UserWorkForm;
