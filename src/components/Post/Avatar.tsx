import { css } from "@/styled-system/css";
import { ComponentProps, FC } from "react";

type Props = {
  mainImg: string;
  subImg?: string;
} & ComponentProps<"div">;

const Avatar: FC<Props> = ({ mainImg, subImg, ...props }) => {
  return (
    <div
      {...props}
      className={css({
        w: 8,
        h: 8,
        aspectRatio: "1/1",
        position: "relative",
        flexShrink: 0,
      })}
    >
      <img
        className={css({
          w: "100%",
          h: "100%",
          aspectRatio: "1/1",
          borderRadius: "full",
          overflow: "hidden",
        })}
        src={mainImg}
      />
      {subImg && (
        <img
          className={css({
            w: 6,
            h: 6,
            borderColor: "gray.100",
            borderWidth: 2,
            borderStyle: "solid",
            aspectRatio: "1/1",
            position: "absolute",
            bottom: -1,
            right: -1,
            borderRadius: "full",
            overflow: "hidden",
          })}
          src={subImg}
        />
      )}
    </div>
  );
};

export default Avatar;
