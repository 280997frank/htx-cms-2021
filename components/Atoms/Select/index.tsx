import React, { ChangeEvent, useRef } from "react";
import {
  FormControl,
  FormLabel,
  Select as ChakraSelect,
  SelectProps as ChakraSelectProps,
  FormErrorMessage,
  FormHelperText,
} from "@chakra-ui/react";
import { useField } from "formik";
import s from "shortid";
import { useErrorFocus } from "@/hooks";

interface SelectProps extends ChakraSelectProps {
  name: string;
  id: string;
  label?: string;
  description?: string;
  placeholder?: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isRequired?: boolean;
  isMultiple?: boolean;
  isCustomField?: boolean;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  data: {
    label: string;
    value: string | number;
  }[];
}

const Select = ({
  name,
  id,
  data,
  label,
  placeholder,
  description,
  isDisabled = false,
  isReadOnly = false,
  isRequired = false,
  isMultiple = false,
  isCustomField = false,
  onChange = () => {},
  ...props
}: SelectProps) => {
  const [{ value }, meta, { setValue }] = useField(name);
  const selectRef = useRef(null);
  useErrorFocus(selectRef, name);

  return (
    <FormControl
      id={id}
      isInvalid={Boolean(meta.error && meta.touched)}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
    >
      {label && (
        <FormLabel fontWeight="bold" textTransform="uppercase">
          {label}
        </FormLabel>
      )}
      <ChakraSelect
        name={name}
        multiple={isMultiple}
        value={value ? value : ""}
        placeholder={placeholder}
        ref={selectRef}
        onClick={(e) => {
          const selected = e.currentTarget.value;
          if (isMultiple) {
            if (value.includes(selected)) {
              setValue(value.filter((val: string) => val !== selected));
            }
          }
        }}
        onChange={(e) => {
          const selected = e.currentTarget.value;
          if (isMultiple) {
            if (value.includes(selected)) {
              setValue(value.filter((val: string) => val !== value));
            } else {
              setValue([...value, selected]);
            }
          } else {
            setValue(selected);
            if (onChange) {
              onChange(e);
            }
          }
        }}
        {...props}
      >
        {data.map(({ label, value }) => (
          <option key={s.generate()} value={value}>
            {label}
          </option>
        ))}
      </ChakraSelect>
      {description && <FormHelperText>{description}</FormHelperText>}
      <FormErrorMessage>{meta.error}</FormErrorMessage>
    </FormControl>
  );
};

export default Select;
