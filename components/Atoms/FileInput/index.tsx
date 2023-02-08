import { FC, useRef } from "react";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { MdFileUpload } from "react-icons/md";
import { useField } from "formik";

import RemoveButton from "../RemoveButton";

interface FileInputProps {
  name: string;
  label?: string;
  showRemoveButton?: boolean;
}

const FileInput: FC<FileInputProps> = ({
  name,
  label = "",
  showRemoveButton,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [{ value }, meta, { setValue, setTouched }] = useField<File | "">(name);

  return (
    <FormControl isInvalid={Boolean(meta.error && meta.touched)}>
      {label && (
        <FormLabel fontWeight="bold" textTransform="uppercase">
          {label}
        </FormLabel>
      )}
      <InputGroup alignItems="center">
        <InputLeftElement
          pointerEvents="none"
          color="gray.300"
          fontSize="1.25em"
        >
          <MdFileUpload style={{ fill: "url(#lgrad)" }} />
        </InputLeftElement>
        <Input
          onClick={() => {
            fileInputRef.current?.click();
          }}
          onKeyDown={() => {
            fileInputRef.current?.click();
          }}
          isReadOnly
          value={
            value instanceof File
              ? value.name
              : value !== undefined
              ? value
                  .toString()
                  .substring(value.toString().lastIndexOf("/") + 1)
              : ""
          }
          placeholder="Upload PDF, image, or video resource"
          marginRight="0.5rem"
        />
        <Input
          type="file"
          display="none"
          accept="application/pdf,image/*,video/mp4"
          ref={fileInputRef}
          onChange={(e) => {
            if (
              e.currentTarget.files instanceof window.FileList &&
              e.currentTarget.files.length > 0
            ) {
              setValue(e.currentTarget.files[0]);
              setTouched(true);
            }
          }}
        />
        {showRemoveButton && <RemoveButton onClick={() => setValue("")} />}
      </InputGroup>
      <FormErrorMessage>{meta.error}</FormErrorMessage>
    </FormControl>
  );
};

FileInput.defaultProps = {
  showRemoveButton: true,
};

export default FileInput;
