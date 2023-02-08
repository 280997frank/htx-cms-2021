import { FC } from "react";
import { Form, FormikProps } from "formik";
import {
  Stack,
  VStack,
  ButtonGroup,
  Button,
  Flex,
  Text,
} from "@chakra-ui/react";

import MediaUpload from "@/components/Atoms/MediaUpload";
import TextInput from "@/components/Atoms/TextInput";
import Switch from "@/components/Atoms/Switch";
import Panel from "@/components/Molecules/Panel";
import {
  AuditoriumIcon,
  AttendeesIcon,
  AboutIcon,
  FeedIcon,
  RoundtableIcon,
  VODIcon,
  SponsorIcon,
  SpeakersIcon,
  SocialWallIcon,
  LobbyIcon,
  ExhibitionIcon,
  BreakoutRoomsIcon,
  CalendarIcon,
  ResourceCenterIcon,
  FeedbackIcon,
} from "components/Atoms/Icons";

import { BG_GRADIENT, switchList } from "@/constants/ui";
import { ILobbyInitialValues } from "@/types/lobby";

import { actions as lobbyActions } from "@/states/lobby/slice";

import { useAppDispatch } from "@/hooks";

const getIcon = (iconName: string) => {
  switch (iconName) {
    case "showLobby":
      return <LobbyIcon boxSize={6} />;
      break;
    case "showAboutEvent":
      return <AboutIcon boxSize={6} />;
    case "showFeed":
      return <FeedIcon boxSize={6} />;
    case "showAuditorium":
      return <AuditoriumIcon boxSize={6} />;
    case "showExhibitionHall":
      return <ExhibitionIcon boxSize={6} />;
    case "showBreakoutRoom":
      return <BreakoutRoomsIcon boxSize={6} />;
    case "showRoundtable":
      return <RoundtableIcon boxSize={6} />;
    case "showEventAgenda":
      return <CalendarIcon boxSize={6} />;
    case "showSpeakers":
      return <SpeakersIcon boxSize={6} />;
    case "showAttendees":
      return <AttendeesIcon boxSize={6} />;
    case "showResourceCenter":
      return <ResourceCenterIcon boxSize={6} />;
    case "showVOD":
      return <VODIcon boxSize={6} />;
    case "showSponsors":
      return <SponsorIcon boxSize={6} />;
    case "showFeedback":
      return <FeedbackIcon boxSize={6} />;
    case "showSocialWall":
      return <SocialWallIcon boxSize={6} />;
  }

  return null;
};

const LobbyForm: FC<FormikProps<ILobbyInitialValues>> = ({
  values,
  setFieldValue,
  isSubmitting,
  resetForm,
}) => {
  const dispatch = useAppDispatch();

  return (
    <Form style={{ width: "100%" }}>
      <Stack direction={["column", "row"]} align="flex-start" spacing="10">
        <VStack spacing="6" w={["100%", "50%"]}>
          <MediaUpload
            name="lobbyBackground"
            type={
              (values.mimeType.split("/")[0] || "all") as
                | "image"
                | "video"
                | "all"
            }
            mimeType={values.mimeType}
            label="Lobby Image/Video"
            onChange={(e) => {
              if (
                e.currentTarget.files instanceof window.FileList &&
                e.currentTarget.files.length > 0
              ) {
                setFieldValue("mimeType", e.currentTarget.files[0].type);
              }
            }}
            onRemove={() => {
              setFieldValue("lobbyBackground", "");
              setFieldValue("mimeType", "");
            }}
          />
          <Button
            bgImage={BG_GRADIENT}
            color="white"
            w="100%"
            my="4"
            onClick={() => dispatch(lobbyActions.toggleActivePage())}
          >
            Configure Hotspots
          </Button>
          <Panel label="Intercom Configurator">
            <TextInput
              name="appId"
              label="APP ID"
              id="appId"
              placeholder="Intercom App ID"
            />
            <TextInput
              name="verificationId"
              label="SECRET VERIFICATION ID"
              id="verificationId"
              placeholder="Intercom Secret Verification ID"
            />
          </Panel>
        </VStack>
        <VStack spacing="6" w={["100%", "50%"]}>
          <Panel label="Sidebar Menu Display">
            {switchList.map(({ label, name }) => (
              <Flex
                key={name}
                w="100%"
                padding="1"
                borderRadius="lg"
                alignItems="center"
                _hover={{ bgColor: "gray.100" }}
              >
                {getIcon(name)}
                <Text
                  as="label"
                  htmlFor={`switch-${name}`}
                  flex="1"
                  ml="4"
                  cursor="pointer"
                  fontWeight="500"
                >
                  {label}
                </Text>
                <Switch name={`${name}.isActive`} id={`switch-${name}`} />
              </Flex>
            ))}
          </Panel>
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
          onClick={() => resetForm()}
        >
          Cancel
        </Button>
      </ButtonGroup>
    </Form>
  );
};

export default LobbyForm;
