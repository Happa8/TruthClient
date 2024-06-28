import { css, cx } from "@/styled-system/css";
import { ComponentProps, FC } from "react";

type Props = ComponentProps<"button">;

const Button: FC<Props> = ({ children, className, ...props }) => {
  return (
    <button
      className={cx(
        css({
          padding: 2,
          bgColor: "gray.200",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
          _hover: {
            bgColor: "gray.300",
          },
        }),
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
