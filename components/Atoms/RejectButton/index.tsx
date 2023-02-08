import { FC, MouseEventHandler } from "react";
import { IconButton } from "@chakra-ui/react";
import { FaTimes } from "react-icons/fa";

interface RejectButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  isLoading?: boolean;
  isDisabled?: boolean;
}

const RejectButton: FC<RejectButtonProps> = ({
  onClick = () => {},
  isLoading = false,
  isDisabled = false,
}) => {
  return (
    <IconButton
      size="sm"
      fontSize="1.4rem"
      bg="rgb(54, 54, 54)"
      color="white"
      isLoading={isLoading}
      isDisabled={isDisabled}
      isRound
      aria-label="Reject"
      icon={<FaTimes />}
      type="button"
      onClick={onClick}
      _hover={{
        background: "grey",
      }}
    />
  );
};

export default RejectButton;
