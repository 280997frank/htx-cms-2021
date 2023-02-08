import React, { FC, ReactNode, useState } from "react";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  FormHelperText,
  InputGroup,
  InputRightElement,
  FormControlProps,
  Button,
  Icon,
} from "@chakra-ui/react";
import { useField } from "formik";
import { FaEyeSlash, FaEye } from "react-icons/fa";

interface PasswordInputProps extends FormControlProps {
  name: string;
  id: string;
  label?: string;
  placeholder?: string;
  description?: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isRequired?: boolean;
  LeftElement?: ReactNode;
  RightElement?: ReactNode;
}

const PasswordInput: FC<PasswordInputProps> = ({
  name,
  id,
  label = "",
  placeholder = "",
  description = "",
  isDisabled = false,
  isReadOnly = false,
  isRequired = false,
  LeftElement = null,
  RightElement = null,
  ...props
}) => {
  const [{ value }, meta, { setValue }] = useField(name);
  const [show, setShow] = useState(false);
  const clickShowPassword = () => setShow(!show);

  return (
    <FormControl
      {...props}
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
      <InputGroup size="md">
        <Input
          name="password"
          type={show ? "text" : "password"}
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
        <InputRightElement width="4.5rem">
          <Button h="1.75rem" size="sm" bg="white" onClick={clickShowPassword}>
            {show ? <Icon as={FaEye} /> : <Icon as={FaEyeSlash} />}
          </Button>
        </InputRightElement>
      </InputGroup>
      {description && <FormHelperText>{description}</FormHelperText>}
      <FormErrorMessage>{meta.error}</FormErrorMessage>
    </FormControl>
  );
};

export default PasswordInput;
