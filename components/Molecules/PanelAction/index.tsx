import { FC, ReactNode } from "react";
import { Flex, FormControl, FormLabel, VStack } from "@chakra-ui/react";

interface PanelProps {
  label: string;
  children: ReactNode;
  action: ReactNode;
}

const PanelSwitch: FC<PanelProps> = ({ label, children, action }) => {
  return (
    <FormControl>
      <Flex flexDirection="row" justifyContent="space-between">
        <FormLabel fontWeight="bold" textTransform="uppercase">
          {label}
        </FormLabel>
        <FormLabel>{action}</FormLabel>
      </Flex>
      <VStack
        borderRadius="0.5rem"
        bgColor="white"
        border="1px solid #D7D7D7"
        padding="4"
        spacing="4"
        align="flex-start"
      >
        {children}
      </VStack>
    </FormControl>
  );
};

export default PanelSwitch;
