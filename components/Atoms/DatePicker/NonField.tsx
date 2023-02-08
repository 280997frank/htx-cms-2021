import { FC, forwardRef, useMemo } from "react";
import DayPickerInput from "react-day-picker/DayPickerInput";
import { RiCalendarEventFill as CalendarIcon } from "react-icons/ri";
import dayjs from "dayjs";
import {
  Box,
  BoxProps,
  InputGroup,
  InputLeftElement,
  Input,
  InputProps,
  Icon,
} from "@chakra-ui/react";

import "react-day-picker/lib/style.css";

type DatePickerProps = Omit<BoxProps, "onChange"> & {
  value: Date;
  onChange: (date: Date) => void;
  inputProps?: InputProps;
  format?: string;
};

const DatePickerInput = forwardRef((props, ref) => {
  return (
    <InputGroup>
      <InputLeftElement pointerEvents="none" color="gray.300" fontSize="1.2em">
        <Icon as={CalendarIcon} fill="url(#lgrad)" />
      </InputLeftElement>
      <Input {...props} />
    </InputGroup>
  );
});

DatePickerInput.displayName = "date-picker-input";

const DatePicker: FC<DatePickerProps> = ({
  value = new Date(),
  onChange = () => {},
  inputProps = {},
  format = "DD/MM/YYYY",
  ...props
}) => {
  const inputValue = useMemo(
    () => dayjs(value).format(format),
    [format, value]
  );
  return (
    <Box display="inline-flex" zIndex="999" {...props}>
      <Box
        position="relative"
        sx={{
          ".DayPickerInput-Overlay": {
            left: "auto",
            right: 0,
          },
        }}
      >
        <DayPickerInput
          format={format}
          value={inputValue}
          onDayChange={onChange}
          component={DatePickerInput}
        />
      </Box>
    </Box>
  );
};

export default DatePicker;
