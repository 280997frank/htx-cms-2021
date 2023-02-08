import { FC, ReactNode, LegacyRef, useRef } from "react";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  FormHelperText,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  // FormControlProps,
  InputProps,
} from "@chakra-ui/react";
import { useField } from "formik";
import { useErrorFocus } from "@/hooks";

interface TextInputProps extends InputProps {
  name: string;
  id: string;
  label?: string;
  placeholder?: string;
  description?: string;
  type?: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isRequired?: boolean;
  isLeftElementClickable?: boolean;
  isRightElementClickable?: boolean;
  LeftElement?: ReactNode;
  RightElement?: ReactNode;
  ref?: LegacyRef<HTMLInputElement>;
}

const TextInput: FC<TextInputProps> = ({
  name,
  id,
  label = "",
  placeholder = "",
  description = "",
  type = "text",
  isDisabled = false,
  isReadOnly = false,
  isRequired = false,
  isLeftElementClickable = false,
  isRightElementClickable = false,
  LeftElement = null,
  RightElement = null,
  ref = null,
  ...props
}) => {
  const [{ value }, meta, { setValue }] = useField(name);
  const inputRef = useRef(null);
  useErrorFocus(inputRef, name);

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
      <InputGroup>
        {LeftElement && (
          <InputLeftElement
            pointerEvents={isLeftElementClickable ? undefined : "none"}
            color="gray.300"
            fontSize="1.2em"
          >
            {LeftElement}
          </InputLeftElement>
        )}
        <Input
          type={type}
          onChange={(e) => setValue(e.target.value)}
          value={value ?? ""}
          placeholder={placeholder}
          bgColor="white"
          ref={inputRef}
          {...props}
        />
        {RightElement && (
          <InputRightElement
            pointerEvents={isRightElementClickable ? undefined : "none"}
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
  );
};

export default TextInput;
