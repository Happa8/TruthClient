import { css } from "@/styled-system/css";
import { FC, ReactNode } from "react";
import { MdPin, MdPushPin, MdRepeat } from "react-icons/md";

type Props = {
  // children: ReactNode;
};

const PinnedNote: FC<Props> = () => {
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
        <MdPushPin />
      </span>

      <span>Pinned Truth</span>
    </p>
  );
};

export default PinnedNote;
