import InputNumber from "@/components/Atoms/NumberInput";
import Select from "@/components/Atoms/Select";
import TextInput from "@/components/Atoms/TextInput";
import Panel from "@/components/Molecules/Panel";
import { BG_GRADIENT } from "@/constants/ui";
import {
  Button,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  Stack,
  VStack,
} from "@chakra-ui/react";
import { Form } from "formik";
import React from "react";

const EntryForm = () => {
  return (
    <Form style={{ width: "100%" }}>
      <Panel label="Add Entry">
        <FormControl>
          <Stack
            direction={["row"]}
            align="flex-start"
            spacing="10"
            width="100%"
          >
            <VStack spacing="6" w={["100%", "50%"]}>
              <TextInput
                name="name"
                label="Name"
                id="name"
                placeholder="Name"
                bgColor="white"
              />
            </VStack>
            <VStack spacing="6" w={["100%", "50%"]}>
              <TextInput
                name="timing"
                label="Timing"
                id="timing"
                placeholder="HH:MM"
                bgColor="white"
              />
            </VStack>
          </Stack>
          <Stack
            direction={["row"]}
            align="flex-start"
            spacing="10"
            width="100%"
            mt="4"
          >
            <VStack spacing="6" w={["100%", "50%"]}>
              <TextInput
                name="rank"
                label="Rank"
                id="rank"
                type="number"
                placeholder="Rank Number"
                bgColor="white"
              />
            </VStack>
            <VStack spacing="6" w={["100%", "50%"]}>
              <InputNumber
                name="distance"
                label="Distance"
                type="number"
                id="distance"
                placeholder="XX.XX km"
              />
            </VStack>
          </Stack>
          <Stack
            direction={["row"]}
            align="flex-start"
            spacing="10"
            width="100%"
            mt="4"
            alignItems="center"
          >
            <VStack spacing="6" w={["100%", "50%"]}>
              <Select
                id="category"
                placeholder="Category"
                name="category"
                label="Category"
                marginRight="1rem"
                isCustomField
                onChange={(e: any) => {}}
                data={[
                  { label: "Female", value: "FEMALE" },
                  { label: "Male", value: "MALE" },
                  { label: "Group", value: "GROUP" },
                ]}
              />
            </VStack>
            <VStack spacing="6" w={["100%", "50%"]}>
              <Button
                bgImage={BG_GRADIENT}
                color="white"
                isLoading={false}
                type="submit"
                mt="8"
                w="100%"
              >
                Submit
              </Button>
            </VStack>
          </Stack>
        </FormControl>
      </Panel>
    </Form>
  );
};

export default EntryForm;
