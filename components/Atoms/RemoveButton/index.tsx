import { FC, MouseEventHandler } from "react";
import { IconButton } from "@chakra-ui/react";
import { IoMdTrash } from "react-icons/io";

interface RemoveButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  isLoading?: boolean;
  isDisabled?: boolean;
}

const RemoveButton: FC<RemoveButtonProps> = ({
  onClick = () => {},
  isLoading = false,
  isDisabled = false,
}) => {
  return (
    <IconButton
      size="sm"
      fontSize="2rem"
      bg="transparent"
      color="rgb(54,54,54)"
      isLoading={isLoading}
      isDisabled={isDisabled}
      isRounded
      aria-label="Delete"
      icon={<IoMdTrash />}
      type="button"
      onClick={onClick}
      _hover={{
        background: "white",
      }}
    />
  );
};

export default RemoveButton;
