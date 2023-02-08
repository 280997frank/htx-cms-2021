import { FC } from "react";
import DayPickerInput from "react-day-picker/DayPickerInput";
import { RiCalendarEventFill } from "react-icons/ri";
import { useField } from "formik";
import dayjs from "dayjs";
import {
  Box,
  FormControl,
  FormLabel,
  FormErrorMessage,
  InputGroup,
  InputLeftElement,
  Input,
} from "@chakra-ui/react";

import "react-day-picker/lib/style.css";

interface DatePickerProps {
  name: string;
  label?: string;
}

const DatePicker: FC<DatePickerProps> = ({ name, label = "" }) => {
  const [{ value }, meta, { setValue, setTouched }] = useField(name);

  return (
    <FormControl isInvalid={Boolean(meta.error && meta.touched)}>
      {label && (
        <FormLabel fontWeight="bold" textTransform="uppercase">
          {label}
        </FormLabel>
      )}
      <Box
        sx={{
          ".DayPickerInput-Overlay": {
            zIndex: 999,
          },
        }}
      >
        <DayPickerInput
          format="DD/MM/YYYY"
          component={(props: Record<string, unknown>) => {
            return (
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  color="gray.300"
                  fontSize="1.2em"
                  width="100%"
                  justifyContent="flex-start"
                  left="10px"
                >
                  <RiCalendarEventFill style={{ fill: "url(#lgrad)" }} />
                </InputLeftElement>
                <Input {...props} />
              </InputGroup>
            );
          }}
          placeholder="DD-MM-YYYY"
          value={value}
          onDayChange={(date) => {
            const day = dayjs(date);
            setValue(day.format("DD/MM/YYYY"));
            setTouched(true);
          }}
          style={{ display: "block" }}
        />
      </Box>
      <FormErrorMessage>{meta.error}</FormErrorMessage>
    </FormControl>
  );
};

export default DatePicker;
