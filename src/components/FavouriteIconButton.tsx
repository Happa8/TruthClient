import { cva } from "@/styled-system/css";
import { ComponentProps, FC } from "react";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";

type Props = {
  isFavourite: boolean;
  count: number;
} & ComponentProps<"span">;

const style = cva({
  base: {
    display: "inline-flex",
    alignItems: "center",
    gap: 1,
    cursor: "pointer",
  },
  variants: {
    isFavourite: {
      true: {
        color: "red.500",
      },
      false: {},
    },
  },
});

const FavouriteIconButton: FC<Props> = ({ isFavourite, count, ...props }) => {
  return (
    <span className={style({ isFavourite })} {...props}>
      {isFavourite ? <MdFavorite /> : <MdFavoriteBorder />} {count}
    </span>
  );
};

export default FavouriteIconButton;
