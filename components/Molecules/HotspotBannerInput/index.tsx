import { FC, MouseEventHandler, useEffect } from "react";
import { FormLabel, FormControl } from "@chakra-ui/react";
import { useField } from "formik";

import MediaUpload from "@/components/Atoms/MediaUpload";
import TextInput from "@/components/Atoms/TextInput";

interface HotspotBannerInputProps {
  index: number;
  onRemove: MouseEventHandler<HTMLButtonElement>;
}

const HotspotBannerInput: FC<HotspotBannerInputProps> = ({
  index,
  onRemove,
}) => {
  const [{ value }] = useField<File | string>(`hotspots.${index}.file`);
  const [{ value: mimeType }, , { setValue: setMimeType }] = useField<string>(
    `hotspots.${index}.mimeType`
  );

  useEffect(() => {
    // console.log(123, index, mimeType);
    /* if (value instanceof File) {
      setMimeType(value.type);
    } */
    /*  else {
      setMimeType("");
    } */
  }, [setMimeType, value]);

  return (
    <FormControl>
      <FormLabel fontWeight="bold" textTransform="uppercase">
        Banner {String(index + 1).padStart(2, "0")}
      </FormLabel>
      <MediaUpload
        name={`hotspots.${index}.file`}
        type={(mimeType.split("/")[0] || "all") as "image" | "video" | "all"}
        mimeType={mimeType}
        onRemove={onRemove}
        onChange={(e) => {
          if (
            e.currentTarget.files instanceof window.FileList &&
            e.currentTarget.files.length > 0
          ) {
            setMimeType(e.currentTarget.files[0].type);
          }
        }}
        ratio={100}
      />
      <TextInput
        name={`hotspots.${index}.title`}
        id={`hotspots.${index}.title`}
        placeholder="Title"
        mt="4"
      />
      <TextInput
        name={`hotspots.${index}.url`}
        id={`hotspots.${index}.url`}
        placeholder="URL"
        mt="4"
      />
    </FormControl>
  );
};

export default HotspotBannerInput;
