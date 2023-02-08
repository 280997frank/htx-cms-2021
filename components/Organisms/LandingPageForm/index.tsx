import { FC, useState } from "react";
import { Form, FormikProps } from "formik";
import {
  Stack,
  VStack,
  HStack,
  ButtonGroup,
  Button,
  Flex,
  Text,
  IconButton,
} from "@chakra-ui/react";
import { FiLink2 } from "react-icons/fi";
import { FaEnvelope } from "react-icons/fa";
import { IoIosLock } from "react-icons/io";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";

import MediaUpload from "@/components/Atoms/MediaUpload";
import TextInput from "@/components/Atoms/TextInput";
import RichTextInput from "@/components/Atoms/RichTextInput";
import Switch from "@/components/Atoms/Switch";
import Panel from "@/components/Molecules/Panel";

import { BG_GRADIENT } from "@/constants/ui";
import { LandingPageInput } from "@/types/landingPage";

const LandingPageForm: FC<FormikProps<LandingPageInput>> = ({
  isSubmitting,
  resetForm,
}) => {
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  return (
    <Form style={{ width: "100%" }}>
      <Stack direction={["column", "row"]} align="flex-start" spacing="10">
        <VStack spacing="6" w={["100%", "75%"]}>
          <TextInput
            name="eventTitle"
            label="Event Title"
            id="eventTitle"
            placeholder="Event Title"
          />
          <HStack spacing="6" w="100%" alignItems="flex-start">
            <VStack spacing="6" w="50%" alignItems="flex-start">
              <VStack spacing="2" w="100%">
                <TextInput
                  name="emailConfigHost"
                  id="emailConfigHost"
                  placeholder="SMTP Host"
                  label="SMTP Configuration"
                  LeftElement={<FiLink2 stroke="url(#gradient)" />}
                />
                <TextInput
                  name="emailConfigPort"
                  id="emailConfigPort"
                  placeholder="SMTP Port"
                  LeftElement={<FiLink2 stroke="url(#gradient)" />}
                />
                <TextInput
                  name="emailConfigUser"
                  id="emailConfigUser"
                  placeholder="Username/Email"
                  LeftElement={<FaEnvelope fill="url(#lgrad)" />}
                />
                <TextInput
                  name="emailConfigPassword"
                  id="emailConfigPassword"
                  placeholder="Password"
                  type={isPasswordVisible ? "text" : "password"}
                  isRightElementClickable
                  LeftElement={<IoIosLock fill="url(#lgrad)" />}
                  RightElement={
                    isPasswordVisible ? (
                      <IconButton
                        aria-label="Password is visible"
                        icon={<BsFillEyeFill color="black" />}
                        variant="ghost"
                        onClick={() =>
                          setPasswordVisible((prevState) => !prevState)
                        }
                      />
                    ) : (
                      <IconButton
                        aria-label="Password is not visible"
                        icon={<BsFillEyeSlashFill color="black" />}
                        variant="ghost"
                        onClick={() =>
                          setPasswordVisible((prevState) => !prevState)
                        }
                      />
                    )
                  }
                />
              </VStack>
              <Panel label="OTP Option">
                <Flex
                  w="100%"
                  padding="1"
                  borderRadius="lg"
                  alignItems="center"
                  _hover={{ bgColor: "gray.100" }}
                >
                  <Text
                    as="label"
                    htmlFor={`switch-email`}
                    flex="1"
                    cursor="pointer"
                    fontWeight="bold"
                  >
                    EMAIL
                  </Text>
                  <Switch name="otpEmailActive" id={`switch-email`} />
                </Flex>
                <Flex
                  w="100%"
                  padding="1"
                  borderRadius="lg"
                  alignItems="center"
                  _hover={{ bgColor: "gray.100" }}
                >
                  <Text
                    as="label"
                    htmlFor={`switch-sms`}
                    flex="1"
                    cursor="pointer"
                    fontWeight="bold"
                  >
                    SMS
                  </Text>
                  <Switch name="otpSMSActive" id={`switch-sms`} />
                </Flex>
              </Panel>
              <VStack spacing="2" w="100%">
                <TextInput
                  name="otpEmailHeader"
                  id="otpEmailHeader"
                  placeholder="Email Header"
                  label="OTP Email"
                />
                <RichTextInput name="otpEmailBody" id="otpEmailBody" />
              </VStack>
            </VStack>
            <VStack spacing="6" w="50%" alignItems="flex-start">
              <TextInput
                name="registrationUrl"
                id="registrationUrl"
                placeholder="User registration URL"
                label="Registration URL"
              />
              <VStack spacing="2" w="100%">
                <TextInput
                  name="forgotEmailHeader"
                  id="forgotEmailHeader"
                  placeholder="Email Header"
                  label='"Forget Password" Email'
                />
                <RichTextInput name="forgotEmailBody" id="forgotEmailBody" />
              </VStack>
            </VStack>
          </HStack>
        </VStack>
        <VStack spacing="6" w={["100%", "25%"]}>
          <MediaUpload
            name="heroImageUrl"
            type="image"
            accept="image"
            label="Landing Page Hero Image"
            ratio={100}
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
          onClick={() => resetForm()}
        >
          Cancel
        </Button>
      </ButtonGroup>
    </Form>
  );
};

export default LandingPageForm;
