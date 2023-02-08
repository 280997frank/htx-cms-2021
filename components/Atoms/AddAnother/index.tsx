import { FC, MouseEventHandler } from "react";
import {
  FormControl,
  FormLabel,
  Icon,
  Text,
  Center,
  Button,
} from "@chakra-ui/react";
import { CgMathPlus } from "react-icons/cg";

import { BG_GRADIENT } from "../../../constants/ui";

interface AddAnotherProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
  ratio?: number;
  isVisible?: boolean;
}

const AddAnother: FC<AddAnotherProps> = ({
  onClick = () => {},
  ratio = 56.25,
  isVisible,
}) => {
  return (
    <FormControl>
      <FormLabel
        css={{ visibility: "hidden" }}
        display={isVisible ? "block" : "none"}
      >
        Add Another
      </FormLabel>
      <Button
        borderWidth="0.1rem"
        borderStyle="solid"
        paddingTop={`${ratio}%`}
        borderRadius="1rem"
        onClick={onClick}
        type="button"
        width="100%"
        bg={`linear-gradient(white, white), ${BG_GRADIENT}`}
        bgClip="padding-box, border-box"
        border="solid 4px transparent"
        css={{
          backgroundOrigin: "border-box",
        }}
        _hover={{
          background: `linear-gradient(white, white), ${BG_GRADIENT}`,
          backgroundClip: "padding-box, border-box",
        }}
      >
        <Center
          h="100%"
          flexDir="column"
          position="absolute"
          top="50%"
          transform="translateY(-50%)"
        >
          <Icon
            as={CgMathPlus}
            color="black"
            fontSize="2.5rem"
            marginBottom="0.5rem"
          />
          <Text color="black" fontWeight="bold">
            Add another
          </Text>
        </Center>
      </Button>
    </FormControl>
  );
};

AddAnother.defaultProps = {
  isVisible: true,
};
export default AddAnother;
