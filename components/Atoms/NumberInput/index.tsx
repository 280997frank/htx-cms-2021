import { useErrorFocus } from "@/hooks";
import {
  FormControl,
  FormLabel,
  // FormControlProps,
  InputProps,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import { useField } from "formik";
import { FC, LegacyRef, ReactNode, useRef } from "react";

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

const InputNumber: FC<TextInputProps> = ({
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
      <NumberInput
        precision={2}
        step={0.2}
        onChange={(valueString) => setValue(valueString)}
        bgColor="white"
        value={value ?? ""}
      >
        <NumberInputField placeholder={placeholder} />
      </NumberInput>
    </FormControl>
  );
};

export default InputNumber;
