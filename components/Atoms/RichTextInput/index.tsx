import { FC, CSSProperties, useRef } from "react";
import { useField } from "formik";
import dynamic from "next/dynamic";
import {
  chakra,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from "@chakra-ui/react";
import { useErrorFocus } from "@/hooks";

import "react-quill/dist/quill.snow.css";
import { sanitizeRichTextInput } from "@/utils";

interface RichTextInputProps {
  name: string;
  id: string;
  label?: string;
  placeholder?: string;
  description?: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isRequired?: boolean;
  style?: CSSProperties;
}

const ReactQuill = chakra(
  dynamic(() => import("react-quill"), { ssr: false }),
  {
    baseStyle: {
      bg: "white",
    },
  }
);
const modules = {
  toolbar: [
    ["bold", "italic", "underline"],
    ["link"],
    [{ script: "sub" }, { script: "super" }],
    [{ list: "bullet" }],
    [{ align: [] }],
  ],
};

const RichTextInput: FC<RichTextInputProps> = ({
  name,
  id,
  label = "",
  placeholder = "",
  description = "",
  isDisabled = false,
  isReadOnly = false,
  isRequired = false,
  style = {},
}) => {
  const [{ value }, meta, { setValue, setTouched }] = useField(name);
  const errorStyle =
    meta.error && meta.touched
      ? {
          borderColor: "#E53E3E",
          boxShadow: "0 0 0 1px #E53E3E",
        }
      : undefined;
  const RichTextRef = useRef(null);
  useErrorFocus(RichTextRef, name);

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
      <ReactQuill
        readOnly={isReadOnly}
        theme="snow"
        value={value || ""}
        modules={modules}
        onBlur={() => setTouched(true)}
        onChange={(value) => setValue(sanitizeRichTextInput(value))}
        placeholder={placeholder}
        style={{ ...style, ...errorStyle }}
        ref={RichTextRef}
        sx={{
          "& .ql-container": {
            minHeight: "10rem",
          },
        }}
      />
      {description && <FormHelperText>{description}</FormHelperText>}
      <FormErrorMessage>{meta.error}</FormErrorMessage>
    </FormControl>
  );
};

export default RichTextInput;
