import { FC, ReactNode } from "react";
import { css } from "@/styled-system/css";
import ErrorBoundary from "../Common/ErrorBoundary";

type Props = {
  children: ReactNode;
};

const LineWrapper: FC<Props> = ({ children }) => {
  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
};

export default LineWrapper;
