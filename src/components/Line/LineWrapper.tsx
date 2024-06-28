import { FC, ReactNode } from "react";
import { css } from "@/styled-system/css";

type Props = {
  children: ReactNode;
};

const LineWrapper: FC<Props> = ({ children }) => {
  return (
    <div
      className={css({
        display: "flex",
        flexDir: "column",
        w: 300,
        h: "100%",
        position: "relative",
        bgColor: "gray.100",
      })}
    >
      {children}
    </div>
  );
};

export default LineWrapper;
