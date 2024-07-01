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
        gridTemplateColumns: 1,
        gridTemplateRows: 1,
      },
      2: {
        gridTemplateColumns: 2,
        gridTemplateRows: 1,
      },
      3: {
        gridTemplateColumns: 2,
        gridTemplateRows: 2,
        "& img:nth-child(1)": {
          gridRow: "1 / span 2",
        },
      },
      4: {
        gridTemplateColumns: 2,
        gridTemplateRows: 2,
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
