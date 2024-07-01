import { css } from "@/styled-system/css";
import { FC, ReactNode } from "react";
import { MdRepeat } from "react-icons/md";

type Props = {
  children: ReactNode;
};

const RepostNote: FC<Props> = ({ children }) => {
  return (
    <p
      className={css({
        color: "gray.700",
        fontSize: "small",
        display: "inline-flex",
        alignItems: "center",
        gap: 1,
        justifyContent: "flex-start",
      })}
    >
      <span
        className={css({
          fontSize: "sm",
        })}
      >
        <MdRepeat />
      </span>
      <span
        className={css({
          fontWeight: "bold",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          overflow: "hidden",
          w: "fit-content",
        })}
      >
        {children}
      </span>
      <span>ReTruthed</span>
    </p>
  );
};

export default RepostNote;
