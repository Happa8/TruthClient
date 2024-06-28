import { FC } from "react";
import { css } from "@/styled-system/css";
import { TMedia } from "@/src/hooks/connection";
import Image from "@/src/components/Common/Image";

type Props = {
  medias: TMedia[];
};

const Media: FC<Props> = ({ medias }) => {
  return (
    <div
      className={css({
        w: "100%",
        aspectRatio: "16/9",
        display: "grid",
        gridColumn: 2,
        gridRow: 2,
        overflow: "hidden",
        gridAutoFlow: "column",
        gap: 1,
        borderRadius: "sm",
      })}
    >
      {medias.map((m) => (
        <Image data={m} key={m.id} />
      ))}
    </div>
  );
};

export default Media;
