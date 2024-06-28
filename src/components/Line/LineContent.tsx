import { css, cx } from "@/styled-system/css";
import { FC, ReactNode } from "react";

type Props = {
  children?: ReactNode;
  className?: string;
};

const LineContent: FC<Props> = ({ children, className }) => {
  return (
    <div
      className={cx(
        css({
          h: "100%",
          overflowY: "auto",
        }),
        className
      )}
    >
      {children}
    </div>
  );
};

export default LineContent;
