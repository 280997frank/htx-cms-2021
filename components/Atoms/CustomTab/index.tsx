import React, { FC } from "react";
import { Box, chakra, useStyles, useTab } from "@chakra-ui/react";
import { BG_GRADIENT } from "@/constants/ui";

const StyledTab = chakra("button");

const CustomTab: FC = (props) => {
  const tabProps = useTab(props);
  const isSelected = !!tabProps["aria-selected"];

  const styles = useStyles();

  return (
    <StyledTab
      __css={styles.tab}
      color={isSelected ? "black" : "#D7D7D7"}
      fontWeight="bold"
      _focus={{ outline: "none" }}
      {...tabProps}
    >
      {tabProps.children}
      <Box bgGradient={isSelected ? BG_GRADIENT : "none"} h="1">
        &nbsp;
      </Box>
    </StyledTab>
  );
};

export default CustomTab;
