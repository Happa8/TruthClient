import { css, cx } from "@/styled-system/css";
import { ComponentProps, FC } from "react";

type Props = ComponentProps<"textarea">;

const TextArea: FC<Props> = ({ ...props }) => {
  return (
    <textarea
      className={cx(
        css({
          minH: 160,
          w: "100%",
          p: 2,
          borderWidth: 1,
          borderColor: "transparent",
          _focus: {
            outline: "none",
            borderColor: "gray.400",
            borderWidth: 1,
            boxSizing: "border-box",
          },
        }),
        props.className
      )}
      {...props}
    />
  );
};

export default TextArea;
