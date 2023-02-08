import React, { useEffect, useMemo } from "react";
import { Form } from "formik";
import Link from "next/link";
import { Stack, VStack, ButtonGroup, Button } from "@chakra-ui/react";
import TextInput from "@/components/Atoms/TextInput";
import MediaUpload from "@/components/Atoms/MediaUpload";
import RichTextInput from "@/components/Atoms/RichTextInput";
import { BG_GRADIENT } from "@/constants/ui";
import { LinkIcon } from "@/components/Atoms/Icons";
import Select from "@/components/Atoms/Select";
import { useListExhibitor } from "@/hooks/notification";

interface NotificationFormProps {
  loading: boolean;
}

const NotificationForm = ({ loading }: NotificationFormProps) => {
  const { fetchExhibitor, data } = useListExhibitor();

  useEffect(() => {
    fetchExhibitor();
  }, [fetchExhibitor]);

  const exhibitorList = useMemo(() => {
    if (!data) return [];
    return data.listExhibitors.exhibitors.map((item) => {
      return {
        label: item.name,
        value: item.id,
      };
    });
  }, [data]);

  return (
    <Form>
      <Stack direction={["column", "row"]} align="flex-start" spacing="10">
        <VStack spacing="6" w={["100%", "70%"]}>
          <TextInput
            name="title"
            label="Title"
            id="title"
            placeholder="Notification title"
            bgColor="white"
            isRequired
          />
          <RichTextInput
            name="description"
            label="Notification description"
            id="description"
            style={{ backgroundColor: "white" }}
          />
          <Select
            name="exhibitorId"
            label="LINK TO"
            id="exhibitorId"
            placeholder="Exhibitor"
            bgColor="white"
            data={exhibitorList}
          />
          <TextInput
            name="url"
            id="url"
            placeholder="URL"
            bgColor="white"
            LeftElement={<LinkIcon fill="url(#gradient)" boxSize={6} />}
          />
        </VStack>
        <VStack spacing="6" w={["100%", "30%"]}>
          <MediaUpload
            label="Sponsor Logo"
            name="sponsorLogoUrl"
            type="image"
            accept="image"
            ratio={100}
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
        <Link href="/notification" passHref>
          <Button variant="outline" color="gray.500" bg="white">
            Cancel
          </Button>
        </Link>
      </ButtonGroup>
    </Form>
  );
};

export default NotificationForm;
