import {
  FC,
  MouseEventHandler,
  ChangeEventHandler,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  VisuallyHidden,
  IconButton,
  Image,
  Box,
  Icon,
  Text,
  Center,
} from "@chakra-ui/react";
import { MdFileUpload } from "react-icons/md";
import { IoMdTrash } from "react-icons/io";
import { useField } from "formik";

import { capitalizeFirstLetter } from "@/utils";
import { BG_GRADIENT } from "@/constants/ui";

interface MediaUploadProps {
  name: string;
  type: "application/pdf";
  accept?: "application/pdf";
  mimeType?: string;
  label?: string;
  ratio?: number;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onRemove?: MouseEventHandler<HTMLButtonElement>;
}

const MediaUpload: FC<MediaUploadProps> = ({
  name,
  type,
  label = "",
  ratio = 56.25,
  mimeType = "",
  accept = "all",
  onChange = () => {},
  onRemove,
}) => {
  const [{ value }, meta, { setValue, setTouched }] = useField<string | File>(
    name
  );
  const [fileUrl, setFileUrl] = useState("");

  const removeItem = useCallback(() => {
    URL.revokeObjectURL(fileUrl);
    setFileUrl("");
    setValue("");
  }, [fileUrl, setValue]);

  useEffect(() => {
    if (fileUrl) {
      return () => {
        URL.revokeObjectURL(fileUrl);
      };
    }
  }, [fileUrl]);

  useEffect(() => {
    if (value instanceof File) {
      setFileUrl(URL.createObjectURL(value));
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
        bgGradient={BG_GRADIENT}
        paddingTop={`${ratio}%`}
        borderRadius="1rem"
        position="relative"
        w="75%"
        h="40rem"
      >
        <Box
          as="label"
          height="100%"
          w="100%"
          position="absolute"
          display="block"
          cursor="pointer"
          top="0"
        >
          <Center h="100%" flexDir="column">
            <Icon as={MdFileUpload} color="white" fontSize="2.5rem" />
            <Text color="white" fontWeight="bold">
              Upload File
            </Text>
            <Text color="white" fontWeight="bold">
              (.pdf)
            </Text>
            <Text color="white" fontWeight="bold">
              (10MB max)
            </Text>
          </Center>
          <VisuallyHidden>
            <input
              type="file"
              value=""
              accept={accept}
              onChange={(e) => {
                if (
                  e.currentTarget.files instanceof window.FileList &&
                  e.currentTarget.files.length > 0
                ) {
                  URL.revokeObjectURL(fileUrl);
                  setValue(e.currentTarget.files[0]);
                  const objectUrl = URL.createObjectURL(
                    e.currentTarget.files[0]
                  );
                  setFileUrl(objectUrl);
                }

                onChange(e);
              }}
            />
          </VisuallyHidden>
        </Box>
        <IconButton
          aria-label="Remove image"
          icon={<IoMdTrash />}
          variant="ghost"
          bgColor="white"
          borderRadius="50%"
          position="absolute"
          top="4%"
          right="2.5%"
          size="sm"
          type="button"
          fontSize="1.4rem"
          onClick={onRemove || removeItem}
        />
      </Box>
      <FormErrorMessage>{meta.error}</FormErrorMessage>
    </FormControl>
  );
};

export default MediaUpload;
