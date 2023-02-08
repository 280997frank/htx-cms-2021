import { FC } from "react";
import { AiOutlineClockCircle } from "react-icons/ai";
import { useField } from "formik";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  InputGroup,
  InputLeftElement,
  Input,
} from "@chakra-ui/react";
import InputMask from "react-input-mask";

interface TimePickerProps {
  name: string;
  label?: string;
  isRequired?: boolean;
}

const TimePicker: FC<TimePickerProps> = ({
  name,
  label = "",
  isRequired = false,
}) => {
  const [field, meta] = useField(name);

  return (
    <FormControl
      isInvalid={Boolean(meta.error && meta.touched)}
      isRequired={isRequired}
    >
      {label && (
        <FormLabel fontWeight="bold" textTransform="uppercase">
          {label}
        </FormLabel>
      )}
      <InputGroup>
        <InputLeftElement
          pointerEvents="none"
          color="gray.300"
          fontSize="1.2em"
        >
          <AiOutlineClockCircle style={{ fill: "url(#lgrad)" }} />
        </InputLeftElement>
        <Input
          as={InputMask}
          {...field}
          mask="24:59"
          // @ts-ignore
          formatChars={{
            2: "[0-2]",
            4: "[0-9]",
            5: "[0-5]",
            9: "[0-9]",
          }}
          placeholder="HH:MM"
        />
      </InputGroup>
      <FormErrorMessage>{meta.error}</FormErrorMessage>
    </FormControl>
  );
};

export default TimePicker;
