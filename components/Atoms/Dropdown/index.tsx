import { FC, ReactNode } from "react";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Select,
  FormHelperText,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  FormControlProps,
  VStack,
} from "@chakra-ui/react";
import { useField } from "formik";

interface TextInputProps extends FormControlProps {
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

const DropDown: FC<TextInputProps> = ({
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

  return (
    <VStack mt="3">
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
          <Select placeholder="Select option">
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
          </Select>
          {RightElement && (
            <InputRightElement
              pointerEvents="none"
              color="gray.300"
              fontSize="1.2em"
            >
              {RightElement}
            </InputRightElement>
          )}
        </InputGroup>
        {description && <FormHelperText>{description}</FormHelperText>}
        <FormErrorMessage>{meta.error}</FormErrorMessage>
      </FormControl>
    </VStack>
  );
};

export default DropDown;
