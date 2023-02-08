import { FC, ReactElement, MouseEvent } from "react";
import cx from "classnames";
import { BG_GRADIENT } from "../../../constants/ui";
import { Button, ButtonProps } from "@chakra-ui/react";

type CustomButtonProps = ButtonProps & {
  label: string;
  type: "button" | "submit" | "reset" | undefined;
  gradient?: boolean;
  className: string | Record<string, boolean>;
  onClick?: (event: MouseEvent) => void;
  form?: string;
  isLarge: boolean;
};

const ButtonForm: FC<CustomButtonProps> = ({
  label,
  gradient,
  className,
  type,
  form,
  isLarge,
  ...props
}): ReactElement => {
  const { onClick } = props;
  return (
    <Button
      {...props}
      form={form}
      className={cx("button", className)}
      onClick={onClick}
      type={type}
      color="white"
      background={BG_GRADIENT}
      style={{ width: isLarge ? "100%" : "" }}
    >
      {label}
    </Button>
  );
};

ButtonForm.defaultProps = {
  type: "button",
  gradient: false,
  className: "",
  onClick: undefined,
  isLarge: false,
};

export default ButtonForm;
