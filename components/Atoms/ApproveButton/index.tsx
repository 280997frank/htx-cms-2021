import { FC, MouseEventHandler } from "react";
import { IconButton } from "@chakra-ui/react";
import { GoCheck } from "react-icons/go";

import { BG_GRADIENT } from "../../../constants/ui";

interface ApproveButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  isLoading?: boolean;
  isDisabled?: boolean;
}

const ApproveButton: FC<ApproveButtonProps> = ({
  onClick = () => {},
  isLoading = false,
  isDisabled = false,
}) => {
  return (
    <IconButton
      size="sm"
      fontSize="1.4rem"
      bg={BG_GRADIENT}
      color="white"
      isLoading={isLoading}
      isDisabled={isDisabled}
      isRound
      aria-label="Approve"
      icon={<GoCheck />}
      type="button"
      onClick={onClick}
      _hover={{
        background: "orange",
      }}
    />
  );
};

export default ApproveButton;
