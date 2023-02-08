import React, { FC, ReactNode } from "react";
import {
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  FormHelperText,
  InputGroup,
  InputLeftElement,
  FormControlProps,
} from "@chakra-ui/react";
import { useField } from "formik";

interface TextInputSwitchProps extends FormControlProps {
  name: string;
  id: string;
  label?: string;
  placeholder?: string;
  description?: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isRequired?: boolean;
  LeftElement?: ReactNode;
  action: ReactNode;
}

const TextInputSwitch: FC<TextInputSwitchProps> = ({
  name,
  id,
  label = "",
  placeholder = "",
  description = "",
  isDisabled = false,
  isReadOnly = false,
  isRequired = false,
  LeftElement = null,
  action = null,
  ...props
}) => {
  const [{ value }, meta, { setValue }] = useField(name);

  return (
    <FormControl
      {...props}
      id={id}
      isInvalid={Boolean(meta.error && meta.touched)}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
    >
      <Flex flexDirection="row" justifyContent="space-between">
        <FormLabel fontWeight="bold" textTransform="uppercase">
          {label}
        </FormLabel>
        <FormLabel>{action}</FormLabel>
      </Flex>
      <InputGroup>
        {LeftElement && (
          <InputLeftElement
            pointerEvents="none"
            color="gray.300"
            fontSize="1.2em"
          >
            {LeftElement}
          </InputLeftElement>
        )}
        <Input
          type="text"
          onChange={(e) => setValue(e.target.value)}
          value={value}
          placeholder={placeholder}
        />
      </InputGroup>
      {description && <FormHelperText>{description}</FormHelperText>}
      <FormErrorMessage>{meta.error}</FormErrorMessage>
    </FormControl>
  );
};

export default TextInputSwitch;
