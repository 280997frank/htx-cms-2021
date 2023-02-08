import { FC, useEffect } from "react";
import { Form, FormikProps } from "formik";
import {
  Stack,
  VStack,
  ButtonGroup,
  Button,
  Box,
  FormLabel,
  Heading,
  Flex,
  Spacer,
} from "@chakra-ui/react";

import {
  FacebookIcon,
  LinkedinIcon,
  TwitterIcon,
} from "components/Atoms/Icons";

import MediaUpload from "@/components/Atoms/MediaUpload";
import Select from "@/components/Atoms/Select";
import TextInput from "@/components/Atoms/TextInput";
import RichTextInput from "@/components/Atoms/RichTextInput";
import DatePicker from "@/components/Atoms/DatePicker";
import TimePicker from "@/components/Atoms/TimePicker";
import Switch from "@/components/Atoms/Switch/SwitchGradient";

import { AboutEventInitialValues } from "@/types/aboutEvent";

import { BG_GRADIENT } from "@/constants/ui";
import { timezone } from "@/constants/timezone";

const AboutEventForm: FC<FormikProps<AboutEventInitialValues>> = ({
  isSubmitting,
  resetForm,
  setFieldValue,
  values,
}) => {
  useEffect(() => {
    if (!values.socialFacebookActive) {
      setFieldValue("socialFacebook", "");
    }

    if (!values.socialLinkedinActive) {
      setFieldValue("socialLinkedin", "");
    }

    if (!values.socialTwitterActive) {
      setFieldValue("socialTwitter", "");
    }
  }, [
    setFieldValue,
    values.socialFacebookActive,
    values.socialLinkedinActive,
    values.socialTwitterActive,
  ]);

  return (
    <Form style={{ width: "100%" }}>
      <Stack direction={["column", "row"]} align="flex-start" spacing="10">
        <VStack spacing="6" w={["100%", "40%"]}>
          <Box w="100%">
            <Heading as="h5" size="sm" textTransform="uppercase">
              Event Description
            </Heading>
          </Box>
          <RichTextInput
            name="eventDescription"
            label=""
            id="eventDescription"
          />
          {/* </Box> */}
          <Box w="100%" mt="var(--chakra-space-8) !important">
            <Heading as="h5" size="sm" textTransform="uppercase">
              Social Media
            </Heading>
          </Box>
          <Box w="100%" borderWidth="1px" borderRadius="md" p="2" bg="white">
            <Box>
              <Flex>
                <Box p="2">
                  <Box w="100%">
                    <Heading as="h5" size="sm" textTransform="uppercase">
                      Facebook
                    </Heading>
                  </Box>
                </Box>
                <Spacer />
                <Box p="2">
                  <Switch
                    id="socialFacebookActive"
                    name="socialFacebookActive"
                  />
                </Box>
              </Flex>
              <Box p="2">
                <TextInput
                  id="socialFacebook"
                  name="socialFacebook"
                  LeftElement={<FacebookIcon withGradient color="red" />}
                />
              </Box>
            </Box>
            <Box>
              <Flex>
                <Box p="2">
                  <Box w="100%">
                    <Heading as="h5" size="sm" textTransform="uppercase">
                      Linkedin
                    </Heading>
                  </Box>
                </Box>
                <Spacer />
                <Box p="2">
                  <Switch
                    id="socialLinkedinActive"
                    name="socialLinkedinActive"
                  />
                </Box>
              </Flex>
              <Box p="2">
                <TextInput
                  id="socialLinkedin"
                  name="socialLinkedin"
                  LeftElement={<LinkedinIcon withGradient color="red" />}
                />
              </Box>
            </Box>
            <Box>
              <Flex>
                <Box p="2">
                  <Box w="100%">
                    <Heading as="h5" size="sm" textTransform="uppercase">
                      Twitter
                    </Heading>
                  </Box>
                </Box>
                <Spacer />
                <Box p="2">
                  <Switch id="socialTwitterActive" name="socialTwitterActive" />
                </Box>
              </Flex>
              <Box p="2">
                <TextInput
                  id="socialTwitter"
                  name="socialTwitter"
                  LeftElement={<TwitterIcon withGradient color="red" />}
                />
              </Box>
            </Box>
          </Box>
        </VStack>
        <Stack w={["100%", "30%"]}>
          <VStack spacing="3" w={["100%"]}>
            <Box w="100%">
              <Heading as="h5" size="sm" textTransform="uppercase">
                Event Start
              </Heading>
            </Box>
            <Box w="100%" borderWidth="1px" borderRadius="md" p="2" bg="white">
              <Box>
                <FormLabel fontWeight="bold" textTransform="uppercase">
                  Date
                </FormLabel>
                <DatePicker name="eventStart" />
              </Box>

              <Box mt="3">
                <FormLabel fontWeight="bold" textTransform="uppercase">
                  Time
                </FormLabel>
                <TimePicker name="eventStartTime" />
                <Box mt="1">
                  <Select
                    name="eventStartZoneName"
                    label=""
                    id="eventStartZoneName"
                    placeholder="Select Event Start Zone"
                    isCustomField
                    onChange={(value: any) => {
                      const selectedIndex: number =
                        value.currentTarget.selectedIndex;
                      timezone.map((itemIndex, index) => {
                        if (index === selectedIndex - 1) {
                          setFieldValue("eventStartZone", itemIndex.offset);
                        }
                      });
                    }}
                    data={timezone.map((item) => {
                      return {
                        label: item.text,
                        value: item.value,
                      };
                    })}
                  />
                </Box>
              </Box>
            </Box>

            <Box w="100%">
              <Heading as="h5" size="sm" textTransform="uppercase">
                Event End
              </Heading>
            </Box>
            <Box w="100%" borderWidth="1px" borderRadius="md" p="2" bg="white">
              <Box>
                <FormLabel fontWeight="bold" textTransform="uppercase">
                  Date
                </FormLabel>
                <DatePicker name="eventEnd" />
              </Box>

              <Box mt="3">
                <FormLabel fontWeight="bold" textTransform="uppercase">
                  Time
                </FormLabel>
                <TimePicker name="eventEndTime" />
                <Box mt="1">
                  <Select
                    name="eventEndZoneName"
                    label=""
                    id="eventEndZoneName"
                    placeholder="Select Event End Zone"
                    isCustomField
                    onChange={(value: any) => {
                      const selectedIndex: number =
                        value.currentTarget.selectedIndex;
                      timezone.map((itemIndex, index) => {
                        if (index === selectedIndex - 1) {
                          setFieldValue("eventEndZone", itemIndex.offset);
                        }
                      });
                    }}
                    data={timezone.map((item) => {
                      return {
                        label: item.text,
                        value: item.value,
                      };
                    })}
                  />
                </Box>
              </Box>
            </Box>
          </VStack>
        </Stack>
        {/* image upload start */}
        <Stack w={["100%", "30%"]} spacing="6">
          <VStack spacing="6" w={["100%"]}>
            <MediaUpload
              name="logo"
              type="image"
              accept="image"
              label="Event Logo"
            />
          </VStack>
        </Stack>
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

export default AboutEventForm;
