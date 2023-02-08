import { FC } from "react";
import { Switch, SwitchProps } from "@chakra-ui/react";

import { BG_GRADIENT } from "constants/ui";

type SwitcherProps = SwitchProps & {};

const Switcher: FC<SwitcherProps> = (props) => {
  return (
    <Switch
      w="42px"
      display="inline-flex"
      alignItems="center"
      sx={{
        ".chakra-switch__track": {
          bgColor: "#363636",
          w: "100%",
          "&[data-checked]": {
            bgGradient: BG_GRADIENT,
            ".chakra-switch__thumb": {
              transform: "translateX(calc(42px - 100%))",
            },
          },
          "&[data-focus]": {
            boxShadow: "none",
          },
        },
      }}
      {...props}
    />
  );
};

export default Switcher;
