import { FC, MouseEventHandler } from "react";
import { Tag as ChakraTag, TagLabel, TagCloseButton } from "@chakra-ui/react";

interface TagProps {
  label: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

const Tag: FC<TagProps> = ({ label, onClick = () => {} }) => {
  return (
    <ChakraTag
      size="lg"
      borderRadius="full"
      variant="solid"
      bg="rgb(125, 125, 125)"
      margin="5px"
    >
      <TagLabel>{label}</TagLabel>
      <TagCloseButton
        css={{ borderRadius: "50%", background: "rgb(54, 54, 54)" }}
        onClick={onClick}
      />
    </ChakraTag>
  );
};

export default Tag;
