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
        }),
        props.className
      )}
      {...props}
    />
  );
};

export default TextArea;
