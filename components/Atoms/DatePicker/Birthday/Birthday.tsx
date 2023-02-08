import React, { useEffect, useState } from "react";
import { FC } from "react";
import { RiCalendarEventFill } from "react-icons/ri";
import YearMonthForm from "./YearMonthForm";
import dayjs from "dayjs";
import {
  Box,
  FormControl,
  FormLabel,
  FormErrorMessage,
  InputGroup,
  InputLeftElement,
  Input,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverCloseButton,
  PopoverBody,
} from "@chakra-ui/react";
import { Field, FieldProps, Formik, useField } from "formik";
import DayPicker from "react-day-picker";
import "react-day-picker/lib/style.css";

interface DatePickerProps {
  name: string;
  label?: string;
}

const currentYear = new Date().getFullYear();
const fromMonth = new Date(currentYear - 70, 0);
const toMonth = new Date(currentYear, 0);

const BirthdayInput: FC<DatePickerProps> = ({ name, label = "" }) => {
  const [{ value }, meta, { setValue, setTouched }] = useField(name);
  const [month, setMonth] = useState(toMonth);
  const [isOpen, setIsOpen] = React.useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const handleYearMonthChange = (month: any) => {
    setMonth(month);
  };

  useEffect(() => {
    if (value) {
      close();
    }
  }, [value]);

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
        <Popover isOpen={isOpen} onOpen={open} onClose={close}>
          <PopoverTrigger>
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
              <Input defaultValue={value} bg="#fff" onChange={close} />
            </InputGroup>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverCloseButton />
            <PopoverBody>
              <DayPicker
                onMonthChange={handleYearMonthChange}
                month={month}
                fromMonth={fromMonth}
                toMonth={toMonth}
                onDayClick={async (date) => {
                  console.log(date, "date");
                  const day = dayjs(date);
                  setValue(day.format("DD/MM/YYYY"));
                  setTouched(true);
                }}
                captionElement={({ date, localeUtils }: any) => (
                  <YearMonthForm
                    date={date}
                    localeUtils={localeUtils}
                    onChange={handleYearMonthChange}
                  />
                )}
              />
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Box>
    </FormControl>
  );
};

export default BirthdayInput;
