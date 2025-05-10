import { FC } from "react";
import { cva } from "@/styled-system/css";
import { TMedia } from "@/src/hooks/connection";
import Image from "@/src/components/Common/Image";

type Props = {
  medias: TMedia[];
};

const style = cva({
  base: {
    w: "100%",
    aspectRatio: "16/9",
    display: "grid",
    overflow: "hidden",
    gap: 1,
    borderRadius: "sm",
    borderWidth: 1,
    borderColor: "gray.200",
  },
  variants: {
    imageNum: {
      1: {
        gridTemplateColumns: "1fr",
        gridTemplateRows: "1fr",
      },
      2: {
        gridTemplateColumns: "50% 50%",
        gridTemplateRows: "1fr",
      },
      3: {
        gridTemplateColumns: "50% 50%",
        gridTemplateRows: "50% 50%",
        "& img:nth-child(1)": {
          gridRow: "1 / span 2",
        },
      },
      4: {
        gridTemplateColumns: "50% 50%",
        gridTemplateRows: "50% 50%",
      },
    },
  },
});

const Media: FC<Props> = ({ medias }) => {
  const mediaNum =
    medias.length == 1 ||
    medias.length == 2 ||
    medias.length == 3 ||
    medias.length == 4
      ? medias.length
      : 4;

  return (
    <div
      className={style({
        imageNum: mediaNum,
      })}
    >
      {medias.map((m) => (
        <Image data={m} key={m.id} />
      ))}
    </div>
  );
};

export default Media;
