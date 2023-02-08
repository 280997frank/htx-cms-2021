import DatePicker from "@/components/Atoms/DatePicker/Birthday/Birthday";
import TextInput from "@/components/Atoms/TextInput";
import { BG_GRADIENT } from "@/constants/ui";
import { BirthdayFormProps } from "@/types/happy-birthday";
import { Button, ButtonGroup } from "@chakra-ui/button";
import { Stack, VStack } from "@chakra-ui/layout";
import { Form } from "formik";
import Link from "next/link";
import React from "react";

const EventBirthdayForm = ({ loading }: BirthdayFormProps) => {
  return (
    <Form style={{ width: "100%" }}>
      <Stack
        direction={["column", "column"]}
        align="flex-start"
        spacing="10"
        width="100%"
      >
        <Stack
          direction={["column", "row"]}
          align="flex-start"
          spacing="10"
          width="50%"
        >
          <VStack spacing="6" w={["100%", "70%"]}>
            <TextInput
              name="firstName"
              label="First Name"
              id="firstName"
              placeholder="First Name"
              bgColor="white"
              isRequired
            />
          </VStack>
          <VStack spacing="6" w={["100%", "70%"]}>
            <TextInput
              name="lastName"
              label="Last Name"
              id="lastName"
              placeholder="Last Name"
              bgColor="white"
              isRequired
            />
          </VStack>
        </Stack>
        <Stack
          direction={["column", "row"]}
          align="flex-start"
          spacing="10"
          width="50%"
        >
          <TextInput
            name="designation"
            label="Department"
            id="designation"
            placeholder="The person’s position on the company"
            bgColor="white"
            isRequired
          />
        </Stack>
        <Stack
          direction={["column", "row"]}
          align="flex-start"
          spacing="10"
          width="50%"
        >
          <DatePicker name="birthday" label="Birthday Date" />
        </Stack>
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
        <Link href="/happy-birthday" passHref>
          <Button variant="outline" color="gray.500" bg="white">
            Cancel
          </Button>
        </Link>
      </ButtonGroup>
    </Form>
  );
};

export default EventBirthdayForm;
