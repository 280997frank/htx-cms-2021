import { FC } from "react";
import { useField } from "formik";
import { Switch as ChakraSwitch } from "@chakra-ui/react";

// import { BG_GRADIENT } from "../../../constants/ui";

interface SwitchProps {
  name: string;
  id: string;
  isDisabled?: boolean;
}

const Switch: FC<SwitchProps> = ({ name, id, isDisabled = false }) => {
  const [{ value }, , { setValue, setTouched }] = useField(name);

  return (
    <ChakraSwitch
      id={id}
      isChecked={value === true}
      isDisabled={isDisabled}
      onChange={() => setValue(!value)}
      onBlur={() => setTouched(true)}
      // bgImage={BG_GRADIENT}
      colorScheme="red"
      display="flex"
      alignItems="center"
    />
  );
};

export default Switch;
