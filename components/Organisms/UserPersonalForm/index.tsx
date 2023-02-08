import React from "react";
import { Form } from "formik";
import {
  HStack,
  Stack,
  VStack,
  ButtonGroup,
  Button,
  Text,
} from "@chakra-ui/react";
import NextLink from "next/link";
import Panel from "@/components/Molecules/Panel";
import TextInput from "@/components/Atoms/TextInput";
import {
  FacebookIcon,
  LinkedinIcon,
  LinkIcon,
  TwitterIcon,
} from "@/components/Atoms/Icons";
import Select from "@/components/Atoms/Select";
import MediaUpload from "@/components/Atoms/MediaUpload";
import RichTextInput from "@/components/Atoms/RichTextInput";
import Switch from "@/components/Atoms/Switch";
import TagInput from "@/components/Molecules/TagInput";
import { BG_GRADIENT } from "@/constants/ui";
import countries from "@/constants/countries";
import { userRole } from "@/constants/users";

interface UserPersonalFormProps {
  loading: boolean;
  slug: string;
}

const UserPersonalForm = ({ loading, slug }: UserPersonalFormProps) => {
  return (
    <Form>
      <Stack direction={["column", "row"]} align="flex-start" spacing="10">
        <VStack spacing="6" w={["100%", "70%"]}>
          <HStack w="full" alignItems="flex-start">
            <TextInput
              name="fullname"
              label="Name"
              id="fullname"
              placeholder="User name"
              bgColor="white"
            />
            <Select
              name="roles"
              label="Role"
              id="roles"
              placeholder="Select role"
              bgColor="white"
              data={userRole}
            />
          </HStack>
          <HStack w="full" alignItems="flex-start">
            <Select
              name="country"
              label="Country"
              id="country"
              data={countries.map((item) => ({
                label: item.name,
                value: item.name,
              }))}
              placeholder="Country of residence"
              bgColor="white"
            />
            <TextInput
              name="email"
              label="Email"
              id="email"
              placeholder="User email"
              bgColor="white"
              isDisabled={slug !== "new"}
            />
            <TextInput
              name="phoneNumber"
              label="Phone Number"
              id="phoneNumber"
              placeholder="User phone number"
              bgColor="white"
            />
          </HStack>
          <RichTextInput
            name="aboutMe"
            label="About me"
            id="aboutMe"
            style={{ backgroundColor: "white" }}
          />
          <Panel label="Interests">
            <TagInput
              type="INTEREST"
              name="interests"
              id="interests"
              placeholder="Search"
            />
          </Panel>
        </VStack>
        <VStack spacing="6" w={["100%", "30%"]}>
          <MediaUpload
            label="Profile Picture"
            name="profilePicture"
            type="image"
            accept="image"
            ratio={100}
          />
          <Panel label="Connection">
            <VStack w="full">
              <HStack justifyContent="space-between" w="full">
                <Text fontWeight="bold" as="label" htmlFor="facebook.url">
                  FACEBOOK
                </Text>
                <Switch
                  name="connection.facebook.isActive"
                  id="facebook.isActive"
                />
              </HStack>
              <TextInput
                name="connection.facebook.url"
                id="facebook.url"
                placeholder="URL"
                LeftElement={<FacebookIcon fill="url(#gradient)" boxSize={6} />}
              />
            </VStack>
            <VStack w="full">
              <HStack justifyContent="space-between" w="full">
                <Text fontWeight="bold" as="label" htmlFor="linkedin.url">
                  LINKEDIN
                </Text>
                <Switch
                  name="connection.linkedin.isActive"
                  id="linkedin.isActive"
                />
              </HStack>
              <TextInput
                name="connection.linkedin.url"
                id="linkedin.url"
                placeholder="URL"
                LeftElement={<LinkedinIcon fill="url(#gradient)" boxSize={6} />}
              />
            </VStack>
            <VStack w="full">
              <HStack justifyContent="space-between" w="full">
                <Text fontWeight="bold" as="label" htmlFor="twitter.url">
                  TWITTER
                </Text>
                <Switch
                  name="connection.twitter.isActive"
                  id="twitter.isActive"
                />
              </HStack>
              <TextInput
                name="connection.twitter.url"
                id="twitter.url"
                placeholder="URL"
                LeftElement={<TwitterIcon fill="url(#gradient)" boxSize={6} />}
              />
            </VStack>
            <VStack w="full">
              <HStack justifyContent="space-between" w="full">
                <Text fontWeight="bold" as="label" htmlFor="link.url">
                  LINK
                </Text>
                <Switch name="connection.link.isActive" id="link.isActive" />
              </HStack>
              <TextInput
                name="connection.link.url"
                id="link.url"
                placeholder="URL"
                LeftElement={<LinkIcon fill="url(#gradient)" boxSize={6} />}
                w="full"
              />
            </VStack>
          </Panel>
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
        <NextLink passHref href="/users">
          <Button variant="outline" color="gray.500" bg="white" type="submit">
            Cancel
          </Button>
        </NextLink>
      </ButtonGroup>
    </Form>
  );
};

export default UserPersonalForm;
