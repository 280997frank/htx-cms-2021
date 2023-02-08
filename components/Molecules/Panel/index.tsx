import { FC, ReactNode } from "react";
import { FormControl, FormLabel, VStack, StackProps } from "@chakra-ui/react";

interface PanelProps {
  label: string;
  children: ReactNode;
  stackProps?: StackProps;
}

const Panel: FC<PanelProps> = ({ label, children, stackProps }) => {
  return (
    <FormControl position="relative">
      <FormLabel fontWeight="bold" textTransform="uppercase">
        {label}
      </FormLabel>
      <VStack
        borderRadius="0.5rem"
        bgColor="white"
        border="1px solid #D7D7D7"
        padding="4"
        spacing="4"
        align="flex-start"
        {...stackProps}
      >
        {children}
      </VStack>
    </FormControl>
  );
};

export default Panel;
